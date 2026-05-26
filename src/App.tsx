import { useMemo, useState } from "react";
import { formatUnits } from "ethers";
import { useWallet } from "./hooks/useWallet";
import { usePresale } from "./hooks/usePresale";
import { CHAIN_NAME, USDT_DECIMALS } from "./config/contracts";
import { formatAmount, formatTimestamp, shortAddress } from "./lib/format";
import WhitepaperPage from "./components/WhitepaperPage";
import StakingPage from "./components/StakingPage";
import SocialLinks from "./components/SocialLinks";

export default function App() {
  const { wallet, connect, wrongNetwork } = useWallet();
  const { snapshot, record, publicInvestors, madbullBalance, loading, txLoading, error, isOwner, refresh, buyPublic, claim, setPublicPrice, recordPrivateInvestment } = usePresale(wallet.account);
  const [buyAmount, setBuyAmount] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [privateBuyer, setPrivateBuyer] = useState("");
  const [privateAmount, setPrivateAmount] = useState("");
  const [activePage, setActivePage] = useState<"home" | "staking" | "whitepaper">("home");

  const publicPrice = useMemo(() => {
    try {
      return Number(formatUnits(snapshot.publicSaleTokenPrice, USDT_DECIMALS)).toFixed(4);
    } catch {
      return "0.04";
    }
  }, [snapshot.publicSaleTokenPrice]);

  const raisedPct = useMemo(() => {
    const hardCap = 1_456_000; // 7% of 51M at $0.04
    const raised = Number(formatUnits(snapshot.totalPublicUsdtRaised, USDT_DECIMALS));
    if (!Number.isFinite(raised) || hardCap <= 0) return 0;
    return Math.max(0, Math.min(100, (raised / hardCap) * 100));
  }, [snapshot.totalPublicUsdtRaised]);

  const progressLabel = useMemo(() => {
    if (raisedPct === 0) return "0.00";
    if (raisedPct < 0.01) return raisedPct.toFixed(4);
    return raisedPct.toFixed(2);
  }, [raisedPct]);

  const progressWidth = useMemo(() => {
    if (raisedPct > 0 && raisedPct < 0.25) return 0.25;
    return raisedPct;
  }, [raisedPct]);

  if (activePage === "whitepaper") {
    return <WhitepaperPage onBack={() => setActivePage("home")} />;
  }

  if (activePage === "staking") {
    return (
      <StakingPage
        wallet={wallet}
        connect={connect}
        wrongNetwork={wrongNetwork}
        onBack={() => setActivePage("home")}
      />
    );
  }

  return (
    <>
      <div className="grid-bg" />
      <nav>
        <a href="#home" className="nav-logo">
          <span className="logo-red">MAD</span>
          <span className="logo-green">BULL</span>
        </a>
        <ul className="nav-links">
          <li><a href="#presale">Presale</a></li>
          <li><button className="nav-link-btn" onClick={() => setActivePage("staking")}>Stake</button></li>
          <li><a href="#airdrop">Airdrop</a></li>
          <li><a href="#utility">Utility</a></li>
          <li><a href="#tokenomics">Tokenomics</a></li>
          <li><a href="#roadmap">Roadmap</a></li>
          <li><button className="nav-link-btn" onClick={() => setActivePage("whitepaper")}>Whitepaper</button></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-primary nav-btn" onClick={() => void connect()}>
            {wallet.connected ? shortAddress(wallet.account) : "Connect"}
          </button>
        </div>
      </nav>

      <header className="hero" id="home">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-tag">MadBull Presale Is Live</div>
        <h1><span className="logo-red">MAD</span><span className="logo-green">BULL</span></h1>
        <p className="hero-sub">MADBULL TOKEN - POWER THE KNOWLEDGE GAME</p>

        <div className="hero-stats">
          <div className="stat-box"><span className="stat-val">51M</span><span className="stat-label">Total Supply</span></div>
          <div className="stat-box"><span className="stat-val">${publicPrice}</span><span className="stat-label">Public Price</span></div>
          <div className="stat-box"><span className="stat-val">7%</span><span className="stat-label">Presale Allocation</span></div>
          <div className="stat-box"><span className="stat-val">12%</span><span className="stat-label">Private Allocation</span></div>
        </div>

        <div className="btn-group">
          <a href="#presale" className="btn-primary">Join Presale</a>
          <button className="btn-secondary" onClick={() => setActivePage("staking")}>Stake</button>
          <a href="#airdrop" className="btn-secondary">Airdrop</a>
        </div>

        <div className="presale-progress">
          <div className="progress-label">
            <span>PRESALE PROGRESS</span>
            <span>{progressLabel}% FILLED</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressWidth}%` }} /></div>
          <div className="progress-info">
            <div>
              <span className="small-head">CURRENT PRICE</span>
              <div className="price-tag">${publicPrice}</div>
            </div>
            <div className="text-right">
              <span className="small-head">PUBLIC RAISED</span>
              <div className="big-green">{formatAmount(snapshot.totalPublicUsdtRaised, USDT_DECIMALS, 2)} USDT</div>
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="presale">
        <div className="section-label">01 - Presale</div>
        <h2 className="section-title">Get Early Access <span>Before Listing</span></h2>
        <p className="section-text">Buy from wallet with on-chain approve + buy flow. Claims follow your vesting schedule.</p>

        {wrongNetwork && (
          <div className="notice warning">Wrong network detected. Switch to {CHAIN_NAME}.</div>
        )}
        {error && <div className="notice error">{error}</div>}

        <div className="presale-cards">
          <div className="pcard"><span className="pcard-val">${publicPrice}</span><span className="pcard-label">Public Price</span></div>
          <div className="pcard"><span className="pcard-val">{formatAmount(snapshot.totalUsdtRaised, USDT_DECIMALS, 2)}</span><span className="pcard-label">Total USDT Raised</span></div>
          <div className="pcard"><span className="pcard-val">{formatAmount(snapshot.totalPresaleSold, 18, 0)}</span><span className="pcard-label">Public Tokens Sold</span></div>
          <div className="pcard"><span className="pcard-val">{formatAmount(snapshot.totalPrivateSold, 18, 0)}</span><span className="pcard-label">Private Tokens Sold</span></div>
        </div>

        <div className="action-panel">
          <div className="action-col">
            <div className="card-title">Public Purchase</div>
            <input
              className="input"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="USDT amount (e.g. 100)"
            />
            <div className="btn-group-left">
              <button
                className="btn-primary"
                disabled={!wallet.connected || wrongNetwork || txLoading || buyAmount.length === 0}
                onClick={async () => {
                  await buyPublic(buyAmount);
                  setBuyAmount("");
                }}
              >
                Approve + Buy
              </button>
              <button
                className="btn-secondary"
                disabled={!wallet.connected || wrongNetwork || txLoading}
                onClick={() => void claim()}
              >
                Claim Tokens
              </button>
            </div>
          </div>

          <div className="action-col">
            <div className="card-title">Your Record</div>
            <div className="record-grid">
              <div><span>Public Invested</span><strong>{formatAmount(record.publicUsdtInvested, USDT_DECIMALS, 2)} USDT</strong></div>
              <div><span>Private Invested</span><strong>{formatAmount(record.privateUsdtInvestedAmount, USDT_DECIMALS, 2)} USDT</strong></div>
              <div><span>Total Purchased</span><strong>{formatAmount(record.totalTokensPurchased, 18, 2)}</strong></div>
              <div><span>Total Claimed</span><strong>{formatAmount(record.totalTokensClaimed, 18, 2)}</strong></div>
              <div><span>Claimable Now</span><strong>{formatAmount(record.claimableNow, 18, 4)}</strong></div>
              <div><span>MBL Balance</span><strong>{formatAmount(madbullBalance, 18, 4)} MBL</strong></div>
              <div><span>Sale Start</span><strong>{formatTimestamp(snapshot.startTime)}</strong></div>
            </div>
            <button className="btn-secondary mt12" disabled={loading || txLoading} onClick={() => void refresh()}>
              Refresh Data
            </button>
          </div>
        </div>

        {isOwner && (
          <div className="owner-panel">
            <div className="card-title">Owner Controls</div>
            <div className="owner-grid">
              <input className="input" placeholder="Public price in USDT (0.04)" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
              <button
                className="btn-primary"
                disabled={txLoading || wrongNetwork || priceInput.length === 0}
                onClick={async () => {
                  await setPublicPrice(priceInput);
                  setPriceInput("");
                }}
              >
                Set Public Price
              </button>
              <input className="input" placeholder="Private buyer wallet" value={privateBuyer} onChange={(e) => setPrivateBuyer(e.target.value)} />
              <input className="input" placeholder="Private USDT amount" value={privateAmount} onChange={(e) => setPrivateAmount(e.target.value)} />
              <button
                className="btn-primary owner-wide"
                disabled={txLoading || wrongNetwork || privateBuyer.length === 0 || privateAmount.length === 0}
                onClick={async () => {
                  await recordPrivateInvestment(privateBuyer, privateAmount);
                  setPrivateBuyer("");
                  setPrivateAmount("");
                }}
              >
                Approve + Record Private Investment
              </button>
            </div>

            <div className="card-title mt12">Public Investors</div>
            {publicInvestors.length === 0 ? (
              <div className="notice">No public investors recorded yet.</div>
            ) : (
              <div className="record-grid">
                {publicInvestors.map((investor) => (
                  <div key={investor.address}>
                    <span>{shortAddress(investor.address)}</span>
                    <strong>{formatAmount(investor.publicTokensPurchased, 18, 2)} MBL</strong>
                    <span>{formatAmount(investor.publicUsdtInvested, USDT_DECIMALS, 2)} USDT invested</span>
                    <span>{formatAmount(investor.totalTokensClaimed, 18, 2)} claimed</span>
                    <span>{formatAmount(investor.claimableNow, 18, 4)} claimable</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="divider" />

      <section className="section" id="airdrop">
        <div className="airdrop-box">
          <div className="section-label center">02 - Airdrop</div>
          <h2 className="airdrop-title">FREE <span>TOKENS</span> FOR THE COMMUNITY</h2>
          <p className="section-text">Airdrop module is UI-ready. Connect your real eligibility backend or Merkle claim contract when finalizing launch.</p>
          <div className="btn-group"><button className="btn-secondary">Claim Airdrop</button></div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="utility">
        <div className="section-label">03 - Token Utility</div>
        <h2 className="section-title">The <span>MadBull</span> Ecosystem</h2>
        <p className="section-text">Five core utility pillars, each designed to solve real-world problems while driving token demand and community growth.</p>
        <div className="utility-grid">
          <div className="utility-card">
            <div className="card-title">AI Agentic Arbitrage</div>
            <p>Autonomous AI agents operate 24/7 scanning hundreds of DEXs and CEXs across multiple chains to detect and execute cross-exchange arbitrage opportunities — generating data-driven returns for token holders. Premium strategies unlocked by staking tier.</p>
          </div>
          <div className="utility-card">
            <div className="card-title">Quantum Blockchain Network</div>
            <p>Post-quantum cryptography (lattice-based & hash-based) combined with a hybrid PoS + DAG consensus delivers 100,000+ TPS at near-zero fees. Native bridges to Ethereum, BSC, Polygon, and Solana enable seamless multi-chain dApp deployment.</p>
          </div>
          <div className="utility-card">
            <div className="card-title">Quantum Cure — Decentralized Health</div>
            <p>Quantum-accelerated diagnostics and AI health companions on a blockchain-secured platform. Patients own their encrypted medical records on-chain. Token holders vote on medical research funding via the Research DAO.</p>
          </div>
          <div className="utility-card">
            <div className="card-title">Insurance Card — DeFi Coverage</div>
            <p>Smart contract policies with automated claim verification and instant payouts. NFT insurance cards are portable and verifiable. Community risk pools earn yield while providing multi-vertical coverage — from crypto wallets to health and travel.</p>
          </div>
          <div className="utility-card">
            <div className="card-title">Knowledge Gaming — Learn-to-Earn</div>
            <p>Compete in daily and weekly trivia and strategy tournaments covering finance, blockchain, science, and more — earning MBL tokens for knowledge. NFT achievement badges unlock exclusive access tiers, governance weight, and premium content.</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="tokenomics">
        <div className="section-label">04 - Tokenomics</div>
        <h2 className="section-title">Token <span>Distribution</span></h2>
        <div className="token-rows">
          <div className="token-row"><span>Gaming</span><strong>17%</strong></div>
          <div className="token-row"><span>Founder</span><strong>10%</strong></div>
          <div className="token-row"><span>Dex Listing</span><strong>10%</strong></div>
          <div className="token-row"><span>Presale</span><strong>7%</strong></div>
          <div className="token-row"><span>Private Team</span><strong>3%</strong></div>
          <div className="token-row"><span>Private Sale</span><strong>12%</strong></div>
          <div className="token-row"><span>Development</span><strong>3%</strong></div>
          <div className="token-row"><span>Community And Mkt</span><strong>2.9%</strong></div>
          <div className="token-row"><span>Airdrop</span><strong>0.1%</strong></div>
          <div className="token-row"><span>Lock Reserve</span><strong>35%</strong></div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="roadmap">
        <div className="section-label">05 - Roadmap</div>
        <h2 className="section-title">Building the <span>Future</span></h2>
        <div className="roadmap-grid">
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 1</div>
            <div className="roadmap-time">Q2 2026</div>
            <p>Public presale, Private sale, Staking Program, community building, Smart contract Audit</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 2</div>
            <div className="roadmap-time">Q3 2026</div>
            <p>DEX launch, AI Agentic Arbitrage Trading Platform launch</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 3</div>
            <div className="roadmap-time">Q4 2026</div>
            <p>Quantum Blockchain Network launch, initial CEX listings</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 4</div>
            <div className="roadmap-time">H1 2027</div>
            <p>Knowledge Gaming platform, NFT achievement badges, staking live</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 5</div>
            <div className="roadmap-time">H2 2027</div>
            <p>Quantum Cure alpha, Insurance utility card</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 6</div>
            <div className="roadmap-time">2028</div>
            <p>Quantum Blockchain mainnet, cross-chain bridges, global expansion</p>
          </div>
          <div className="roadmap-card">
            <div className="roadmap-phase">Phase 7</div>
            <div className="roadmap-time">Year 6+</div>
            <p>Locked reserve gradual release begins (20%/yr for 5 years)</p>
          </div>
        </div>
      </section>

      <footer>
        <span className="logo"><span className="logo-red">MAD</span><span className="logo-green">BULL</span></span>
        <SocialLinks />
        <p>Presale status: {snapshot.saleActive ? "ACTIVE" : "PAUSED"} | Claim: {snapshot.claimEnabled ? "ENABLED" : "DISABLED"}</p>
      </footer>
    </>
  );
}
