import { TOKEN_DECIMALS, USDT_DECIMALS } from "../config/contracts";
import { formatAmount } from "../lib/format";
import type { UserRecord } from "../types/presale";

type Props = {
  data: UserRecord;
};

export default function UserRecordCard({ data }: Props) {
  return (
    <section className="card">
      <h2>Your Record</h2>
      <div className="grid two">
        <p>Public Invested: <strong>{formatAmount(data.publicUsdtInvested, USDT_DECIMALS, 2)} USDT</strong></p>
        <p>Private Invested: <strong>{formatAmount(data.privateUsdtInvestedAmount, USDT_DECIMALS, 2)} USDT</strong></p>
        <p>Public Tokens: <strong>{formatAmount(data.publicTokensPurchased, TOKEN_DECIMALS, 2)}</strong></p>
        <p>Private Tokens: <strong>{formatAmount(data.privateTokensPurchased, TOKEN_DECIMALS, 2)}</strong></p>
        <p>Total Purchased: <strong>{formatAmount(data.totalTokensPurchased, TOKEN_DECIMALS, 2)}</strong></p>
        <p>Total Claimed: <strong>{formatAmount(data.totalTokensClaimed, TOKEN_DECIMALS, 2)}</strong></p>
        <p>Claimable Now: <strong>{formatAmount(data.claimableNow, TOKEN_DECIMALS, 4)}</strong></p>
      </div>
    </section>
  );
}
