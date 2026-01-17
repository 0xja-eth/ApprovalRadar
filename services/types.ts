export interface ApprovalEvent {
  id: string;
  chainId: number;
  chainName: string;
  explorerUrl: string;
  tokenAddress: string;
  tokenSymbol: string;
  owner: string;
  spender: string;
  value: string;
  valueFormatted: string;
  isUnlimited: boolean;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}
