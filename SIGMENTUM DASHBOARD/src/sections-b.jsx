// Sections B — Signal feed, AI reasoning stream, active trade detail
const { useEffect: useEffB, useRef: useRefB, useState: useStateB } = React;

function SignalFeed() {
  const [filter, setFilter] = useStateB('all');
  const filtered = filter === 'all' ? SIGNAL_FEED
    : SIGNAL_FEED.filter(s => {
        if (filter === 'long') return s.bias === 'Long';
        if (filter === 'short') return s.bias === 'Short';
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
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'long', label: 'Long' },
              { id: 'short', label: 'Short' },
            ].map(t => (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                padding: '6px 14px', borderRadius: 999, border: 'none',
                background: filter === t.id ? 'var(--ink)' : 'transparent',
                color: filter === t.id ? 'var(--paper)' : 'var(--ink-2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 150ms',
              }}>{t.label}</button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="glass" style={{ padding: 8, borderRadius: 'var(--radius-lg)' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '70px 120px 140px 1fr 140px 90px 90px',
            padding: '12px 16px',
            fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
            color: 'var(--ink-3)', textTransform: 'uppercase',
            borderBottom: '1px solid var(--glass-stroke)',
          }}>
            <div>Time</div>
            <div>Asset</div>
            <div>Bias</div>
            <div>Confidence</div>
            <div>Trend</div>
            <div style={{ textAlign: 'right' }}>%</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>

          {filtered.map((s, i) => (
            <Reveal key={s.t+s.asset} delay={i * 40} as="div" style={{
              display: 'grid',
              gridTemplateColumns: '70px 120px 140px 1fr 140px 90px 90px',
              alignItems: 'center',
              padding: '14px 16px',
              borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--glass-stroke)',
              transition: 'background 150ms',
              cursor: 'pointer',
              borderRadius: 8,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--inner-card)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.t}</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{s.asset}</div>
              <div><BiasBadge bias={s.bias}/></div>
              <div style={{ maxWidth: 240 }}>
                <ConfidenceBar value={s.conf} color={s.bias === 'Short' ? 'var(--orange)' : 'var(--green)'}/>
              </div>
              <div>
                <Sparkline
                  data={buildSpark(18, s.pct >= 0 ? 1 : -1)}
                  color={s.pct >= 0 ? 'var(--green)' : 'var(--orange)'}
                  width={120} height={24} fill
                />
              </div>
              <div className="mono" style={{
                fontSize: 13, textAlign: 'right',
                color: s.pct >= 0 ? 'var(--green)' : 'var(--orange)', fontWeight: 500,
              }}>
                {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusPill status={s.status}/>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
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

// ---------------------------- AI Reasoning stream ----------------------------
function AIReasoning() {
  return (
    <section id="reasoning" className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 120 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>02 · AI REASONING</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: '0 0 20px', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              See <em style={{ color: 'var(--orange)' }}>how it thinks</em>, not just <em style={{ color: 'var(--green)' }}>what it decides</em>.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ color: 'var(--ink-3)', fontSize: 17, lineHeight: 1.5, margin: '0 0 24px', maxWidth: 460 }}>
              Every signal is a transparent chain — from raw OHLC through pattern detection,
              risk modulation, and final decision. Expand any step to audit the model's work.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 'var(--radius)',
              background: 'var(--inner-card)',
              border: '1px solid var(--glass-stroke)',
              maxWidth: 380,
            }}>
              <Waveform bars={28} color="var(--orange)" height={22}/>
              <div style={{ flex: 1 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>MODEL</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 500 }}>gpt-4o-mini · T 0.3</div>
              </div>
              <div className="chip">
                <span className="chip-dot live"></span>
                <span>THINKING</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="glass" style={{ padding: 24, borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LogoMark size={22}/>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>TRACE · XAU/USD</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Signal #24,814</div>
                </div>
              </div>
              <span className="chip">
                <span className="mono" style={{ color: 'var(--ink-3)' }}>1.82s</span>
              </span>
            </div>

            {REASONING_STEPS.map((step, i) => (
              <ReasoningStep key={i} step={step} index={i} delay={i * 380}/>
            ))}

            {/* Final output card */}
            <Reveal delay={REASONING_STEPS.length * 380 + 200}>
              <div style={{
                marginTop: 16, padding: 18, borderRadius: 'var(--radius)',
                background: 'linear-gradient(135deg, rgba(238,106,19,0.08), rgba(15,184,100,0.08))',
                border: '1px solid rgba(238,106,19,0.2)',
              }}>
                <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>OUTPUT · JSON</div>
                <pre className="mono" style={{
                  margin: 0, fontSize: 12, lineHeight: 1.6,
                  color: 'var(--ink-2)', whiteSpace: 'pre-wrap',
                }}>{`{
  "bias": "Long",
  "confidence": 84,
  "risk_level": "Moderate",
  "headline": "Momentum accelerates as real yields soften",
  "action_summary": "Enter 2341.20, TP1 2358, TP2 2372.40, SL 2329.80."
}`}</pre>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReasoningStep({ step, index, delay }) {
  return (
    <Reveal delay={delay} style={{ display: 'flex', gap: 14, paddingBottom: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: index === REASONING_STEPS.length - 1 ? 'var(--orange)' : 'white',
          border: '1px solid var(--glass-stroke)',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0,
        }}>
          <span className="mono" style={{
            fontSize: 11, fontWeight: 600,
            color: index === REASONING_STEPS.length - 1 ? 'white' : 'var(--ink-2)',
          }}>{index + 1}</span>
        </div>
        {index < REASONING_STEPS.length - 1 && (
          <div style={{
            width: 1, flex: 1, background: 'var(--line)', marginTop: 4, minHeight: 20,
          }}/>
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 3 }}>
        <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--ink-3)' }}>{step.tag}</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          <Typewriter text={step.text} speed={10} startDelay={0}/>
        </div>
      </div>
    </Reveal>
  );
}

// ---------------------------- Active Trade detail ----------------------------
function ActiveTrade() {
  const s = HERO_SIGNAL;
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
            {/* Chart side */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>XAU/USD</div>
                    <BiasBadge bias="Long" confidence={84}/>
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Gold Spot · 4H</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['1H', '4H', '1D', '1W'].map((t, i) => (
                    <button key={t} style={{
                      padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-stroke)',
                      background: t === '4H' ? 'var(--ink)' : 'white',
                      color: t === '4H' ? 'var(--paper)' : 'var(--ink-2)',
                      fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{
                borderRadius: 'var(--radius)',
                background: 'var(--inner-card)',
                border: '1px solid var(--glass-stroke)',
                padding: '12px 8px',
              }}>
                <CandleChart candles={CANDLES} width={640} height={280}/>
              </div>

              {/* Indicator row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16 }}>
                {[
                  { k: 'EMA 9',  v: '2338.4', d: '+0.12%', col: 'var(--green)' },
                  { k: 'EMA 21', v: '2331.8', d: '+0.07%', col: 'var(--green)' },
                  { k: 'RSI 14', v: '67.2',   d: 'bullish', col: 'var(--green)' },
                  { k: 'Vol',    v: '1.12σ',  d: 'expand', col: 'var(--orange)' },
                ].map((x, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 10,
                    background: 'var(--inner-card)',
                    border: '1px solid var(--glass-stroke)',
                  }}>
                    <div className="eyebrow" style={{ fontSize: 9 }}>{x.k}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
                      <span className="mono" style={{ fontSize: 16, fontWeight: 500 }}>{x.v}</span>
                      <span className="mono" style={{ fontSize: 11, color: x.col }}>{x.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: 20, borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(238,106,19,0.06), transparent)',
                border: '1px solid var(--glass-stroke)',
              }}>
                <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>AI HEADLINE</div>
                <div className="serif" style={{ fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  {s.headline}
                </div>
              </div>

              <div style={{
                padding: 20, borderRadius: 'var(--radius-lg)',
                background: 'var(--inner-card)',
                border: '1px solid var(--glass-stroke)',
              }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>REASONING</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                  {s.reasoning}
                </p>
              </div>

              <div style={{
                padding: 16, borderRadius: 'var(--radius-lg)',
                background: 'var(--inner-card)',
                border: '1px solid var(--glass-stroke)',
              }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>RISK · REWARD</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                  <Stat label="Risk" value="–11.4" unit="pips" color="var(--orange)"/>
                  <Stat label="Reward" value="+31.2" unit="pips" color="var(--green)"/>
                  <Stat label="R:R" value={s.rr} color="var(--ink)"/>
                </div>
                <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)' }}>
                  <span className="chip-dot" style={{ background: 'var(--green)' }}/>
                  <span>Reward zone is <strong style={{ color: 'var(--green)' }}>2.9×</strong> larger than risk — within house rules.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-signal" style={{ flex: 1, justifyContent: 'center' }}>Send to Telegram</button>
                <button className="btn" style={{ justifyContent: 'center' }}>Memo .txt</button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Stat({ label, value, unit, color = 'var(--ink)' }) {
  return (
    <div>
      <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ display: 'baseline', marginTop: 4 }}>
        <span className="mono" style={{ fontSize: 18, fontWeight: 500, color }}>{value}</span>
        {unit && <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
}

Object.assign(window, { SignalFeed, AIReasoning, ActiveTrade });
