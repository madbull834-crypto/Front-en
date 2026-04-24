export type WalletState = {
  account: string;
  chainId: number;
  connected: boolean;
};

export type SaleSnapshot = {
  saleActive: boolean;
  claimEnabled: boolean;
  startTime: bigint;
  publicSaleTokenPrice: bigint;
  rate: bigint;
  totalPublicUsdtRaised: bigint;
  totalPrivateUsdtRaised: bigint;
  totalUsdtRaised: bigint;
  totalPresaleSold: bigint;
  totalPrivateSold: bigint;
};

export type UserRecord = {
  publicUsdtInvested: bigint;
  privateUsdtInvestedAmount: bigint;
  publicTokensPurchased: bigint;
  privateTokensPurchased: bigint;
  totalTokensPurchased: bigint;
  totalTokensClaimed: bigint;
  claimableNow: bigint;
};
