type Props = {
  disabled: boolean;
  onClaim: () => Promise<void>;
};

export default function ClaimCard({ disabled, onClaim }: Props) {
  return (
    <section className="card">
      <h2>Claim</h2>
      <p className="muted">Claim releases according to your Presale and Private vesting schedule.</p>
      <button className="btn" disabled={disabled} onClick={() => void onClaim()}>
        Claim Tokens
      </button>
    </section>
  );
}
