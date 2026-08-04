import { useState } from 'react';
import { SIGNAL_FEED, REASONING_STEPS, SIGNAL_FACTORS, HERO_SIGNAL, CANDLES, buildSpark } from './data';
import { BiasBadge, ConfidenceBar, Sparkline, Reveal, Typewriter, CountUp, LogoMark, Waveform, useMobile } from './primitives';
import { CandleChart } from './sections-a';

function Tip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'var(--paper)',
          padding: '10px 14px', borderRadius: 10, fontSize: 12, lineHeight: 1.55,
          width: 260, textAlign: 'left', zIndex: 300,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: 0,
          pointerEvents: 'none', whiteSpace: 'normal',
        }}>
          {text}
          <span style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid var(--ink)',
          }}/>
        </span>
      )}
    </span>
  );
}

export function SignalFeed() {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [alertSignal, setAlertSignal] = useState(null);
  const isMobile = useMobile();

  const filtered = filter === 'all' ? SIGNAL_FEED
    : SIGNAL_FEED.filter(s => {
        if (filter === 'long')   return s.bias === 'Long';
        if (filter === 'short')  return s.bias === 'Short';
        if (filter === 'active') return s.status === 'active';
        return true;
      });

  return (
    <section id="signals" className="container" style={{ paddingTop: 60 }}>
      <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <Reveal>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>01 · SIGNAL FEED</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              Every 15 minutes, <em style={{ color: 'var(--orange)' }}>a new read</em>.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--inner-card)', borderRadius: 999, border: '1px solid var(--glass-stroke)' }}>
            {[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' }, { id: 'long', label: 'Long' }, { id: 'short', label: 'Short' }].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '6px 14px', borderRadius: 999, border: 'none',
                background: filter === t.id ? 'var(--ink)' : 'transparent',
                color: filter === t.id ? 'var(--paper)' : 'var(--ink-2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'all 150ms',
              }}>{t.label}</button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="glass" style={{ padding: 8, borderRadius: 'var(--radius-lg)' }}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map((s, i) => (
                <SignalCard
                  key={s.t + s.asset}
                  s={s} i={i}
                  expanded={expanded === i}
                  onExpand={() => setExpanded(expanded === i ? null : i)}
                  onAlert={() => setAlertSignal(s)}
                />
              ))}
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '70px 120px 130px 1fr 130px 80px 90px 100px',
                padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)',
                letterSpacing: '0.1em', color: 'var(--ink-3)', textTransform: 'uppercase',
                borderBottom: '1px solid var(--glass-stroke)',
              }}>
                <div>Time</div>
                <div>Asset</div>
                <Tip text="Long = AI recommends buying. Short = selling. Neutral = wait — do not trade."><div style={{ borderBottom: '1px dashed var(--ink-3)', display: 'inline-block', cursor: 'help' }}>Bias ⓘ</div></Tip>
                <Tip text="0–100 score reflecting agreement across trend, momentum, volatility, and event-risk inputs. 70+ = tradable. 80+ = high conviction."><div style={{ borderBottom: '1px dashed var(--ink-3)', display: 'inline-block', cursor: 'help' }}>Confidence ⓘ</div></Tip>
                <div>Trend</div>
                <div style={{ textAlign: 'right' }}>%</div>
                <div style={{ textAlign: 'right' }}>Status</div>
                <div style={{ textAlign: 'right' }}>Action</div>
              </div>
              {filtered.map((s, i) => (
                <SignalRow
                  key={s.t + s.asset}
                  s={s} i={i}
                  expanded={expanded === i}
                  onExpand={() => setExpanded(expanded === i ? null : i)}
                  onAlert={() => setAlertSignal(s)}
                />
              ))}
            </>
          )}
        </div>
      </Reveal>

      {alertSignal && <AlertModal signal={alertSignal} onClose={() => setAlertSignal(null)}/>}
    </section>
  );
}

const SIGNAL_INSIGHTS = {
  'XAU/USD': 'EMA-9 above EMA-21, RSI 67 — momentum is in the sweet spot. Range expanding. Ideal for a breakout long with stop below 2329.',
  'EUR/USD': 'London open range expansion in progress. EMA stack aligned. Hold entry tight — USD event risk within 8h.',
  'USD/JPY': 'Watching 152.60 resistance. RSI cooling from 63 → not overbought. Will confirm on 15m close + volume.',
  'BTC/USD': 'Price approaching 71,800 resistance with rising volume. Confidence at 81 reflects strong momentum but elevated volatility.',
  'GBP/USD': 'Rejection at 1.2650 resistance. RSI diverging. Short bias with tight stop above the wicks.',
  'NAS100':  'Tech momentum carrying the index. EMA-21 acting as dynamic support. Risk: macro volatility.',
  'WTI':     'OPEC supply narrative bearish. Price below both EMAs. Short thesis intact while RSI remains below 50.',
  'ETH/USD': 'Following BTC momentum with slight lag. Volume confirming. Watch for BTC confirmation first.',
};

function SignalCard({ s, i, expanded, onExpand, onAlert }) {
  const insight = SIGNAL_INSIGHTS[s.asset] || 'Monitoring for confirmation. Check back on next 15-minute cycle.';
  const isUp = s.pct >= 0;
  return (
    <div style={{ borderBottom: '1px solid var(--glass-stroke)' }}>
      <div style={{
        padding: '14px 12px', cursor: 'pointer',
        background: expanded ? 'var(--inner-card)' : 'transparent',
        borderRadius: expanded ? '8px 8px 0 0' : 8,
        transition: 'background 150ms',
      }} onClick={onExpand}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{s.asset}</span>
            <BiasBadge bias={s.bias}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusPill status={s.status}/>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <ConfidenceBar value={s.conf} color={s.bias === 'Short' ? 'var(--orange)' : 'var(--green)'}/>
          </div>
          <span className="mono" style={{ fontSize: 13, color: isUp ? 'var(--green)' : 'var(--orange)', fontWeight: 500 }}>
            {isUp ? '+' : ''}{s.pct.toFixed(2)}%
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{s.t}</span>
        </div>
      </div>
      {expanded && (
        <div style={{
          padding: '12px 12px 16px', background: 'var(--inner-card)',
          borderRadius: '0 0 8px 8px', borderBottom: '1px solid var(--glass-stroke)',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.6, color: 'var(--ink-2)' }}>{insight}</p>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', marginBottom: 12, flexWrap: 'wrap' }}>
            {s.entry && <span>Entry <strong style={{ color: 'var(--ink)' }}>{s.entry}</strong></span>}
            {s.tp1   && <span>TP1 <strong style={{ color: 'var(--green)' }}>{s.tp1}</strong></span>}
            {s.sl    && <span>SL <strong style={{ color: 'var(--orange)' }}>{s.sl}</strong></span>}
            {s.rr    && <span>R:R <strong style={{ color: 'var(--ink)' }}>{s.rr}</strong></span>}
          </div>
          <button onClick={e => { e.stopPropagation(); onAlert(); }}
            className="btn btn-signal" style={{ width: '100%', justifyContent: 'center', padding: '9px 18px', fontSize: 13 }}>
            + Set Alert
          </button>
        </div>
      )}
    </div>
  );
}

function SignalRow({ s, i, expanded, onExpand, onAlert }) {
  const insight = SIGNAL_INSIGHTS[s.asset] || 'Monitoring for confirmation. Check back on next 15-minute cycle.';
  return (
    <div>
      <Reveal as="div" delay={i * 40} style={{
        display: 'grid',
        gridTemplateColumns: '70px 120px 130px 1fr 130px 80px 90px 100px',
        alignItems: 'center', padding: '14px 16px',
        borderBottom: '1px solid var(--glass-stroke)',
        background: expanded ? 'var(--inner-card)' : 'transparent',
        transition: 'background 150ms', cursor: 'pointer', borderRadius: expanded ? '8px 8px 0 0' : 8,
      }}
        onClick={onExpand}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}
      >
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.t}</div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{s.asset}</div>
        <div><BiasBadge bias={s.bias}/></div>
        <div style={{ maxWidth: 240 }}>
          <ConfidenceBar value={s.conf} color={s.bias === 'Short' ? 'var(--orange)' : 'var(--green)'}/>
        </div>
        <div>
          <Sparkline data={buildSpark(18, s.pct >= 0 ? 1 : -1)} color={s.pct >= 0 ? 'var(--green)' : 'var(--orange)'} width={120} height={24} fill/>
        </div>
        <div className="mono" style={{ fontSize: 13, textAlign: 'right', color: s.pct >= 0 ? 'var(--green)' : 'var(--orange)', fontWeight: 500 }}>
          {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
        </div>
        <div style={{ textAlign: 'right' }}><StatusPill status={s.status}/></div>
        <div style={{ textAlign: 'right' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{expanded ? '▲ less' : '▼ more'}</span>
        </div>
      </Reveal>

      {expanded && (
        <div style={{
          padding: '14px 16px 18px', borderBottom: '1px solid var(--glass-stroke)',
          background: 'var(--inner-card)', borderRadius: '0 0 8px 8px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start',
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8, fontSize: 9 }}>AI INSIGHT · {s.asset}</div>
            <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)' }}>{insight}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
              {s.entry && <span>Entry <strong style={{ color: 'var(--ink)' }}>{s.entry}</strong></span>}
              {s.tp1   && <span>TP1 <strong style={{ color: 'var(--green)' }}>{s.tp1}</strong></span>}
              {s.sl    && <span>SL <strong style={{ color: 'var(--orange)' }}>{s.sl}</strong></span>}
              {s.rr    && <span>R:R <strong style={{ color: 'var(--ink)' }}>{s.rr}</strong></span>}
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAlert(); }}
            className="btn btn-signal"
            style={{ padding: '8px 18px', fontSize: 12, flexShrink: 0 }}
          >
            + Set Alert
          </button>
        </div>
      )}
    </div>
  );
}

function AlertModal({ signal, onClose }) {
  const [type, setType] = useState('entry');
  const [method, setMethod] = useState('telegram');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,7,12,0.82)',
      backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 440, borderRadius: 'var(--radius-xl)', padding: '32px 36px',
        border: '1px solid var(--glass-stroke)', boxShadow: 'var(--shadow-lg)',
      }}>
        {saved ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Alert set for {signal.asset}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>You'll be notified via {method === 'telegram' ? 'Telegram' : method === 'email' ? 'email' : 'browser'}</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--orange)' }}>SET ALERT</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{signal.asset}</div>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)' }}>×</button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>TRIGGER WHEN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'entry',  label: 'Price reaches entry zone', sub: signal.entry ? `Near ${signal.entry}` : 'At current signal entry' },
                  { id: 'tp1',    label: 'TP1 is hit', sub: signal.tp1 ? `At ${signal.tp1}` : 'First target reached' },
                  { id: 'sl',     label: 'Stop loss is threatened', sub: signal.sl ? `Approaching ${signal.sl}` : 'Near stop level' },
                  { id: 'update', label: 'Signal is updated by AI', sub: 'Confidence change or bias flip' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setType(opt.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderRadius: 10, border: `1px solid ${type === opt.id ? 'var(--orange)' : 'var(--glass-stroke)'}`,
                    background: type === opt.id ? 'rgba(238,106,19,0.08)' : 'var(--inner-card)',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${type === opt.id ? 'var(--orange)' : 'var(--ink-3)'}`, background: type === opt.id ? 'var(--orange)' : 'transparent', flexShrink: 0 }}/>
                    <span>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{opt.sub}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>NOTIFY VIA</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'telegram', label: '◈ Telegram' },
                  { id: 'email',    label: '✉ Email' },
                  { id: 'browser',  label: '⬡ Browser' },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)',
                    border: `1px solid ${method === m.id ? 'var(--orange)' : 'var(--glass-stroke)'}`,
                    background: method === m.id ? 'rgba(238,106,19,0.08)' : 'transparent',
                    color: method === m.id ? 'var(--orange)' : 'var(--ink-2)',
                    cursor: 'pointer',
                  }}>{m.label}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn btn-signal" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
              Activate Alert
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    'active':   { label: 'Active',  dot: 'var(--orange)', bg: 'rgba(238,106,19,0.08)' },
    'watching': { label: 'Watch',   dot: 'var(--ink-4)',  bg: 'rgba(11,13,18,0.06)' },
    'hold':     { label: 'Hold',    dot: 'var(--ink-4)',  bg: 'rgba(11,13,18,0.06)' },
    'closed-w': { label: 'Won',     dot: 'var(--green)',  bg: 'rgba(15,184,100,0.1)' },
    'closed-l': { label: 'Lost',    dot: 'var(--orange)', bg: 'rgba(238,106,19,0.1)' },
  };
  const m = map[status] || map['watching'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 500,
      letterSpacing: '0.08em', background: m.bg, color: 'var(--ink-2)',
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: m.dot }}/>
      {m.label}
    </span>
  );
}

export function AIReasoning() {
  const factors = Object.values(SIGNAL_FACTORS);
  const overall = Math.round(factors.reduce((a, f) => a + f.score, 0) / factors.length);
  const isMobile = useMobile();

  return (
    <section id="reasoning" className="container">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? 32 : 56, alignItems: 'start' }}>
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 120 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>02 · AI REASONING</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: '0 0 20px', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              See <em style={{ color: 'var(--orange)' }}>why it thinks</em> what it thinks.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.5, margin: '0 0 28px', maxWidth: 460 }}>
              Every signal scores across four dimensions. Each one has a reason.
              Understanding the score is how you trade with conviction — not just compliance.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {factors.map((f, i) => (
                <FactorCard key={f.label} factor={f} delay={i * 80}/>
              ))}
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <div className="glass" style={{ padding: 24, borderRadius: 'var(--radius-xl)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LogoMark size={22}/>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>REASONING TRACE · XAU/USD</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Signal #24,814 · 1.82s</div>
                  </div>
                </div>
                <span className="chip">
                  <span className="chip-dot live"/>
                  <span>LIVE</span>
                </span>
              </div>

              {REASONING_STEPS.map((step, i) => (
                <ReasoningStep key={i} step={step} index={i} delay={i * 380}/>
              ))}

              <Reveal delay={REASONING_STEPS.length * 380 + 200}>
                <div style={{
                  marginTop: 16, padding: 18, borderRadius: 'var(--radius)',
                  background: 'linear-gradient(135deg, rgba(238,106,19,0.08), rgba(15,184,100,0.08))',
                  border: '1px solid rgba(238,106,19,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div className="eyebrow" style={{ color: 'var(--orange)' }}>WHAT THIS MEANS FOR YOU</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>conf {overall}/100</div>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-2)' }}>
                    This is a <strong style={{ color: 'var(--ink)' }}>high-conviction long</strong> with one caveat: CPI is 36 hours out.
                    The technical read is clean — trend aligned, momentum in the sweet spot, no divergence.
                    Trade it at <strong style={{ color: 'var(--ink)' }}>half your normal size</strong> and take profit at TP1 before the event window.
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Entry', val: '2341.20', col: 'var(--ink)' },
                      { label: 'TP1',   val: '2358.00', col: 'var(--green)' },
                      { label: 'TP2',   val: '2372.40', col: 'var(--green)' },
                      { label: 'SL',    val: '2329.80', col: 'var(--orange)' },
                      { label: 'R:R',   val: '2.9×',    col: 'var(--ink)' },
                    ].map(x => (
                      <span key={x.label} style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 12,
                        background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <span style={{ color: 'var(--ink-3)', marginRight: 4 }}>{x.label}</span>
                        <span style={{ color: x.col, fontWeight: 600 }}>{x.val}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div style={{
              padding: 16, borderRadius: 'var(--radius-lg)',
              background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Waveform bars={28} color="var(--orange)" height={22}/>
              <div style={{ flex: 1 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>MODEL</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 500 }}>gpt-4o · Temperature 0.3 · JSON mode</div>
              </div>
              <div className="chip">
                <span className="chip-dot live"/>
                <span>THINKING</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FactorCard({ factor, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 'var(--radius)', border: `1px solid ${open ? factor.color + '44' : 'var(--glass-stroke)'}`,
      background: open ? factor.color + '08' : 'var(--inner-card)',
      transition: 'all 200ms', cursor: 'pointer',
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: factor.color + '18', color: factor.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700,
        }}>{factor.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{factor.label}</span>
            <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: factor.color }}>{factor.score}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--glass-stroke)', overflow: 'hidden' }}>
            <div style={{ width: `${factor.score}%`, height: '100%', background: factor.color, borderRadius: 2, transition: 'width 600ms cubic-bezier(.2,.7,.2,1)' }}/>
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 14px 60px' }}>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-2)', marginBottom: 8 }}>
            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>What the AI sees:</strong>
            {factor.what}
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.55, color: factor.color, fontWeight: 500 }}>
            {factor.impact}
          </div>
        </div>
      )}
    </div>
  );
}

function ReasoningStep({ step, index, delay }) {
  return (
    <Reveal delay={delay} style={{ display: 'flex', gap: 14, paddingBottom: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: index === REASONING_STEPS.length - 1 ? 'var(--orange)' : 'white',
          border: '1px solid var(--glass-stroke)', boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: index === REASONING_STEPS.length - 1 ? 'white' : 'var(--ink-2)',
          }}>{step.icon}</span>
        </div>
        {index < REASONING_STEPS.length - 1 && (
          <div style={{ width: 1, flex: 1, background: 'var(--line)', marginTop: 4, minHeight: 20 }}/>
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 3 }}>
        <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--orange)', fontSize: 9 }}>{step.tag}</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)' }}>
          <Typewriter text={step.text} speed={8} startDelay={0}/>
        </div>
      </div>
    </Reveal>
  );
}

export function ActiveTrade() {
  const s = HERO_SIGNAL;
  const [alertOpen, setAlertOpen] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState(false);
  const [maxLoss, setMaxLoss] = useState(2);
  const [minRR, setMinRR] = useState(1.8);
  const isMobile = useMobile();

  return (
    <section id="trade" className="container">
      <Reveal>
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--green)' }}>03 · ACTIVE TRADE</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em' }}>
            One signal, <em style={{ color: 'var(--green)' }}>fully unpacked</em>.
          </h2>
        </div>
      </Reveal>

      <Reveal>
        <div className="glass" style={{ padding: 28, borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 16, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="mono" style={{ fontSize: isMobile ? 22 : 28, fontWeight: 600, letterSpacing: '-0.02em' }}>XAU/USD</div>
                    <BiasBadge bias="Long" confidence={84}/>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Gold Spot · 4H · Signal #24,814</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['1H', '4H', '1D', '1W'].map((t) => (
                    <button key={t} style={{
                      padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-stroke)',
                      background: t === '4H' ? 'var(--ink)' : 'white',
                      color: t === '4H' ? 'var(--paper)' : 'var(--ink-2)',
                      fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: 'var(--radius)', background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)', padding: '12px 8px' }}>
                <CandleChart candles={CANDLES} width={640} height={280}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
                {[
                  { k: 'EMA 9',  v: '2338.4', d: '+0.12%', col: 'var(--green)',  tip: 'EMA-9 is above EMA-21 — short-term momentum is leading long-term momentum upward. This is the primary trend alignment signal.' },
                  { k: 'EMA 21', v: '2331.8', d: '+0.07%', col: 'var(--green)',  tip: 'The 21-period EMA tracks medium-term trend direction. Price above both EMAs = bullish structure intact.' },
                  { k: 'RSI 14', v: '67.2',   d: 'bullish', col: 'var(--green)', tip: 'RSI at 67 is in the momentum sweet spot (55–70). Strong enough to confirm the move, not so high (above 70) that it signals exhaustion.' },
                  { k: 'Vol',    v: '1.12σ',  d: 'expand', col: 'var(--orange)', tip: 'Volatility is expanding (+14% vs 5-session average). Good for breakout follow-through. Requires a slightly wider stop to survive normal noise.' },
                ].map((x, i) => (
                  <Tip key={i} text={x.tip}>
                    <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)', width: '100%' }}>
                      <div className="eyebrow" style={{ fontSize: 9 }}>{x.k} ⓘ</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
                        <span className="mono" style={{ fontSize: 16, fontWeight: 500 }}>{x.v}</span>
                        <span className="mono" style={{ fontSize: 11, color: x.col }}>{x.d}</span>
                      </div>
                    </div>
                  </Tip>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(238,106,19,0.06), transparent)', border: '1px solid var(--glass-stroke)' }}>
                <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--orange)' }}>AI HEADLINE</div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{s.headline}</div>
              </div>

              <div style={{ padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)' }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>WHY THIS TRADE</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--ink-2)' }}>{s.reasoning}</p>
              </div>

              <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div className="eyebrow">RISK · REWARD</div>
                  <Tip text="R:R is the ratio of your potential profit (TP2 − Entry) to your potential loss (Entry − SL). SIGMENTUM requires a minimum of 1.8. This trade is 2.9 — exceptional.">
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', borderBottom: '1px dashed var(--ink-3)' }}>What is R:R? ⓘ</span>
                  </Tip>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                  <StatItem label="Risk" value="–11.4" unit="pts" color="var(--orange)"/>
                  <StatItem label="Reward" value="+31.2" unit="pts" color="var(--green)"/>
                  <StatItem label="R:R" value={s.rr} color="var(--ink)"/>
                </div>
                <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }}/>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  <span className="chip-dot" style={{ background: 'var(--green)', display: 'inline-block', marginRight: 6 }}/>
                  Reward is <strong style={{ color: 'var(--green)' }}>2.9×</strong> the risk. Take half profit at TP1, move stop to breakeven, let TP2 run.
                </div>
              </div>

              <div style={{
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-stroke)',
                overflow: 'hidden',
              }}>
                <button onClick={() => setRiskExpanded(!riskExpanded)} style={{
                  width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--inner-card)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}>
                  <div className="eyebrow">MY RISK PROFILE</div>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', transform: riskExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▾</span>
                </button>
                {riskExpanded && (
                  <div style={{ padding: '4px 16px 16px', background: 'var(--inner-card)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Daily max loss</span>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>{maxLoss}%</span>
                      </div>
                      <input type="range" min={0.5} max={5} step={0.5} value={maxLoss} onChange={e => setMaxLoss(+e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--orange)' }}/>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Stop trading for the day if losses exceed {maxLoss}% of capital.</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Minimum R:R to trade</span>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{minRR.toFixed(1)}</span>
                      </div>
                      <input type="range" min={1.0} max={4.0} step={0.1} value={minRR} onChange={e => setMinRR(+e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--green)' }}/>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                        This XAU/USD signal has R:R {s.rr} — <span style={{ color: s.rr >= minRR ? 'var(--green)' : 'var(--orange)', fontWeight: 600 }}>{s.rr >= minRR ? '✓ meets your threshold' : '✗ below your threshold'}</span>
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(15,184,100,0.08)', border: '1px solid rgba(15,184,100,0.2)', fontSize: 12, color: 'var(--ink-2)' }}>
                      <strong style={{ color: 'var(--green)', display: 'block', marginBottom: 4 }}>Recommended position size</strong>
                      Based on {maxLoss}% daily max loss and 1:1 stop sizing, risk ≤ 1% per trade. At $10,000 account: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontWeight: 600 }}>$100 max risk</span> on this signal.
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-signal" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAlertOpen(true)}>
                  + Set Alert
                </button>
                <button className="btn" style={{ justifyContent: 'center' }}>Telegram</button>
                <button className="btn" style={{ justifyContent: 'center' }}>Memo</button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {alertOpen && <AlertModal signal={{ asset: 'XAU/USD', entry: s.entry, tp1: s.tp1, sl: s.sl, rr: s.rr }} onClose={() => setAlertOpen(false)}/>}
    </section>
  );
}

function StatItem({ label, value, unit, color = 'var(--ink)' }) {
  return (
    <div>
      <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ marginTop: 4 }}>
        <span className="mono" style={{ fontSize: 18, fontWeight: 500, color }}>{value}</span>
        {unit && <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
}
