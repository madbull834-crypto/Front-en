export const PRESALE_ABI = [
  "function saleActive() view returns (bool)",
  "function claimEnabled() view returns (bool)",
  "function startTime() view returns (uint256)",
  "function publicSaleTokenPrice() view returns (uint256)",
  "function rate() view returns (uint256)",
  "function totalPublicUsdtRaised() view returns (uint256)",
  "function totalPrivateUsdtRaised() view returns (uint256)",
  "function totalUsdtRaised() view returns (uint256)",
  "function totalPresaleSold() view returns (uint256)",
  "function totalPrivateSold() view returns (uint256)",
  "function buyTokens(uint256 usdtAmount)",
  "function claimTokens()",
  "function getUserSaleRecord(address user) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
  "function setPublicSaleTokenPrice(uint256 newPriceInUsdt)",
  "function recordPrivateSaleInvestment(address buyer, uint256 usdtAmount)",
  "function owner() view returns (address)",
  "event TokensPurchased(address indexed buyer, uint256 usdtAmount, uint256 tokenAmount)",
  "event TokensClaimed(address indexed buyer, uint256 tokenAmount)"
] as const;

export const ERC20_ABI = [
  "function approve(address spender, uint256 value) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
] as const;
