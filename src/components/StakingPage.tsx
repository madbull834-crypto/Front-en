import { useMemo, useState, useEffect } from "react";
import { BLOCK_EXPLORER, STAKING_ADDRESS, USDT_DECIMALS } from "../config/contracts";
import { useStaking } from "../hooks/useStaking";
import { formatAmount, formatTimestamp, shortAddress } from "../lib/format";
import type { WalletState } from "../types/presale";
import type { StakingPosition } from "../types/staking";

type StakingPageProps = {
  wallet: WalletState;
  wrongNetwork: boolean;
  connect: () => Promise<void>;
  onBack: () => void;
};

function formatBps(bps: bigint) {
  return `${(Number(bps) / 100).toFixed(2)}%`;
}

function depositStatus(position: StakingPosition) {
  if (position.closed) return "Closed";
  if (Date.now() >= Number(position.endTime) * 1000) return "Matured";
  return "Active";
}

/** Returns a human-readable "Xd Yh" string from now until a unix-seconds timestamp. */
function timeRemaining(endTimeSecs: bigint): string {
  const msLeft = Number(endTimeSecs) * 1000 - Date.now();
  if (msLeft <= 0) return "Matured";
  const days = Math.floor(msLeft / 86_400_000);
  const hours = Math.floor((msLeft % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((msLeft % 3_600_000) / 60_000);
  return `${hours}h ${mins}m remaining`;
}

/** 0–100 progress of the staking lock period. */
function lockProgress(start: bigint, end: bigint): number {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const total = end - start;
  if (total <= 0n) return 100;
  const elapsed = now - start;
  if (elapsed <= 0n) return 0;
  if (elapsed >= total) return 100;
  return Math.round((Number(elapsed) / Number(total)) * 100);
}

/** Estimate daily ROI in USDT given a raw stake amount string and dailyRoiBps. */
function estimateDailyRoi(amountStr: string, dailyRoiBps: bigint): string {
  const val = parseFloat(amountStr);
  if (!isFinite(val) || val <= 0 || dailyRoiBps === 0n) return "";
  const daily = (val * Number(dailyRoiBps)) / 10_000;
  return daily.toFixed(4);
}

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

export default function StakingPage({ wallet, wrongNetwork, connect, onBack }: StakingPageProps) {
  const {
    snapshot,
    stakingAccount,
    usdtBalance,
    usdtAllowance,
    loading,
    txLoading,
    error,
    refresh,
    stake,
    claimRoi,
    withdrawPrincipal,
    claimReferralRewards,
    claimFounderRewards
  } = useStaking(wallet.account);

  const [stakeAmount, setStakeAmount] = useState("");
  // referrerAddress is auto-filled from ?ref= URL param; user never types it manually
  const [referrerAddress, setReferrerAddress] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") ?? "";
  });
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Build the user's own shareable link (their wallet address as ?ref=)
  const shareableLink = useMemo(() => {
    if (!wallet.account) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("ref", wallet.account);
    url.hash = "";
    return url.toString();
  }, [wallet.account]);

  const totals = useMemo(() => {
    return stakingAccount.positions.reduce(
      (acc, position) => {
        acc.principal += position.principalUsdt;
        acc.pending += position.pendingRoi;
        acc.claimed += position.claimedRoi;
        return acc;
      },
      { principal: 0n, pending: 0n, claimed: 0n }
    );
  }, [stakingAccount.positions]);

  const roiReadyPositions = useMemo(
    () => stakingAccount.positions.filter((position) => !position.closed && position.pendingRoi > 0n),
    [stakingAccount.positions]
  );

  const dailyEstimate = estimateDailyRoi(stakeAmount, snapshot.dailyRoiBps);

  const blockExplorerContractUrl =
    BLOCK_EXPLORER && STAKING_ADDRESS
      ? `${BLOCK_EXPLORER.replace(/\/$/, "")}/address/${STAKING_ADDRESS}#writeContract`
      : "";

  function handleCopyAddress() {
    if (!wallet.account) return;
    copyToClipboard(wallet.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyLink() {
    if (!shareableLink) return;
    void navigator.clipboard.writeText(shareableLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleMax() {
    const bal = Number(usdtBalance) / 10 ** USDT_DECIMALS;
    setStakeAmount(bal > 0 ? bal.toFixed(2) : "");
  }

  return (
    <>
      <div className="grid-bg" />
      <nav>
        <button className="nav-link-btn nav-back" onClick={onBack}>Back To Home</button>
        <div className="nav-logo">
          <span className="logo-red">MAD</span>
          <span className="logo-green">BULL</span>
        </div>
        <button className="btn-primary nav-btn" onClick={() => void connect()}>
          {wallet.connected ? shortAddress(wallet.account) : "Connect"}
        </button>
      </nav>

      <main className="page-shell">
        <section className="page-hero">
          <div className="section-label">Staking Program</div>
          <h1 className="section-title">Stake USDT And Track <span>Every Position</span></h1>
          <p className="section-text">
            Earn {formatBps(snapshot.dailyRoiBps)} daily ROI on your USDT. Deposits run for a fixed term — claim ROI any time and withdraw your principal at maturity.
          </p>
          <div className="btn-group">
            <button className="btn-primary" onClick={() => window.scrollTo({ top: 540, behavior: "smooth" })}>
              Start Staking
            </button>
            <button className="btn-secondary" onClick={onBack}>
              Return Home
            </button>
          </div>
        </section>

        <section className="section stake-page">
          {wrongNetwork && (
            <div className="notice warning">Wrong network — switch to the correct network before staking.</div>
          )}
          {error && <div className="notice error">{error}</div>}
          {txLoading && (
            <div className="notice info">Transaction in progress — please wait and do not close the page...</div>
          )}
          {!STAKING_ADDRESS && (
            <div className="notice error">Staking contract address not configured. Contact the admin.</div>
          )}

          {/* ── Protocol Stats ── */}
          <div className="stake-overview">
            <div className="pcard">
              <span className="pcard-val" style={{ color: snapshot.depositsLive ? "var(--bull-green)" : "#f87171" }}>
                {snapshot.depositsLive ? "Open" : "Paused"}
              </span>
              <span className="pcard-label">Deposits</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatBps(snapshot.dailyRoiBps)}</span>
              <span className="pcard-label">Daily ROI</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatAmount(snapshot.minDeposit, USDT_DECIMALS, 0)} USDT</span>
              <span className="pcard-label">Min Deposit</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatAmount(snapshot.totalActivePrincipal, USDT_DECIMALS, 0)} USDT</span>
              <span className="pcard-label">Total Staked</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatBps(snapshot.level1InstantBps)}</span>
              <span className="pcard-label">L1 Instant Referral</span>
            </div>
            <div className="pcard">
              <span className="pcard-val" style={{ color: "#f87171" }}>{formatBps(snapshot.earlyWithdrawalPenaltyBps)}</span>
              <span className="pcard-label">Early Exit Penalty</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatAmount(snapshot.requiredUnreservedUsdt, USDT_DECIMALS, 0)}</span>
              <span className="pcard-label">Required Liquidity</span>
            </div>
            <div className="pcard">
              <span className="pcard-val">{formatAmount(snapshot.availableExcessUsdt, USDT_DECIMALS, 0)}</span>
              <span className="pcard-label">Excess Liquidity</span>
            </div>
          </div>

          <div className="stake-grid">
            {/* ── New Stake Form ── */}
            <div className="action-panel">
              <div className="card-title">New Stake</div>

              <div className="stake-input-wrap">
                <input
                  className="input"
                  value={stakeAmount}
                  onChange={(event) => setStakeAmount(event.target.value)}
                  placeholder={`Min ${formatAmount(snapshot.minDeposit, USDT_DECIMALS, 0)} USDT`}
                  type="number"
                  min="0"
                  step="1"
                />
                <button className="btn-max" onClick={handleMax} disabled={!wallet.connected}>
                  MAX
                </button>
              </div>

              {dailyEstimate && (
                <div className="stake-estimate">
                  Estimated daily earnings: <strong>~{dailyEstimate} USDT</strong>
                </div>
              )}

              {referrerAddress ? (
                <div className="stake-hint-row" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px" }}>
                  <span>Referred by</span>
                  <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {shortAddress(referrerAddress)}
                    <button className="btn-copy" style={{ fontSize: "0.75em" }} onClick={() => setReferrerAddress("")}>Remove</button>
                  </strong>
                </div>
              ) : (
                <p className="stake-note" style={{ margin: 0 }}>No referral — open a referral link to apply one automatically.</p>
              )}

              <div className="stake-hint-row">
                <span>Your USDT Balance</span>
                <strong>{formatAmount(usdtBalance, USDT_DECIMALS, 2)} USDT</strong>
              </div>
              <div className="stake-hint-row">
                <span>Approved Allowance</span>
                <strong>{formatAmount(usdtAllowance, USDT_DECIMALS, 2)} USDT</strong>
              </div>

              <div className="btn-group-left">
                <button
                  className="btn-primary"
                  disabled={!wallet.connected || wrongNetwork || txLoading || stakeAmount.length === 0 || !STAKING_ADDRESS || !snapshot.depositsLive}
                  onClick={async () => {
                    await stake(stakeAmount, referrerAddress);
                    setStakeAmount("");
                  }}
                >
                  {txLoading ? "Processing..." : "Approve + Stake"}
                </button>
                <button className="btn-secondary" disabled={loading || txLoading} onClick={() => void refresh()}>
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {!snapshot.depositsLive && STAKING_ADDRESS && (
                <p className="stake-note" style={{ color: "#f87171" }}>
                  Deposits are currently paused by the admin.
                </p>
              )}
            </div>

            {/* ── Share Referral Link ── */}
            <div className="action-panel">
              <div className="card-title">Your Referral Link</div>
              <p className="stake-subtext">
                Share this link. Anyone who opens it will have your wallet pre-set as their referrer — no manual entry needed.
              </p>
              {wallet.connected ? (
                <>
                  <div className="stake-hint-row" style={{ wordBreak: "break-all" }}>
                    <span>Your Link</span>
                    <strong style={{ fontSize: "0.8em", opacity: 0.85 }}>{shareableLink}</strong>
                  </div>
                  <div className="btn-group-left" style={{ marginTop: 8 }}>
                    <button className="btn-primary" onClick={handleCopyLink}>
                      {copiedLink ? "Copied!" : "Copy Referral Link"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="stake-note">Connect your wallet to generate your referral link.</p>
              )}
            </div>

            {/* ── Wallet Summary ── */}
            <div className="action-panel">
              <div className="card-title">Your Staking Wallet</div>
              <div className="record-grid">
                <div>
                  <span>Connected Wallet</span>
                  <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {wallet.connected ? shortAddress(wallet.account) : "Not connected"}
                    {wallet.connected && (
                      <button className="btn-copy" onClick={handleCopyAddress} title="Copy address">
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </strong>
                </div>
                <div><span>Your Referrer</span><strong>{stakingAccount.referrer ? shortAddress(stakingAccount.referrer) : "None"}</strong></div>
                <div>
                  <span>Your Referral Link</span>
                  <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {wallet.connected ? (
                      <button className="btn-copy" onClick={handleCopyLink}>
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </button>
                    ) : "Connect wallet"}
                  </strong>
                </div>
                <div><span>Total Deposits</span><strong>{stakingAccount.positions.length}</strong></div>
                <div><span>Total Staked</span><strong>{formatAmount(totals.principal, USDT_DECIMALS, 2)} USDT</strong></div>
                <div><span>Pending ROI</span><strong>{formatAmount(totals.pending, USDT_DECIMALS, 4)} USDT</strong></div>
                <div><span>Claimed ROI</span><strong>{formatAmount(totals.claimed, USDT_DECIMALS, 2)} USDT</strong></div>
                <div><span>Referral Rewards</span><strong>{formatAmount(stakingAccount.claimableReferralRewards, USDT_DECIMALS, 2)} USDT</strong></div>
                <div>
                  <span>Founder Status</span>
                  <strong style={{ color: stakingAccount.isFounder ? "var(--bull-green)" : "#fff" }}>
                    {stakingAccount.isFounder ? "Founder" : "—"}
                  </strong>
                </div>
              </div>

              {/* Referral Claim */}
              <div className="btn-group-left mt12">
                <button
                  className="btn-secondary"
                  disabled={!wallet.connected || wrongNetwork || txLoading || stakingAccount.claimableReferralRewards === 0n}
                  onClick={() => void claimReferralRewards()}
                >
                  {txLoading ? "Processing..." : "Claim Referral Rewards"}
                </button>
              </div>

              {/* Founder Claim */}
              {stakingAccount.isFounder && (
                <div className="founder-claim-box">
                  <div className="founder-claim-title">Founder Rewards</div>
                  <div className="founder-claim-amount">
                    {formatAmount(stakingAccount.claimableFounderRewards, USDT_DECIMALS, 4)} USDT claimable
                  </div>
                  <div className="btn-group-left" style={{ marginTop: 8 }}>
                    <button
                      className="btn-primary"
                      disabled={!wallet.connected || wrongNetwork || txLoading || stakingAccount.claimableFounderRewards === 0n}
                      onClick={() => void claimFounderRewards()}
                    >
                      {txLoading ? "Processing..." : "Claim Founder Rewards"}
                    </button>
                  </div>
                </div>
              )}

              <p className="stake-note">
                ROI accrues every second. Claim ROI from any active position at any time. Principal is released at maturity.
              </p>
            </div>
          </div>

          {/* ── ROI Claim Center ── */}
          <div className="action-panel">
            <div className="stake-section-head">
              <div>
                <div className="card-title">ROI Claim Center</div>
                <p className="stake-subtext">
                  ROI can be claimed from here. Each stake position has its own ROI claim action, and only active deposits with accrued rewards appear below.
                </p>
              </div>
              <div className="stake-contract">
                <span>Ready To Claim</span>
                <strong>{roiReadyPositions.length} Deposits</strong>
              </div>
            </div>

            {roiReadyPositions.length === 0 ? (
              <div className="stake-empty">
                <strong>No ROI available yet.</strong>
                <span>Once your active stake accrues rewards, the ROI claim button will appear here automatically.</span>
              </div>
            ) : (
              <div className="stake-claim-grid">
                {roiReadyPositions.map((position) => (
                  <div key={`roi-${position.id.toString()}`} className="stake-claim-card">
                    <div className="stake-claim-copy">
                      <span>Deposit #{position.id.toString()}</span>
                      <strong>{formatAmount(position.pendingRoi, USDT_DECIMALS, 4)} USDT</strong>
                    </div>
                    <button
                      className="btn-primary"
                      disabled={!wallet.connected || wrongNetwork || txLoading}
                      onClick={() => void claimRoi(position.id)}
                    >
                      Claim ROI
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Positions List ── */}
          <div className="action-panel">
            <div className="stake-section-head">
              <div>
                <div className="card-title">Your Stake Positions</div>
                <p className="stake-subtext">Each deposit runs independently with its own lock period and ROI balance.</p>
              </div>
              <div className="stake-contract">
                <span>Staking Contract</span>
                {STAKING_ADDRESS && blockExplorerContractUrl ? (
                  <a
                    href={`${BLOCK_EXPLORER.replace(/\/$/, "")}/address/${STAKING_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stake-explorer-link"
                  >
                    {shortAddress(STAKING_ADDRESS)} ↗
                  </a>
                ) : (
                  <strong>{STAKING_ADDRESS ? shortAddress(STAKING_ADDRESS) : "Not configured"}</strong>
                )}
              </div>
            </div>

            {stakingAccount.positions.length === 0 ? (
              <div className="stake-empty">
                <strong>No deposits yet.</strong>
                <span>Create your first stake above once your wallet is connected and funded with USDT.</span>
              </div>
            ) : (
              <div className="stake-list">
                {stakingAccount.positions.map((position) => {
                  const status = depositStatus(position);
                  const canWithdraw = !position.closed && status === "Matured";
                  const canClaim = !position.closed && position.pendingRoi > 0n;
                  const progress = status === "Active" ? lockProgress(position.startTime, position.endTime) : 100;

                  return (
                    <article key={position.id.toString()} className="stake-position">
                      <div className="stake-position-head">
                        <div>
                          <div className="stake-position-id">Deposit #{position.id.toString()}</div>
                          <div className="stake-position-status">
                            <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>
                          </div>
                        </div>
                        <div className="stake-actions">
                          <button
                            className="btn-secondary"
                            disabled={!wallet.connected || wrongNetwork || txLoading || !canClaim}
                            onClick={() => void claimRoi(position.id)}
                          >
                            Claim ROI
                          </button>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            {!position.closed && status === "Active" && snapshot.earlyWithdrawalPenaltyBps > 0n && (
                              <span style={{ fontSize: "0.72em", color: "#f87171" }}>
                                {formatBps(snapshot.earlyWithdrawalPenaltyBps)} early exit penalty
                              </span>
                            )}
                            <button
                              className="btn-primary"
                              disabled={!wallet.connected || wrongNetwork || txLoading || position.closed || position.principalWithdrawn}
                              onClick={() => void withdrawPrincipal(position.id)}
                            >
                              {status === "Active" ? "Early Withdraw" : "Withdraw Principal"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Lock period progress bar */}
                      {!position.closed && (
                        <div className="stake-progress-wrap">
                          <div className="stake-progress-bar">
                            <div
                              className="stake-progress-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="stake-progress-label">
                            <span>{status === "Active" ? timeRemaining(position.endTime) : "Matured — ready to withdraw"}</span>
                            <span>{progress}%</span>
                          </div>
                        </div>
                      )}

                      <div className="record-grid">
                        <div><span>Principal</span><strong>{formatAmount(position.principalUsdt, USDT_DECIMALS, 2)} USDT</strong></div>
                        <div><span>Pending ROI</span><strong style={{ color: position.pendingRoi > 0n ? "var(--bull-green)" : undefined }}>{formatAmount(position.pendingRoi, USDT_DECIMALS, 4)} USDT</strong></div>
                        <div><span>Claimed ROI</span><strong>{formatAmount(position.claimedRoi, USDT_DECIMALS, 2)} USDT</strong></div>
                        <div><span>Maturity Date</span><strong>{formatTimestamp(position.endTime)}</strong></div>
                        <div><span>Start Date</span><strong>{formatTimestamp(position.startTime)}</strong></div>
                        <div><span>Last Accrual</span><strong>{formatTimestamp(position.lastAccrualTime)}</strong></div>
                        {position.level1 && <div><span>L1 Referrer</span><strong>{shortAddress(position.level1)}</strong></div>}
                        {position.level2 && <div><span>L2 Referrer</span><strong>{shortAddress(position.level2)}</strong></div>}
                        {position.level3 && <div><span>L3 Referrer</span><strong>{shortAddress(position.level3)}</strong></div>}
                        <div><span>Principal Withdrawn</span><strong>{position.principalWithdrawn ? "Yes" : "No"}</strong></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
