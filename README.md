# Madbull Presale Frontend

Production-oriented React + ethers v6 frontend for the `Presale.sol` contract.

## Setup

1. Copy env template:
   - `cp .env.example .env`
2. Fill all addresses and RPC values in `.env`.
3. Install dependencies:
   - `npm install`
4. Run local app:
   - `npm run dev`

## Build

- `npm run build`
- `npm run preview`

## Key Flows Implemented

- Wallet connect (injected wallet)
- Public buy flow: USDT approve then `buyTokens`
- Claim flow: `claimTokens`
- Owner-only flows:
  - Set public sale price: `setPublicSaleTokenPrice`
  - Record private sale investment: buyer approve then `recordPrivateSaleInvestment`
- User and sale dashboard data from chain reads
