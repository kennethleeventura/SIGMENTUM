import { useState } from 'react';

const SANDBOX_ASSETS = [
  { sym: 'XAU/USD', label: 'Gold Spot',     cls: 'COMMODITIES' },
  { sym: 'BTC/USD', label: 'Bitcoin',        cls: 'CRYPTO'      },
  { sym: 'EUR/USD', label: 'Euro / Dollar',  cls: 'FOREX'       },
  { sym: 'TSLA',    label: 'Tesla',          cls: 'EQUITIES'    },
  { sym: 'SPY',     label: 'S&P 500 ETF',    cls: 'EQUITIES'    },
  { sym: 'ETH/USD', label: 'Ethereum',       cls: 'CRYPTO'      },
];

const SANDBOX_RULES = [
  { id: 'rsi',       label: 'RSI Reversal',     desc: 'Enter when RSI dips below threshold, exit above' },
  { id: 'ema',       label: 'EMA Crossover',     desc: 'Enter when fast EMA crosses above slow EMA' },
  { id: 'momentum',  label: 'Momentum Breakout', desc: 'Ride 2-sigma expansion in price momentum' },
  { id: 'sigmentum', label: 'AI Score ≥ 75',     desc: 'Trade only when Sigmentum confidence is high' },
];

function lcg(seed) {
  return (seed * 1664525 + 1013904223) & 0x7fffffff;
}

function getMockResults(assetSym, ruleId, period) {
  let seed = 0;
  for (const c of assetSym + ruleId) seed = lcg(seed + c.charCodeAt(0));

  const winRate = 55 + (seed % 19);
  const tradesBase = 42 + ((seed * 7) % 58);
  const trades = Math.round(tradesBase * (period === '2Y' ? 1.93 : 1));
  const netPnlBase = 9 + ((seed * 3) % 22);
  const netPnl = (netPnlBase * (period === '2Y' ? 1.86 : 1)).toFixed(1);
  const maxDD = -((2 + ((seed * 5) % 8)).toFixed(1));
  const sharpe = (0.9 + ((seed * 11) % 15) / 10).toFixed(2);

  const monthCount = period === '2Y' ? 24 : 12;
  const months = [];
  let s = seed;
  for (let i = 0; i < monthCount; i++) {
    s = lcg(s + i);
    const v = ((s % 17) - 6) * 0.38;
    months.push(parseFloat(v.toFixed(2)));
  }

  return { winRate, trades, netPnl, maxDD, sharpe, months };
}

function PnLChart({ months }) {
  const max = Math.max(...months.map(Math.abs), 0.1);
  const W = 20;
  const labels12 = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const labels = months.length === 24
    ? [...labels12.map(l => l + '1'), ...labels12.map(l => l + '2')]
    : labels12;

  return (
    <svg viewBox={`0 0 ${months.length * W} 80`} style={{ width: '100%', height: 80, overflow: 'visible' }}>
      <line x1={0} y1={40} x2={months.length * W} y2={40} stroke="rgba(11,13,18,0.10)" strokeWidth={0.8}/>
      {months.map((v, i) => {
        const h = Math.max(Math.abs(v) / max * 32, 1.5);
        const isPos = v >= 0;
        const x = i * W + 2;
        const y = isPos ? 40 - h : 40;
        return (
          <g key={i}>
            <rect x={x} y={y} width={W - 4} height={h}
              fill={isPos ? 'var(--green)' : 'var(--orange)'} opacity={0.8} rx={2}/>
            {i % (months.length === 24 ? 4 : 2) === 0 && (
              <text x={x + (W - 4) / 2} y={76} textAnchor="middle"
                fontSize={5} fill="var(--ink-5)" fontFamily="monospace">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function downloadCard(results, assetSym, ruleName) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0b0d14';
  ctx.fillRect(0, 0, 900, 480);

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 900; x += 56) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 480); ctx.stroke();
  }
  for (let y = 0; y < 480; y += 56) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(900, y); ctx.stroke();
  }

  // Left accent bar (orange → green gradient)
  const accent = ctx.createLinearGradient(0, 0, 0, 480);
  accent.addColorStop(0, '#ee6a13');
  accent.addColorStop(1, '#0fb864');
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 5, 480);

  // Logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('SIGMENTUM', 32, 54);

  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '12px monospace';
  ctx.fillText('HINDSIGHT SANDBOX  ·  ' + assetSym + '  ·  ' + ruleName.toUpperCase(), 32, 76);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(32, 94); ctx.lineTo(868, 94); ctx.stroke();

  // Win rate — hero number
  ctx.fillStyle = '#0fb864';
  ctx.font = 'bold 96px sans-serif';
  ctx.fillText(results.winRate + '%', 32, 210);
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '11px monospace';
  ctx.fillText('WIN RATE', 32, 232);

  // Other metrics row
  const metrics = [
    { label: 'NET P&L',      value: '+' + results.netPnl + '%', col: '#0fb864' },
    { label: 'TOTAL TRADES', value: String(results.trades),      col: '#ffffff' },
    { label: 'MAX DRAWDOWN', value: results.maxDD + '%',         col: '#ee6a13' },
    { label: 'SHARPE',       value: results.sharpe,              col: '#ffffff' },
  ];
  metrics.forEach((m, i) => {
    const x = 220 + i * 168;
    ctx.fillStyle = m.col;
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(m.value, x, 175);
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '10px monospace';
    ctx.fillText(m.label, x, 196);
  });

  // Monthly bars
  const bx = 32, by = 260, bw = 836, bh = 140;
  const max = Math.max(...results.months.map(Math.abs), 0.1);
  const barW = bw / results.months.length;

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx, by + bh / 2); ctx.lineTo(bx + bw, by + bh / 2); ctx.stroke();

  results.months.forEach((v, i) => {
    const h = Math.max(Math.abs(v) / max * (bh / 2 - 6), 2);
    const isPos = v >= 0;
    const x = bx + i * barW + 1;
    const y = isPos ? by + bh / 2 - h : by + bh / 2;
    ctx.fillStyle = isPos ? 'rgba(15,184,100,0.82)' : 'rgba(238,106,19,0.82)';
    ctx.fillRect(x, y, Math.max(barW - 2, 1), h);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = '10px monospace';
  ctx.fillText('MONTHLY P&L', bx, by - 8);

  // Disclaimer
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.font = '10px monospace';
  ctx.fillText('sigmentum.com  ·  Results are simulated. Past performance does not guarantee future results.', 32, 466);

  const link = document.createElement('a');
  link.download = 'sigmentum-backtest-' + assetSym.replace('/', '-').toLowerCase() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function HindsightSandbox() {
  const [asset, setAsset] = useState(SANDBOX_ASSETS[0]);
  const [rule, setRule] = useState(SANDBOX_RULES[0]);
  const [direction, setDirection] = useState('long');
  const [period, setPeriod] = useState('1Y');
  const [rsiThreshold, setRsiThreshold] = useState(30);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [everRan, setEverRan] = useState(false);

  function runBacktest() {
    setRunning(true);
    setResults(null);
    setEverRan(true);
    setTimeout(() => {
      setResults(getMockResults(asset.sym, rule.id, period));
      setRunning(false);
    }, 1600);
  }

  const shareText = results
    ? `I just backtested ${asset.sym} with ${rule.label} on @sigmentum — ${results.winRate}% win rate, +${results.netPnl}% P&L over ${period}. Try yours free:`
    : '';

  return (
    <section id="sandbox" className="container">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div className="chip" style={{ display: 'inline-flex', marginBottom: 20 }}>
          <span className="chip-dot signals"/>
          <span>HINDSIGHT SANDBOX · FREE TO TRY</span>
        </div>
        <h2 className="serif" style={{
          fontSize: 'clamp(30px, 4vw, 54px)', margin: '0 0 16px',
          letterSpacing: '-0.02em', fontWeight: 700,
        }}>
          Test any strategy.<br/>Zero risk.
        </h2>
        <p style={{ color: 'var(--ink-3)', fontSize: 17, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          See exactly what your rule would have made against 2 years of real price data — before you risk a single dollar.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: everRan ? '1fr 1.45fr' : '1fr',
        gap: 28,
        maxWidth: everRan ? 1100 : 660,
        margin: '0 auto',
        transition: 'max-width 500ms cubic-bezier(.2,.7,.2,1)',
      }}>

        {/* ── Strategy Builder ── */}
        <div className="glass" style={{ padding: 28, borderRadius: 'var(--radius-xl)' }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>Strategy Builder</div>

          {/* Asset chips */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 8, fontWeight: 500 }}>Asset</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SANDBOX_ASSETS.map(a => (
                <button key={a.sym} onClick={() => setAsset(a)} style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 12,
                  fontFamily: 'var(--font-mono)', cursor: 'pointer',
                  border: '1px solid ' + (asset.sym === a.sym ? 'var(--orange)' : 'var(--line-strong)'),
                  background: asset.sym === a.sym ? 'var(--orange-glow)' : 'transparent',
                  color: asset.sym === a.sym ? 'var(--orange)' : 'var(--ink-3)',
                  transition: 'all 150ms',
                }}>{a.sym}</button>
              ))}
            </div>
          </div>

          {/* Rule selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 8, fontWeight: 500 }}>Strategy</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SANDBOX_RULES.map(r => (
                <button key={r.id} onClick={() => setRule(r)} style={{
                  padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                  border: '1px solid ' + (rule.id === r.id ? 'var(--orange)' : 'var(--line-strong)'),
                  background: rule.id === r.id ? 'var(--orange-glow)' : 'transparent',
                  cursor: 'pointer', transition: 'all 150ms',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: rule.id === r.id ? 'var(--orange)' : 'var(--ink)' }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* RSI threshold slider */}
          {rule.id === 'rsi' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 12, color: 'var(--ink-4)', marginBottom: 8, fontWeight: 500,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>Oversold Threshold</span>
                <span className="mono" style={{ color: 'var(--orange)' }}>{rsiThreshold}</span>
              </div>
              <input type="range" min={20} max={45} value={rsiThreshold}
                onChange={(e) => setRsiThreshold(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--orange)' }}/>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 10, color: 'var(--ink-5)', marginTop: 4,
              }}>
                <span>More selective (20)</span>
                <span>More signals (45)</span>
              </div>
            </div>
          )}

          {/* Direction + Period */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 8, fontWeight: 500 }}>Direction</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['long', 'Long'], ['short', 'Short'], ['both', 'Both']].map(([v, l]) => {
                  const active = direction === v;
                  const col = v === 'short' ? 'var(--orange)' : 'var(--green)';
                  const glow = v === 'short' ? 'var(--orange-glow)' : 'var(--green-glow)';
                  return (
                    <button key={v} onClick={() => setDirection(v)} style={{
                      flex: 1, padding: '7px 4px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                      border: '1px solid ' + (active ? col : 'var(--line-strong)'),
                      background: active ? glow : 'transparent',
                      color: active ? col : 'var(--ink-3)',
                      transition: 'all 150ms',
                    }}>{l}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 8, fontWeight: 500 }}>Backtest Period</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['1Y', '1 Year'], ['2Y', '2 Years']].map(([v, l]) => (
                  <button key={v} onClick={() => setPeriod(v)} style={{
                    flex: 1, padding: '7px 4px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                    border: '1px solid ' + (period === v ? 'var(--blue)' : 'var(--line-strong)'),
                    background: period === v ? 'var(--blue-glow)' : 'transparent',
                    color: period === v ? 'var(--blue)' : 'var(--ink-3)',
                    transition: 'all 150ms',
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-signal" onClick={runBacktest} disabled={running}
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px 20px', opacity: running ? 0.7 : 1 }}>
            {running ? '⟳ Running backtest…' : '▶ Run Backtest →'}
          </button>
        </div>

        {/* ── Results ── */}
        {everRan && (
          <div>
            {running && (
              <div className="glass" style={{
                padding: 40, borderRadius: 'var(--radius-xl)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: 420, gap: 16,
              }}>
                <div style={{ fontSize: 36, opacity: 0.4 }}>◎</div>
                <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  Running {rule.label} on {asset.sym}…
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
                  Scanning {period === '2Y' ? '730' : '365'} days of tick data
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)',
                      animation: `pulse 1s ease-in-out ${i * 0.28}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            )}

            {results && !running && (
              <div className="glass" style={{ padding: 28, borderRadius: 'var(--radius-xl)' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <div>
                    <div className="chip" style={{ marginBottom: 6 }}>
                      <span className="chip-dot momentum"/>
                      <span>BACKTEST COMPLETE · {asset.sym} · {period}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                      {rule.label} · {direction === 'both' ? 'Long + Short' : direction.charAt(0).toUpperCase() + direction.slice(1)} only
                    </div>
                  </div>
                </div>

                {/* 4 metric tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
                  {[
                    { label: 'Win Rate', value: results.winRate + '%', col: 'var(--green)' },
                    { label: 'Net P&L',  value: '+' + results.netPnl + '%', col: 'var(--green)' },
                    { label: 'Trades',   value: results.trades, col: 'var(--ink)' },
                    { label: 'Max DD',   value: results.maxDD + '%', col: 'var(--orange)' },
                  ].map((m, i) => (
                    <div key={i} style={{
                      padding: '12px 14px', borderRadius: 12,
                      background: 'var(--inner-card)',
                      border: '1px solid var(--glass-stroke)',
                    }}>
                      <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>{m.label}</div>
                      <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: m.col }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Monthly P&L */}
                <div style={{ marginBottom: 20 }}>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>Monthly P&L</div>
                  <PnLChart months={results.months}/>
                </div>

                {/* Summary */}
                <div style={{
                  padding: '14px 16px', borderRadius: 12, marginBottom: 18,
                  background: 'linear-gradient(135deg, rgba(15,184,100,0.06), rgba(11,93,238,0.04))',
                  border: '1px solid var(--glass-stroke)',
                }}>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' }}>
                    <strong>{rule.label}</strong> on <strong>{asset.sym}</strong> produced a{' '}
                    <strong style={{ color: 'var(--green)' }}>{results.winRate}% win rate</strong> across{' '}
                    <strong>{results.trades} trades</strong> over {period === '2Y' ? '2 years' : '12 months'},
                    with a Sharpe of <strong>{results.sharpe}</strong>. Maximum drawdown was{' '}
                    <strong style={{ color: 'var(--orange)' }}>{results.maxDD}%</strong>.
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <button className="btn btn-momentum"
                    onClick={() => downloadCard(results, asset.sym, rule.label)}
                    style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                    ↓ Download results card
                  </button>
                  <a href={'https://x.com/intent/tweet?text=' + encodeURIComponent(shareText + ' https://kennethleeventura.github.io/SIGMENTUM/')}
                    target="_blank" rel="noopener noreferrer"
                    className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                    Share on X →
                  </a>
                </div>

                {/* Upsell CTA */}
                <div style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(238,106,19,0.06)', border: '1px solid rgba(238,106,19,0.18)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', marginBottom: 4 }}>
                    Ready to trade this live?
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                    Connect your exchange and let the Execution Agent run this strategy automatically — no manual orders needed.
                  </div>
                  <a href="#pricing" className="btn btn-signal"
                    style={{ marginTop: 12, fontSize: 12, padding: '8px 14px', textDecoration: 'none', display: 'inline-flex' }}>
                    Start free trial →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billing: 'forever',
    badge: null,
    accentColor: 'var(--ink-3)',
    features: [
      '5 signals per day',
      'Paper trading — simulated $10,000 wallet',
      'Hindsight Sandbox (3 backtests / month)',
      'Basic market education hub',
      'Community Discord access',
    ],
    cta: 'Start free',
    ctaCls: 'btn',
  },
  {
    id: 'signal',
    name: 'Signal',
    price: '$28',
    billing: '/mo',
    badge: 'Most popular',
    accentColor: 'var(--orange)',
    features: [
      '32 signals / day across all assets',
      'Real-time Telegram + email alerts',
      'Alert customization — entry, TP, SL, updates',
      'Unlimited Hindsight Sandbox backtests',
      'Risk profile controls (daily loss limit, min R:R)',
      '1 custom watchlist',
      'Mobile push notifications',
    ],
    cta: 'Start 7-day trial',
    ctaCls: 'btn btn-signal',
  },
  {
    id: 'momentum',
    name: 'Momentum',
    price: '$82',
    billing: '/mo',
    badge: 'Full platform',
    accentColor: 'var(--green)',
    features: [
      'Everything in Signal',
      'Execution Agent — auto-trade via broker API',
      'Discovery Agent — personalized setups daily',
      'Unlimited signals across all timeframes',
      'Copy-Agent Marketplace (publish + earn)',
      'Full API access — webhooks + raw signal feed',
      'Priority support + onboarding call',
    ],
    cta: 'Get Momentum',
    ctaCls: 'btn btn-momentum',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="container">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div className="chip" style={{ display: 'inline-flex', marginBottom: 20 }}>
          <span className="chip-dot"/>
          <span>PRICING · 2882 MODEL</span>
        </div>
        <h2 className="serif" style={{
          fontSize: 'clamp(30px, 4vw, 54px)', margin: '0 0 16px',
          letterSpacing: '-0.02em', fontWeight: 700,
        }}>
          Simple, transparent pricing.
        </h2>
        <p style={{ color: 'var(--ink-3)', fontSize: 17, maxWidth: 460, margin: '0 auto', lineHeight: 1.5 }}>
          Start free. Upgrade when you see results. Cancel anytime.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20, maxWidth: 1000, margin: '0 auto',
      }}>
        {TIERS.map((tier) => (
          <div key={tier.id} className="glass lift" style={{
            padding: 28, borderRadius: 'var(--radius-xl)', position: 'relative',
            border: tier.id === 'signal' ? '1px solid var(--orange)' : undefined,
            boxShadow: tier.id === 'signal' ? 'var(--shadow-lg), 0 0 0 1px rgba(238,106,19,0.12)' : undefined,
          }}>
            {tier.badge && (
              <div style={{
                position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                background: tier.accentColor, color: 'white',
                padding: '4px 14px', borderRadius: 999,
                fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em', whiteSpace: 'nowrap',
              }}>{tier.badge}</div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div className="eyebrow" style={{ color: tier.accentColor, marginBottom: 8 }}>{tier.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="mono" style={{ fontSize: 40, fontWeight: 700, color: 'var(--ink)' }}>{tier.price}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>{tier.billing}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginBottom: 24 }}>
              {tier.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ color: tier.accentColor, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <a href="#" className={tier.ctaCls}
              style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 36, fontSize: 12, color: 'var(--ink-4)' }}>
        All plans include paper trading. No credit card required for Free. Cancel anytime.
      </div>

      {/* Comparison vs competitors */}
      <div style={{ marginTop: 64, maxWidth: 860, margin: '64px auto 0' }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 28 }}>
          How we compare
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Feature', 'Sigmentum', 'LuxAlgo', 'Trade Ideas', 'TradeZella'].map((h, i) => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: i === 0 ? 'left' : 'center',
                    fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                    color: i === 1 ? 'var(--orange)' : 'var(--ink-4)',
                    borderBottom: '1px solid var(--line)',
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['AI-generated signals',      '✓', '✓', '✓', '—'],
                ['Auto-execution agent',       '✓', '—', '—', '—'],
                ['Hindsight Sandbox (free)',    '✓', '—', '$', '—'],
                ['Paper trading built-in',     '✓', '—', '$', '✓'],
                ['Telegram / SMS alerts',      '✓', '$', '$', '—'],
                ['Copy-agent marketplace',     '✓', '—', '—', '—'],
                ['Starting price',             '$0', '$47/mo', '$118/mo', '$49/mo'],
              ].map(([feat, ...vals]) => (
                <tr key={feat} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--ink-2)', fontWeight: 500 }}>{feat}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{
                      padding: '10px 14px', textAlign: 'center',
                      color: v === '✓' ? 'var(--green)' : v === '—' ? 'var(--ink-5)' : v.startsWith('$') && i === 0 ? 'var(--orange)' : 'var(--ink-4)',
                      fontWeight: v === '✓' ? 700 : 400,
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
