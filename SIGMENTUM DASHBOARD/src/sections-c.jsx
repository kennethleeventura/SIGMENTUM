// Sections C — Risk, Pipeline, Performance, Telegram, Learn (Blog + Glossary), Footer
const { useEffect: useEffC, useRef: useRefC, useState: useStateC } = React;

// ---------------------------- Risk Dashboard ----------------------------
function RiskDashboard() {
  const exposures = [
    { asset: 'XAU/USD', pct: 28, bias: 'Long',  risk: 'Moderate' },
    { asset: 'BTC/USD', pct: 22, bias: 'Long',  risk: 'High' },
    { asset: 'EUR/USD', pct: 18, bias: 'Long',  risk: 'Low' },
    { asset: 'NAS100',  pct: 14, bias: 'Long',  risk: 'Moderate' },
    { asset: 'WTI',     pct: 10, bias: 'Short', risk: 'High' },
    { asset: 'USD/JPY', pct: 8,  bias: 'Long',  risk: 'Low' },
  ];
  const riskColor = { Low: 'var(--green)', Moderate: '#d99319', High: 'var(--orange)' };

  return (
    <section id="risk" className="container">
      <Reveal>
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>04 · RISK</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em' }}>
            Conviction is <em style={{ color: 'var(--green)' }}>nothing</em> without <em style={{ color: 'var(--orange)' }}>discipline</em>.
          </h2>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        <Reveal>
          <div className="glass" style={{ padding: 24, borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div className="eyebrow">Book exposure</div>
              <span className="chip">
                <span className="mono" style={{ color: 'var(--ink-3)' }}>6 active · $124.8K</span>
              </span>
            </div>

            {exposures.map((e, i) => (
              <Reveal key={e.asset} delay={i * 60} as="div" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mono" style={{ fontWeight: 600 }}>{e.asset}</span>
                    <BiasBadge bias={e.bias}/>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: riskColor[e.risk], letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>{e.risk} risk</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 500 }}>{e.pct}%</span>
                  </div>
                </div>
                <ConfidenceBar value={e.pct * 3} color={e.bias === 'Short' ? 'var(--orange)' : 'var(--green)'} height={5} showValue={false}/>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Reveal delay={100}>
            <div className="glass" style={{ padding: 22, borderRadius: 'var(--radius-xl)' }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Event horizon</div>
              {[
                { when: '36h', event: 'US CPI release', level: 'High' },
                { when: '5d',  event: 'FOMC minutes',    level: 'High' },
                { when: '8d',  event: 'NFP',             level: 'Moderate' },
                { when: '12d', event: 'ECB rate decision', level: 'Moderate' },
              ].map((x, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--glass-stroke)',
                }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', width: 40 }}>{x.when}</span>
                  <span style={{ fontSize: 13, flex: 1 }}>{x.event}</span>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    color: riskColor[x.level], letterSpacing: '0.08em',
                    textTransform: 'uppercase', fontWeight: 500,
                  }}>{x.level}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="glass" style={{
              padding: 22, borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(238,106,19,0.08), rgba(15,184,100,0.06))',
            }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Daily risk budget</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 8, marginBottom: 14 }}>
                <span className="mono" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>
                  <CountUp value={1.42} decimals={2}/>%
                </span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)', paddingBottom: 6 }}>/ 2.00% cap</span>
              </div>
              <ConfidenceBar value={71} color="var(--orange)" height={7} showValue={false}/>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10, lineHeight: 1.5 }}>
                Within guardrails. 0.58% remaining before the system auto-pauses new entries.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------- Pipeline ----------------------------
function Pipeline() {
  return (
    <section id="pipeline" className="container">
      <Reveal>
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--green)' }}>05 · PIPELINE</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 900 }}>
            From <em style={{ color: 'var(--ink-2)' }}>sheet</em> to <em style={{ color: 'var(--orange)' }}>signal</em> to <em style={{ color: 'var(--green)' }}>send</em>.
          </h2>
        </div>
      </Reveal>

      <Reveal>
        <div className="glass" style={{ padding: 28, borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="chip">
                <span className="chip-dot live"></span>
                <span>RUN · LIVE</span>
              </span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>cycle #18,422 · 2.67s end-to-end</span>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>next run in 08:42</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PIPELINE.length}, 1fr)`,
            gap: 0,
            position: 'relative',
          }}>
            {PIPELINE.map((p, i) => (
              <PipelineNode key={p.id} node={p} index={i} isLast={i === PIPELINE.length - 1}/>
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, paddingTop: 20,
            borderTop: '1px solid var(--glass-stroke)',
            fontSize: 12, color: 'var(--ink-3)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="chip-dot" style={{ background: 'var(--green)' }}/> OK
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="chip-dot" style={{ background: 'var(--orange)', animation: 'pulse 1.6s ease-in-out infinite' }}/> Working
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="chip-dot" style={{ background: 'var(--ink-5)' }}/> Idle
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>orchestrated by Make.com · every 15 min</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function PipelineNode({ node, index, isLast }) {
  const statusColor = node.status === 'ok' ? 'var(--green)' : node.status === 'working' ? 'var(--orange)' : 'var(--ink-5)';
  return (
    <Reveal delay={index * 120} style={{ position: 'relative' }}>
      <div style={{ textAlign: 'center', padding: '0 6px' }}>
        <div style={{
          width: 56, height: 56, margin: '0 auto 12px',
          borderRadius: 14,
          background: 'white',
          border: `1.5px solid ${node.status === 'working' ? 'var(--orange)' : 'var(--glass-stroke)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: node.status === 'working' ? '0 0 0 6px var(--orange-glow)' : 'var(--shadow-sm)',
          position: 'relative', zIndex: 2,
          transition: 'all 300ms',
        }}>
          <span className="mono" style={{ fontSize: 18, fontWeight: 600 }}>{node.id}</span>
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 12, height: 12, borderRadius: '50%',
            background: statusColor, border: '2px solid white',
            animation: node.status === 'working' ? 'pulse 1.6s ease-in-out infinite' : 'none',
          }}/>
        </div>
        <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>{node.tool}</div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{node.label}</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{node.sub}</div>
        <div className="mono" style={{ fontSize: 10, color: statusColor, marginTop: 4, fontWeight: 500 }}>{node.ms}ms</div>
      </div>

      {!isLast && (
        <div style={{
          position: 'absolute', top: 28, left: 'calc(50% + 28px)', right: '-50%',
          height: 2, zIndex: 1,
          background: `linear-gradient(90deg, ${statusColor}44, var(--line-strong))`,
        }}>
          <div style={{
            position: 'absolute', top: -2, left: 0,
            width: 6, height: 6, borderRadius: '50%',
            background: statusColor,
            animation: 'flow 2.8s ease-in-out infinite',
            animationDelay: `${index * 0.2}s`,
          }}/>
        </div>
      )}
      <style>{`
        @keyframes flow {
          0% { transform: translateX(0); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(160px); opacity: 0; }
        }
      `}</style>
    </Reveal>
  );
}

// ---------------------------- Performance ----------------------------
function Performance() {
  return (
    <section className="container">
      <Reveal>
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--green)' }}>06 · PERFORMANCE</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em' }}>
            The numbers, <em style={{ color: 'var(--green)' }}>as they actually are</em>.
          </h2>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {PERF_STATS.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="glass lift" style={{ padding: 22, borderRadius: 'var(--radius-lg)' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>{s.label}</div>
              <div className="mono" style={{
                fontSize: 38, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1,
                color: s.tone === 'signals' ? 'var(--orange)' : s.tone === 'momentum' ? 'var(--green)' : 'var(--ink)',
              }}>
                {s.value}
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{s.delta}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Equity curve */}
      <Reveal delay={300}>
        <div className="glass" style={{ padding: 24, borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Equity curve · 90d</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span className="mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>
                  +<CountUp value={24.8} decimals={1}/>%
                </span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--green)' }}>▲ vs benchmark +18.2%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['30d', '90d', 'YTD', '1Y'].map(t => (
                <button key={t} style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid var(--glass-stroke)',
                  background: t === '90d' ? 'var(--ink)' : 'white',
                  color: t === '90d' ? 'var(--paper)' : 'var(--ink-2)',
                  fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <EquityCurve/>
        </div>
      </Reveal>
    </section>
  );
}

function EquityCurve() {
  const [pts, spark] = React.useMemo(() => {
    const p = [];
    let v = 100;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - 0.3) * 1.4 + 0.3;
      p.push(v);
    }
    // benchmark softer
    const b = [];
    let vb = 100;
    for (let i = 0; i < 60; i++) {
      vb += (Math.random() - 0.35) * 0.9 + 0.2;
      b.push(vb);
    }
    return [p, b];
  }, []);

  const width = 1200, height = 240;
  const min = Math.min(...pts, ...spark);
  const max = Math.max(...pts, ...spark);
  const range = max - min || 1;
  const x = (i, arr) => (i / (arr.length - 1)) * width;
  const y = (v) => height - ((v - min) / range) * (height - 20) - 10;

  const line = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i, arr)} ${y(v)}`).join(' ');
  const area = (arr) => `${line(arr)} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="eq-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--green)" stopOpacity="0.2"/>
          <stop offset="1" stopColor="var(--green)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="0" x2={width} y1={p*height} y2={p*height} stroke="rgba(11,13,18,0.05)" strokeDasharray="2 4"/>
      ))}
      {/* benchmark */}
      <path d={line(spark)} stroke="var(--ink-5)" strokeWidth="1.4" fill="none" strokeDasharray="3 3"/>
      {/* sigmentum */}
      <path d={area(pts)} fill="url(#eq-area)"/>
      <path d={line(pts)} stroke="var(--green)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      {/* End dot */}
      <circle cx={x(pts.length - 1, pts)} cy={y(pts[pts.length - 1])} r="5" fill="var(--green)"/>
      <circle cx={x(pts.length - 1, pts)} cy={y(pts[pts.length - 1])} r="10" fill="var(--green)" opacity="0.2"/>
    </svg>
  );
}

// ---------------------------- Telegram ----------------------------
function Telegram() {
  return (
    <section className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'center' }}>
        <Reveal>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--orange)' }}>07 · ALERTS</div>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: '0 0 20px', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              Signals land <em style={{ color: 'var(--orange)' }}>where you are</em>.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--ink-3)', margin: '0 0 28px' }}>
              Every signal is pushed to your private Telegram channel in under 100ms, with a
              full memo attached as a .txt so you can archive or audit later.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-signal" href="#">
                <span>Connect Telegram</span> <span style={{ fontSize: 16 }}>→</span>
              </a>
              <a className="btn" href="#">View memo template</a>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              {[
                { k: 'Avg push', v: '94ms' },
                { k: 'Delivery', v: '99.98%' },
                { k: 'Attachments', v: '.txt · .csv' },
              ].map((x, i) => (
                <div key={i}>
                  <div className="eyebrow" style={{ fontSize: 9 }}>{x.k}</div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <LiveTelegram/>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------- Learn — Blog + Glossary ----------------------------
function Learn() {
  return (
    <section id="learn" className="container">
      <Reveal>
        <div style={{ marginBottom: 36 }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--green)' }}>08 · LEARN</div>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 500, margin: 0, lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 900 }}>
            <em style={{ color: 'var(--green)' }}>Education</em>, embedded. So every signal teaches.
          </h2>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 48 }}>
        {/* Blog */}
        <Reveal>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="eyebrow">Automated journal</div>
              <a href="#" style={{ fontSize: 13, color: 'var(--ink-2)', textDecoration: 'none' }}>All posts →</a>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {BLOG_POSTS.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="glass lift" style={{ padding: 18, borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 11 }}>
                        <span className="chip">
                          <span style={{ color: 'var(--orange)' }}>{p.cat}</span>
                        </span>
                        <span className="mono" style={{ color: 'var(--ink-3)' }}>{p.read}</span>
                        <span className="chip" style={{ fontSize: 9 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}/>
                          <span>AUTO-GENERATED</span>
                        </span>
                        <span className="mono" style={{ color: 'var(--ink-3)', marginLeft: 'auto' }}>{p.date}</span>
                      </div>
                      <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 8 }}>
                        {p.title}
                      </div>
                      {p.hook && (
                        <div style={{
                          fontSize: 13, fontStyle: 'italic',
                          color: 'var(--ink-2)', margin: '0 0 8px',
                          paddingLeft: 12, borderLeft: '2px solid var(--orange)',
                          fontFamily: 'var(--font-serif)',
                        }}>
                          “{p.hook}”
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{p.excerpt}</div>
                      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--orange)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                        READ →
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Glossary */}
        <Reveal delay={200}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="eyebrow">AI-powered glossary</div>
              <span className="chip">
                <Waveform bars={10} height={10}/>
                <span style={{ marginLeft: 4 }}>LIVE DEFINITIONS</span>
              </span>
            </div>
            <div className="glass" style={{ padding: 8, borderRadius: 'var(--radius-lg)' }}>
              {GLOSSARY.map((g, i) => <GlossaryItem key={i} entry={g} delay={i * 60}/>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GlossaryItem({ entry, delay }) {
  const [open, setOpen] = useStateC(false);
  return (
    <Reveal delay={delay} as="div" style={{
      borderBottom: '1px solid var(--glass-stroke)',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 16px',
        background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', gap: 12,
        textAlign: 'left', cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          background: open ? 'var(--orange)' : 'rgba(11,13,18,0.05)',
          color: open ? 'white' : 'var(--ink-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 500,
          transition: 'all 200ms',
        }}>{open ? '−' : '+'}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', flex: 1 }}>{entry.term}</span>
        {/* AI clarity score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: 'rgba(11,13,18,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${entry.score}%`, height: '100%',
              background: `linear-gradient(90deg, var(--orange), var(--green))`,
              borderRadius: 2,
            }}/>
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 500, minWidth: 20 }}>{entry.score}</span>
        </div>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em', marginLeft: 6 }}>
          {entry.links.length} LINK{entry.links.length > 1 ? 'S' : ''}
        </span>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0, overflow: 'hidden',
        transition: 'max-height 300ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ padding: '0 16px 14px 50px' }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' }}>{entry.def}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {entry.links.map((L, i) => (
              <a key={i} href="#" style={{
                fontSize: 11, fontFamily: 'var(--font-mono)',
                padding: '3px 9px', borderRadius: 6,
                background: L.ext ? 'rgba(11,93,238,0.08)' : 'rgba(15,184,100,0.1)',
                color: L.ext ? 'var(--blue)' : 'var(--green)',
                textDecoration: 'none', letterSpacing: '0.02em',
              }}>
                {L.ext ? '↗ ' : '→ '}{L.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ---------------------------- Footer ----------------------------
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ padding: '100px 0 60px', borderTop: '1px solid var(--line)', marginTop: 40, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient wash */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-40% -10% auto -10%', height: '80%',
        background: 'radial-gradient(ellipse at 30% 100%, rgba(238,106,19,0.08), transparent 55%), radial-gradient(ellipse at 70% 100%, rgba(15,184,100,0.08), transparent 55%)',
        pointerEvents: 'none',
      }}/>
      <div className="container" style={{ position: 'relative' }}>
        <Reveal>
          <h3 className="serif" style={{
            fontSize: 'clamp(48px, 7vw, 120px)', lineHeight: 0.95,
            letterSpacing: '-0.03em', margin: '0 0 48px',
            textAlign: 'center', color: 'var(--ink)',
          }}>
            Where <em style={{ color: 'var(--orange)' }}>signals</em> meet <em style={{ color: 'var(--green)' }}>momentum</em>.
          </h3>
        </Reveal>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32,
          paddingTop: 40, borderTop: '1px solid var(--line)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <LogoMark size={24}/>
              <Wordmark size={18}/>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 320 }}>
              Institutional-grade trading intelligence for the independent trader. AI-powered signals,
              momentum analysis, and risk management — automated end-to-end.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <span className="chip">
                <span className="chip-dot live"></span>
                <span>ALL SYSTEMS NORMAL</span>
              </span>
            </div>
          </div>
          {[
            { title: 'System', links: ['Live signals', 'Active trades', 'AI reasoning', 'Pipeline status', 'Performance'] },
            { title: 'Learn', links: ['Journal', 'Glossary', 'Methodology', 'Field guides', 'API docs'] },
            { title: 'Company', links: ['About', 'Contact', 'Careers', 'Press kit', 'Partners'] },
          ].map((col, i) => (
            <div key={i}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontSize: 13, color: 'var(--ink-2)', textDecoration: 'none' }}
                     onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
                     onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-2)'}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Risk disclosure */}
        <div style={{
          marginTop: 40, padding: 18, borderRadius: 'var(--radius-lg)',
          background: 'rgba(238,106,19,0.04)',
          border: '1px solid rgba(238,106,19,0.15)',
          fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)',
        }}>
          <div className="eyebrow" style={{ color: 'var(--orange)', marginBottom: 8 }}>⚠  Risk disclosure</div>
          Sigmentum provides analytical signals for educational purposes only. All trading involves
          substantial risk of loss and is not suitable for every investor. Past performance is not
          indicative of future results. You are solely responsible for any trades executed based on
          information generated by this system.
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)',
          fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.03em', flexWrap: 'wrap', gap: 12,
        }}>
          <span>© {year} SIGMENTUM INTELLIGENCE LTD · ALL RIGHTS RESERVED</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>TERMS</a>
            <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>PRIVACY</a>
            <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>COOKIES</a>
            <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>DISCLOSURES</a>
          </div>
          <span>v2.4.18 · cycle 18,422 · <span style={{ color: 'var(--green)' }}>healthy</span></span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { RiskDashboard, Pipeline, Performance, Telegram, Learn, Footer });
