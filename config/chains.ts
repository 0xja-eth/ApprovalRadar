export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  threshold: string; // Threshold in token units (e.g., "1000" for 1000 USDT)
}

export interface Chain {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  tokens: Token[];
}

// ERC20 Approval event signature
export const APPROVAL_EVENT_SIGNATURE = "Approval(address,address,uint256)";

export const chains: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    rpcUrl: "https://ethereum.publicnode.com",
    explorerUrl: "https://etherscan.io",
    tokens: [
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        decimals: 6,
        threshold: "1000",
      },
      {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        symbol: "USDC",
        decimals: 6,
        threshold: "1000",
      },
    ],
  },
  {
    id: 56,
    name: "BSC",
    rpcUrl: "https://bsc.publicnode.com",
    explorerUrl: "https://bscscan.com",
    tokens: [
      {
        address: "0x55d398326f99059fF775485246999027B3197955",
        symbol: "USDT",
        decimals: 18,
        threshold: "1000",
      },
      {
        address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        symbol: "USDC",
        decimals: 18,
        threshold: "1000",
      },
    ],
  },
  {
    id: 42161,
    name: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    tokens: [
      {
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        symbol: "USDT",
        decimals: 6,
        threshold: "1000",
      },
      {
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        symbol: "USDC",
        decimals: 6,
        threshold: "1000",
      },
    ],
  },
  {
    id: 10,
    name: "Optimism",
    rpcUrl: "https://optimism.publicnode.com",
    explorerUrl: "https://optimistic.etherscan.io",
    tokens: [
      {
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        symbol: "USDT",
        decimals: 6,
        threshold: "1000",
      },
      {
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        symbol: "USDC",
        decimals: 6,
        threshold: "1000",
      },
    ],
  },
  {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    tokens: [
      {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        symbol: "USDC",
        decimals: 6,
        threshold: "1000",
      },
    ],
  },
];
