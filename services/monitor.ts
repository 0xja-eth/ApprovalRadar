import { ethers } from "ethers";
import { chains, APPROVAL_EVENT_SIGNATURE } from "@/config/chains";
import { ApprovalEvent } from "./types";

// ERC20 ABI for Approval event
const ERC20_ABI = [
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

class ApprovalMonitor {
  private events: ApprovalEvent[] = [];
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();
  private contracts: ethers.Contract[] = [];
  private maxEvents = 5000;
  private lastCheckedBlock: Map<string, number> = new Map();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    chains.forEach((chain) => {
      const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
      this.providers.set(chain.id, provider);
    });
  }

  async startMonitoring() {
    if (this.isMonitoring) {
      console.log("Monitoring is already active");
      return;
    }

    console.log("Starting approval monitoring...");
    this.isMonitoring = true;
    this.contracts = [];

    for (const chain of chains) {
      const provider = this.providers.get(chain.id);
      if (!provider) continue;

      for (const token of chain.tokens) {
        this.monitorToken(chain.id, chain.name, chain.explorerUrl, token, provider);
      }
    }
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      console.log("Monitoring is not active");
      return;
    }

    console.log("Stopping approval monitoring...");
    this.isMonitoring = false;

    // Remove all event listeners
    this.contracts.forEach((contract) => {
      contract.removeAllListeners();
    });
    this.contracts = [];

    console.log("✓ Monitoring stopped");
  }

  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      eventCount: this.events.length,
      contractCount: this.contracts.length,
    };
  }

  private async monitorToken(
    chainId: number,
    chainName: string,
    explorerUrl: string,
    token: any,
    provider: ethers.JsonRpcProvider
  ) {
    try {
      // Test RPC connection
      const network = await provider.getNetwork();
      console.log(`✓ Connected to ${chainName} (Chain ID: ${network.chainId})`);

      const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
      const threshold = ethers.parseUnits(token.threshold, token.decimals);

      // Store contract reference for later cleanup
      this.contracts.push(contract);

      console.log(`✓ Monitoring ${token.symbol} on ${chainName} (threshold: ${token.threshold})`);

      // Set up event listener with error handling
      contract.on("Approval", async (owner, spender, value, event) => {
        try {
          console.log(`📝 Approval event detected: ${token.symbol} on ${chainName}, value: ${ethers.formatUnits(value, token.decimals)}`);

          if (value >= threshold) {
            console.log(`✓ Large approval detected! ${token.symbol} on ${chainName}`);
            const approvalEvent = await this.createApprovalEvent(
              chainId,
              chainName,
              explorerUrl,
              token,
              owner,
              spender,
              value,
              event
            );
            this.addEvent(approvalEvent);
          } else {
            console.log(`✗ Approval below threshold: ${ethers.formatUnits(value, token.decimals)} < ${token.threshold}`);
          }
        } catch (err) {
          console.error(`Error processing approval event for ${token.symbol} on ${chainName}:`, err);
        }
      });

      // Listen for errors
      contract.on("error", (error) => {
        console.error(`Error in contract listener for ${token.symbol} on ${chainName}:`, error);
      });

      console.log(`✓ Event listener set up for ${token.symbol} on ${chainName}`);
    } catch (error) {
      console.error(`✗ Failed to set up monitoring for ${token.symbol} on ${chainName}:`, error);
    }
  }

  private async createApprovalEvent(
    chainId: number,
    chainName: string,
    explorerUrl: string,
    token: any,
    owner: string,
    spender: string,
    value: bigint,
    event: any
  ): Promise<ApprovalEvent> {
    // Check if this is an unlimited approval (> 10 billion)
    const tenBillion = ethers.parseUnits("10000000000", token.decimals);
    const isUnlimited = value >= tenBillion;
    const valueFormatted = ethers.formatUnits(value, token.decimals);
    const block = await event.getBlock();

    return {
      id: `${chainId}-${event.log.transactionHash}-${event.log.index}`,
      chainId,
      chainName,
      explorerUrl,
      tokenAddress: token.address,
      tokenSymbol: token.symbol,
      owner,
      spender,
      value: value.toString(),
      valueFormatted,
      isUnlimited,
      transactionHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber,
      timestamp: block.timestamp * 1000,
    };
  }

  private addEvent(event: ApprovalEvent) {
    this.events.unshift(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    console.log(`New approval: ${event.tokenSymbol} on ${event.chainName}`);
  }

  getEvents(): ApprovalEvent[] {
    return this.events;
  }
}

export const approvalMonitor = new ApprovalMonitor();
