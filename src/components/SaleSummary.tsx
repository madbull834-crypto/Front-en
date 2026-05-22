import { TOKEN_DECIMALS, USDT_DECIMALS } from "../config/contracts";
import { formatAmount, formatTimestamp } from "../lib/format";
import type { SaleSnapshot } from "../types/presale";

type Props = {
  data: SaleSnapshot;
};

export default function SaleSummary({ data }: Props) {
  return (
    <section className="card">
      <h2>Sale Status</h2>
      <div className="grid two">
        <p>Sale Start: <strong>{formatTimestamp(data.startTime)}</strong></p>
        <p>Public Price: <strong>{formatAmount(data.publicSaleTokenPrice, USDT_DECIMALS, 4)} USDT</strong></p>
        <p>Sale Active: <strong>{data.saleActive ? "Yes" : "No"}</strong></p>
        <p>Claim Enabled: <strong>{data.claimEnabled ? "Yes" : "No"}</strong></p>
        <p>Public Raised: <strong>{formatAmount(data.totalPublicUsdtRaised, USDT_DECIMALS, 2)} USDT</strong></p>
        <p>Private Raised: <strong>{formatAmount(data.totalPrivateUsdtRaised, USDT_DECIMALS, 2)} USDT</strong></p>
        <p>Total Raised: <strong>{formatAmount(data.totalUsdtRaised, USDT_DECIMALS, 2)} USDT</strong></p>
        <p>Public Tokens Sold: <strong>{formatAmount(data.totalPresaleSold, TOKEN_DECIMALS, 2)}</strong></p>
        <p>Private Tokens Sold: <strong>{formatAmount(data.totalPrivateSold, TOKEN_DECIMALS, 2)}</strong></p>
      </div>
    </section>
  );
}
