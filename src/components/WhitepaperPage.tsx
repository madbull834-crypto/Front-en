import { useState, useEffect, useRef } from "react";
import SocialLinks from "./SocialLinks";

interface Props {
  onBack: () => void;
}

const SECTIONS = [
  { id: "wp-01", label: "Executive Summary" },
  { id: "wp-02", label: "Vision & Mission" },
  { id: "wp-03", label: "MadBull Utilities" },
  { id: "wp-04", label: "Tokenomics" },
  { id: "wp-05", label: "Presale & Distribution" },
  { id: "wp-06", label: "Roadmap" },
  { id: "wp-07", label: "DAO Governance" },
  { id: "wp-08", label: "Security & Audit" },
  { id: "wp-09", label: "Legal & Compliance" },
  { id: "wp-10", label: "Branding & Identity" },
  { id: "wp-11", label: "Conclusion" },
  { id: "wp-appendix", label: "Appendix" },
];

export default function WhitepaperPage({ onBack }: Props) {
  const [active, setActive] = useState("wp-01");
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { root: container, rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = container.querySelector(`#${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    mainRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="wp-layout">
      <div className="grid-bg" />

      {/* ── Sidebar ── */}
      <aside className="wp-sidebar">
        <div className="wp-sidebar-head">
          <button className="wp-back-btn" onClick={onBack}>← Back to Site</button>
          <div className="wp-sidebar-brand">
            <span className="logo-red">MAD</span><span className="logo-green">BULL</span>
          </div>
          <div className="wp-sidebar-version">Whitepaper · Version 1.0 · April 2026</div>
        </div>

        <nav className="wp-sidenav">
          <div className="wp-sidenav-label">Table of Contents</div>
          {SECTIONS.map(({ id, label }, i) => (
            <button
              key={id}
              className={"wp-sidenav-item" + (active === id ? " active" : "")}
              onClick={() => scrollTo(id)}
            >
              <span className="wp-sidenav-idx">{String(i + 1).padStart(2, "0")}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="wp-sidebar-foot">
          <a className="wp-dl-btn" href="/MadBull_Whitepaper-3 (1).pdf" download="MadBull_Whitepaper.pdf">
            ↓ Download PDF
          </a>
          <p className="wp-sidebar-copy">© 2026 MadBull. All rights reserved.</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="wp-main" ref={mainRef}>

        {/* Cover */}
        <div className="wp-cover">
          <div className="wp-cover-eyebrow">Whitepaper · Version 1.0 · April 2026</div>
          <h1 className="wp-cover-title">
            <span className="logo-red">MAD</span><span className="logo-green">BULL</span>
          </h1>
          <p className="wp-cover-sub">Quantum-Powered Blockchain Ecosystem</p>
          <p className="wp-cover-quote">"Charging Into the Future of Decentralized Innovation"</p>

          <div className="wp-cover-pills">
            <span>AI Arbitrage</span>
            <span>Quantum Blockchain</span>
            <span>Quantum Cure</span>
            <span>Insurance Card</span>
            <span>Knowledge Gaming</span>
          </div>

          <div className="wp-cover-stats">
            <div className="wp-cover-stat"><span className="wp-cover-stat-val">MBL</span><span className="wp-cover-stat-lbl">Token Ticker</span></div>
            <div className="wp-cover-stat-div" />
            <div className="wp-cover-stat"><span className="wp-cover-stat-val">51M</span><span className="wp-cover-stat-lbl">Total Supply</span></div>
            <div className="wp-cover-stat-div" />
            <div className="wp-cover-stat"><span className="wp-cover-stat-val">$0.04</span><span className="wp-cover-stat-lbl">Public Price</span></div>
            <div className="wp-cover-stat-div" />
            <div className="wp-cover-stat"><span className="wp-cover-stat-val">EVM</span><span className="wp-cover-stat-lbl">Network</span></div>
          </div>
        </div>

        {/* Document */}
        <div className="wp-doc">

          {/* 01 */}
          <section className="wp-sec" id="wp-01">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">01</span>
              <h2 className="wp-sec-title">Executive Summary</h2>
            </div>
            <div className="wp-sec-body">
              <p className="wp-p">
                MadBull is the utility token powering a next-generation ecosystem that merges AI agentic
                arbitrage trading, quantum blockchain technology, decentralized health solutions (Quantum Cure),
                blockchain-based insurance, and knowledge-based gaming into a single, unified platform.
              </p>
              <p className="wp-p">
                With a total supply of 51,000,000 (51 million) MBL tokens and a carefully structured allocation
                model featuring a 5-year lock period followed by a 5-year gradual release, MadBull delivers
                transparency, sustainability, and real-world utility across multiple verticals — making it far
                more than just another token. It is the engine of a quantum-powered future.
              </p>
            </div>
          </section>

          {/* 02 */}
          <section className="wp-sec" id="wp-02">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">02</span>
              <h2 className="wp-sec-title">Vision &amp; Mission</h2>
            </div>
            <div className="wp-sec-body">
              <div className="wp-vcard wp-vcard--vision">
                <div className="wp-vcard-label">Vision</div>
                <p className="wp-p">
                  To pioneer a quantum-secured, AI-enhanced blockchain ecosystem that empowers individuals across
                  finance, healthcare, insurance, and education — creating a world where decentralized technology
                  delivers tangible, everyday value to every participant.
                </p>
              </div>
              <div className="wp-vcard wp-vcard--mission">
                <div className="wp-vcard-label">Mission</div>
                <p className="wp-p">
                  To integrate cutting-edge AI agentic systems and quantum computing with blockchain utility,
                  providing users with intelligent arbitrage trading, a quantum-secured network, revolutionary
                  health diagnostics, decentralized insurance, and gamified knowledge platforms — all fueled by
                  the MadBull token.
                </p>
              </div>
            </div>
          </section>

          {/* 03 */}
          <section className="wp-sec" id="wp-03">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">03</span>
              <h2 className="wp-sec-title">MadBull Utilities</h2>
            </div>
            <div className="wp-sec-body">
              <p className="wp-p wp-lead">
                The MadBull ecosystem is anchored by five core utility pillars, each designed to solve
                real-world problems while driving token demand and community growth.
              </p>

              <div className="wp-util" id="wp-031">
                <div className="wp-util-head">
                  <span className="wp-util-idx">3.1</span>
                  <span className="wp-util-name">AI Agentic Arbitrage Trading Platform</span>
                </div>
                <p className="wp-p">
                  Autonomous AI agents operate 24/7, continuously scanning hundreds of DEXs and CEXs across
                  multiple chains to identify and act on price discrepancies within milliseconds.
                </p>
                <ul className="wp-list">
                  <li><strong>Autonomous AI Agents:</strong> Self-learning agents scan for cross-exchange and cross-chain arbitrage in real time.</li>
                  <li><strong>Agentic Decision-Making:</strong> Agents evaluate market depth, gas costs, slippage, and risk — choosing optimal strategies including spot, triangular, and flash loan routes.</li>
                  <li><strong>Token-Gated Access Tiers:</strong> MBL staking tier unlocks premium strategies from basic spot arbitrage to advanced multi-hop and flash loan vaults.</li>
                  <li><strong>Transparent Dashboards:</strong> Real-time on-chain reporting of all agent activity, P&amp;L, and vault performance — fully auditable and community-governed.</li>
                </ul>
              </div>

              <div className="wp-util" id="wp-032">
                <div className="wp-util-head">
                  <span className="wp-util-idx">3.2</span>
                  <span className="wp-util-name">Quantum Blockchain Network</span>
                </div>
                <p className="wp-p">
                  A paradigm shift in decentralized infrastructure leveraging quantum-resistant cryptographic
                  algorithms and hybrid consensus mechanisms for unmatched security, speed, and scalability.
                </p>
                <ul className="wp-list">
                  <li><strong>Post-Quantum Cryptography:</strong> Lattice-based and hash-based schemes resistant to quantum computing attacks.</li>
                  <li><strong>Hybrid Consensus:</strong> Combines Proof-of-Stake efficiency with DAG parallelism to achieve 100,000+ TPS with near-zero fees.</li>
                  <li><strong>Cross-Chain Interoperability:</strong> Native bridges to Ethereum, BSC, Polygon, and Solana.</li>
                  <li><strong>Quantum RNG:</strong> True randomness powers fair gaming, secure key generation, and tamper-proof lotteries.</li>
                </ul>
              </div>

              <div className="wp-util" id="wp-033">
                <div className="wp-util-head">
                  <span className="wp-util-idx">3.3</span>
                  <span className="wp-util-name">Quantum Cure — Decentralized Health Platform</span>
                </div>
                <p className="wp-p">
                  Combining quantum computing with blockchain-secured medical data for faster diagnostics,
                  privacy-preserving health records, and AI-assisted treatment pathways.
                </p>
                <ul className="wp-list">
                  <li><strong>Quantum-Accelerated Diagnostics:</strong> Quantum algorithms process molecular simulations and genomic data enabling rapid disease detection,research and drug discovery.</li>
                  <li><strong>Decentralized Health Records:</strong> Patient , Doctor , Technician and Medical Research data is encrypted and stored on-chain, giving individuals full ownership and control.</li>
                  <li><strong>AI Health Companions:</strong> Token-gated access to AI wellness assistants providing personalized nutrition plans, exercise recommendations, and mental health check-ins.</li>
                  <li><strong>Research DAO:</strong> MBL holders vote to fund medical research initiatives.</li>
                </ul>
              </div>

              <div className="wp-util" id="wp-034">
                <div className="wp-util-head">
                  <span className="wp-util-idx">3.4</span>
                  <span className="wp-util-name">Insurance Card — DeFi Coverage</span>
                </div>
                <p className="wp-p">
                  Transparent, affordable, and instant DeFi insurance powered by smart contracts and
                  community-pooled liquidity — no paperwork, no delays, no denial games.
                </p>
                <ul className="wp-list">
                  <li><strong>Smart Contract Policies:</strong> Automated claim verification and instant payouts encoded on-chain.</li>
                  <li><strong>Community Risk Pools:</strong> Token holders contribute to risk pools and earn yield while providing coverage to fellow members.</li>
                  <li><strong>NFT Insurance Cards:</strong> Each policy is minted as an NFT — portable, tradeable, and verifiable.</li>
                  <li><strong>Multi-Vertical Coverage:</strong> Crypto wallet insurance, health coverage, and travel protection — all accessible with MBL tokens.</li>
                </ul>
              </div>

              <div className="wp-util" id="wp-035">
                <div className="wp-util-head">
                  <span className="wp-util-idx">3.5</span>
                  <span className="wp-util-name">Knowledge Gaming — Learn-to-Earn</span>
                </div>
                <p className="wp-p">
                  Education transformed into an engaging, rewarding experience. Players compete in trivia,
                  strategy, and skill-based games — earning MBL tokens for their knowledge.
                </p>
                <ul className="wp-list">
                  <li><strong>Play-to-Earn Quizzes:</strong> Daily and weekly tournaments with MBL prize pools covering crypto, quantum physics, world history, and more.</li>
                  <li><strong>NFT Achievement Badges:</strong> Unique NFT badges for milestones unlocking exclusive access tiers, governance weight, and premium content.</li>
                  <li><strong>Educational Partnerships:</strong> Collaborations with universities and edtech platforms for curriculum-aligned content.</li>
                  <li><strong>Leaderboards &amp; Seasons:</strong> Competitive seasonal rankings with escalating rewards fostering long-term community retention.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 04 */}
          <section className="wp-sec" id="wp-04">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">04</span>
              <h2 className="wp-sec-title">Tokenomics</h2>
            </div>
            <div className="wp-sec-body">
              <div className="wp-kpi-row">
                <div className="wp-kpi"><span className="wp-kpi-val">MBL</span><span className="wp-kpi-lbl">Token</span></div>
                <div className="wp-kpi"><span className="wp-kpi-val">51,000,000</span><span className="wp-kpi-lbl">Total Supply (fixed)</span></div>
                <div className="wp-kpi"><span className="wp-kpi-val">18</span><span className="wp-kpi-lbl">Decimals</span></div>
                <div className="wp-kpi"><span className="wp-kpi-val">28,050,000</span><span className="wp-kpi-lbl">Circulating at Launch</span></div>
                <div className="wp-kpi"><span className="wp-kpi-val">17,850,000</span><span className="wp-kpi-lbl">Locked Reserve (5yr)</span></div>
              </div>
              <table className="wp-table">
                <thead>
                  <tr><th>Category</th><th>%</th><th>Amount (MBL)</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                  <tr><td>Gaming Platform</td><td>17%</td><td>8,670,000</td><td>Knowledge Gaming rewards &amp; ecosystem</td></tr>
                  <tr><td>Founders</td><td>10%</td><td>5,100,000</td><td>Core team allocation (vested)</td></tr>
                  <tr><td>DEX Listing</td><td>10%</td><td>5,100,000</td><td>Liquidity pairs &amp; exchange listings</td></tr>
                  <tr><td>Presale</td><td>7%</td><td>3,570,000</td><td>Public presale — active now</td></tr>
                  <tr><td>Private Team</td><td>3%</td><td>1,530,000</td><td>Early contributors &amp; advisors</td></tr>
                  <tr><td>Private Sale</td><td>12%</td><td>6,120,000</td><td>Private sale allocation</td></tr>
                  <tr><td>Development</td><td>3%</td><td>1,530,000</td><td>R&amp;D, audits, integrations</td></tr>
                  <tr><td>Community &amp; Marketing</td><td>2.9%</td><td>1,479,000</td><td>Adoption, partnerships &amp; growth</td></tr>
                  <tr><td>Airdrop</td><td>0.1%</td><td>51,000</td><td>Early adopter rewards</td></tr>
                  <tr><td>Locked Reserve</td><td>35%</td><td>17,850,000</td><td>5-yr lock; 20%/yr release from Year 6</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 05 */}
          <section className="wp-sec" id="wp-05">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">05</span>
              <h2 className="wp-sec-title">Presale &amp; Distribution</h2>
            </div>
            <div className="wp-sec-body">
              <ul className="wp-list">
                <li><strong>Public Presale:</strong> 7% allocation (3,570,000 MBL) — active now.</li>
                <li><strong>Private Team:</strong> 3% allocation (1,530,000 MBL) for early contributors and advisors.</li>
                <li><strong>Private Sale:</strong> 12% allocation (6,120,000 MBL) for private sale participants.</li>
                <li><strong>DEX Launch:</strong> 10% allocation (5,100,000 MBL) reserved for liquidity pairs and exchange listings.</li>
                <li><strong>CEX Listings:</strong> Targeted for major centralized exchanges post-DEX launch.</li>
                <li><strong>Airdrop:</strong> 0.1% allocation (51,000 MBL) for early adopters and community rewards.</li>
                <li><strong>Finality:</strong> All token sales are final. Trading begins upon exchange listing.</li>
              </ul>
            </div>
          </section>

          {/* 06 */}
          <section className="wp-sec" id="wp-06">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">06</span>
              <h2 className="wp-sec-title">Roadmap</h2>
            </div>
            <div className="wp-sec-body">
              <div className="wp-timeline">
                {[
                  { phase: "Phase 1", time: "Q2 2026", desc: "Public presale, Private sale, Staking Program, community building, Smart contract Audit" },
                  { phase: "Phase 2", time: "Q3 2026", desc: "DEX launch, AI Agentic Arbitrage Trading Platform launch" },
                  { phase: "Phase 3", time: "Q4 2026", desc: "Quantum Blockchain Network launch, initial CEX listings" },
                  { phase: "Phase 4", time: "H1 2027", desc: "Knowledge Gaming platform, NFT achievement badges, staking live" },
                  { phase: "Phase 5", time: "H2 2027", desc: "Quantum Cure alpha, Insurance utility card" },
                  { phase: "Phase 6", time: "2028",    desc: "Quantum Blockchain mainnet, cross-chain bridges, global expansion" },
                  { phase: "Phase 7", time: "Year 6+", desc: "Locked reserve gradual release begins (20%/yr for 5 years)" },
                ].map(({ phase, time, desc }) => (
                  <div className="wp-tl-item" key={phase}>
                    <div className="wp-tl-line"><div className="wp-tl-dot" /></div>
                    <div className="wp-tl-content">
                      <div className="wp-tl-meta">
                        <span className="wp-tl-phase">{phase}</span>
                        <span className="wp-tl-time">{time}</span>
                      </div>
                      <p className="wp-tl-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 07 */}
          <section className="wp-sec" id="wp-07">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">07</span>
              <h2 className="wp-sec-title">DAO Governance</h2>
            </div>
            <div className="wp-sec-body">
              <ul className="wp-list">
                <li><strong>Voting Model:</strong> Snapshot voting (1 MBL = 1 vote) with delegation; on-chain execution via timelock and multisig.</li>
                <li><strong>Scope:</strong> Feature prioritization, treasury grants, utility integrations, parameter updates, and partnership approvals.</li>
                <li><strong>Process:</strong> Forum review (3 days) → Snapshot vote (5 days) → Timelock (72 h) → On-chain execution.</li>
                <li><strong>Thresholds:</strong> Proposal: 0.10% of circulating MBL. Quorum: 5% (8% for major actions). Simple majority to pass.</li>
                <li><strong>Treasury:</strong> 4/7 multisig. T1 ≤ $25K (council), T2 $25K–$250K (DAO vote), T3 &gt; $250K (elevated quorum).</li>
                <li><strong>Safeguards:</strong> Emergency pause (7 days), public bug-bounty program, quarterly transparency reports, signer rotation.</li>
                <li><strong>Decentralization:</strong> Guardian powers sunset after 12 months or earlier by DAO vote.</li>
              </ul>
            </div>
          </section>

          {/* 08 */}
          <section className="wp-sec" id="wp-08">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">08</span>
              <h2 className="wp-sec-title">Security &amp; Audit</h2>
            </div>
            <div className="wp-sec-body">
              <ul className="wp-list">
                <li><strong>Auditors:</strong> CertiK and Halborn (planned); all audit reports published on-chain and on the project website.</li>
                <li><strong>Smart-Contract Controls:</strong> Reentrancy guards, role-based access control, pausable modules, and MEV/sniping mitigations.</li>
                <li><strong>Key Management:</strong> Multisig custody with hardware security modules (HSMs); strict separation of duties across the core team.</li>
                <li><strong>Quantum-Resistant Keys:</strong> Post-quantum key generation and signature schemes protect against future quantum threats.</li>
                <li><strong>Bug Bounty:</strong> Public program with tiered rewards up to $100,000 for critical vulnerabilities.</li>
                <li><strong>Audit Timeline:</strong> Internal review pre-presale; external audit pre-DEX launch; ongoing audits on all major upgrades.</li>
              </ul>
            </div>
          </section>

          {/* 09 */}
          <section className="wp-sec" id="wp-09">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">09</span>
              <h2 className="wp-sec-title">Legal &amp; Compliance</h2>
            </div>
            <div className="wp-sec-body">
              <ul className="wp-list">
                <li>MBL is a utility token. It does not represent equity, ownership, or any form of profit-sharing rights.</li>
                <li>Regional restrictions may apply. All participants must comply with their local laws and regulations.</li>
                <li>All token sales are final. Post-launch market pricing is determined by market dynamics.</li>
                <li>KYC/AML requirements for large purchases will be published before the public presale opens.</li>
                <li>MadBull branding, the MBL ticker, and all associated intellectual property are trademark pending.</li>
              </ul>
            </div>
          </section>

          {/* 10 */}
          <section className="wp-sec" id="wp-10">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">10</span>
              <h2 className="wp-sec-title">Branding &amp; Identity</h2>
            </div>
            <div className="wp-sec-body">
              <ul className="wp-list">
                <li><strong>Ticker:</strong> MBL</li>
                <li><strong>Slogan:</strong> "Charging Into the Future of Decentralized Innovation"</li>
                <li><strong>Website:</strong> https://madbull.world</li>
                <li><strong>Brand Kit:</strong> Full visual identity including logos, color palette, typography, and media assets will be published prior to mainnet launch.</li>
              </ul>
            </div>
          </section>

          {/* 11 */}
          <section className="wp-sec wp-sec--conclusion" id="wp-11">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">11</span>
              <h2 className="wp-sec-title">Conclusion</h2>
            </div>
            <div className="wp-sec-body">
              <p className="wp-p">
                MadBull is not just a token — it is the connective tissue of a quantum-powered ecosystem spanning
                finance, healthcare, insurance, and education. With a fixed supply, transparent governance,
                audited smart contracts, and five powerful utility pillars, MadBull is built for long-term
                growth, community empowerment, and real-world impact.
              </p>
              <div className="wp-quote-block">
                "Join the charge. The future is decentralized. The future is MadBull."
              </div>
            </div>
          </section>

          {/* Appendix */}
          <section className="wp-sec" id="wp-appendix">
            <div className="wp-sec-hd">
              <span className="wp-sec-tag">A</span>
              <h2 className="wp-sec-title">Appendix — Gradual Release Schedule</h2>
            </div>
            <div className="wp-sec-body">
              <p className="wp-p">
                The Locked Reserve is held in escrow for a mandatory 5-year lock period. Gradual release begins
                at Year 6, with 20% of the reserve unlocked annually over 5 years.
              </p>
              <table className="wp-table">
                <thead>
                  <tr><th>Year</th><th>% Released</th><th>Tokens Released</th><th>Cumulative</th><th>Remaining Locked</th></tr>
                </thead>
                <tbody>
                  <tr><td>Year 1–5</td><td>—</td><td>—</td><td>—</td><td>17,850,000</td></tr>
                  <tr><td>Year 6</td><td>20%</td><td>3,570,000</td><td>3,570,000</td><td>14,280,000</td></tr>
                  <tr><td>Year 7</td><td>20%</td><td>3,570,000</td><td>7,140,000</td><td>10,710,000</td></tr>
                  <tr><td>Year 8</td><td>20%</td><td>3,570,000</td><td>10,710,000</td><td>7,140,000</td></tr>
                  <tr><td>Year 9</td><td>20%</td><td>3,570,000</td><td>14,280,000</td><td>3,570,000</td></tr>
                  <tr><td>Year 10</td><td>20%</td><td>3,570,000</td><td>17,850,000</td><td>0</td></tr>
                </tbody>
              </table>

              <div className="wp-appendix-label">B. Utility Ecosystem Revenue Map</div>
              <table className="wp-table">
                <thead>
                  <tr><th>Utility Pillar</th><th>Token Use</th><th>Revenue Model</th></tr>
                </thead>
                <tbody>
                  <tr><td>AI Agentic Arbitrage</td><td>Agent access, vault deposits</td><td>Performance fees (shared with holders)</td></tr>
                  <tr><td>Quantum Blockchain</td><td>Gas fees, validator staking</td><td>Network transaction fees</td></tr>
                  <tr><td>Quantum Cure</td><td>Health data access, AI consults</td><td>Subscription &amp; per-use fees</td></tr>
                  <tr><td>Insurance Card</td><td>Premium payments, risk staking</td><td>Underwriting spreads &amp; yield</td></tr>
                  <tr><td>Knowledge Gaming</td><td>Entry fees, NFT purchases</td><td>Tournament fees &amp; sponsored content</td></tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>{/* /wp-doc */}

        <footer className="wp-footer">
          <span>MadBull Whitepaper v1.0 · April 2026 · madbull.world · Confidential</span>
          <SocialLinks />
          <a className="wp-dl-btn wp-dl-btn--sm" href="/MadBull_Whitepaper-3 (1).pdf" download="MadBull_Whitepaper.pdf">
            ↓ Download PDF
          </a>
        </footer>

      </main>
    </div>
  );
}
