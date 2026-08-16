import { useState, useMemo } from 'react';
import { PIPELINE, PERF_STATS, BLOG_POSTS, GLOSSARY } from './data';
import { BiasBadge, ConfidenceBar, Reveal, CountUp, Sparkline, Waveform, LogoMark, Wordmark, useMobile } from './primitives';
import { LiveTelegram } from './live';

export function RiskDashboard() {
  const isMobile = useMobile();
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 20 }}>
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
                { when: '36h', event: 'US CPI release',     level: 'High' },
                { when: '5d',  event: 'FOMC minutes',       level: 'High' },
                { when: '8d',  event: 'NFP',                level: 'Moderate' },
                { when: '12d', event: 'ECB rate decision',  level: 'Moderate' },
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

export function Pipeline() {
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="chip">
                <span className="chip-dot live"></span>
                <span>RUN · LIVE</span>
              </span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>cycle #18,422 · 2.67s end-to-end</span>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>next run in 08:42</span>
          </div>

          <div style={{ overflowX: 'auto', margin: '0 -4px', padding: '0 4px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PIPELINE.length}, 1fr)`,
            gap: 0,
            position: 'relative',
            minWidth: 560,
          }}>
            {PIPELINE.map((p, i) => (
              <PipelineNode key={p.id} node={p} index={i} isLast={i === PIPELINE.length - 1}/>
            ))}
          </div>
          </div>

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

export function Performance() {
  const isMobile = useMobile();
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
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

      <Reveal delay={300}>
        <div className="glass" style={{ padding: 24, borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 20, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Equity curve · 90d</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: isMobile ? 26 : 32, fontWeight: 500, letterSpacing: '-0.02em' }}>
                  +<CountUp value={24.8} decimals={1}/>%
                </span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--green)' }}>▲ vs benchmark +18.2%</span>
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
  const [pts, spark] = useMemo(() => {
    const p = [];
    let v = 100;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - 0.3) * 1.4 + 0.3;
      p.push(v);
    }
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
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="0" x2={width} y1={p*height} y2={p*height} stroke="rgba(11,13,18,0.05)" strokeDasharray="2 4"/>
      ))}
      <path d={line(spark)} stroke="var(--ink-5)" strokeWidth="1.4" fill="none" strokeDasharray="3 3"/>
      <path d={area(pts)} fill="url(#eq-area)"/>
      <path d={line(pts)} stroke="var(--green)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <circle cx={x(pts.length - 1, pts)} cy={y(pts[pts.length - 1])} r="5" fill="var(--green)"/>
      <circle cx={x(pts.length - 1, pts)} cy={y(pts[pts.length - 1])} r="10" fill="var(--green)" opacity="0.2"/>
    </svg>
  );
}

export function Telegram() {
  const isMobile = useMobile();
  return (
    <section className="container">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
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

const CATS = ['All', 'Market Structure', 'Risk', 'Systems', 'Education', 'Psychology'];

export function Learn() {
  const [activePost, setActivePost] = useState(null);
  const [cat, setCat] = useState('All');
  const isMobile = useMobile();
  const filtered = cat === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.cat === cat);

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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 24, marginBottom: 48 }}>
        <Reveal>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="eyebrow">Automated journal</div>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{filtered.length} ARTICLES</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                  border: cat === c ? '1px solid var(--orange)' : '1px solid var(--glass-stroke)',
                  background: cat === c ? 'var(--orange)' : 'transparent',
                  color: cat === c ? 'white' : 'var(--ink-2)',
                  cursor: 'pointer', transition: 'all 160ms',
                  fontFamily: 'var(--font-sans)',
                }}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {filtered.map((p, i) => (
                <Reveal key={p.title} delay={i * 50}>
                  <button onClick={() => setActivePost(p)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <div className="glass lift" style={{ padding: 18, borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 11 }}>
                        <span className="chip"><span style={{ color: 'var(--orange)' }}>{p.cat}</span></span>
                        <span className="mono" style={{ color: 'var(--ink-3)' }}>{p.read}</span>
                        <span className="chip" style={{ fontSize: 9 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}/>
                          <span>AUTO-GENERATED</span>
                        </span>
                        <span className="mono" style={{ color: 'var(--ink-3)', marginLeft: 'auto' }}>{p.date}</span>
                      </div>
                      <div className="serif" style={{ fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 8 }}>
                        {p.title}
                      </div>
                      {p.hook && (
                        <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink-2)', margin: '0 0 8px', paddingLeft: 12, borderLeft: '2px solid var(--orange)', fontFamily: 'var(--font-serif)' }}>
                          "{p.hook}"
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.55 }}>{p.excerpt}</div>
                      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--orange)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                        READ FULL ARTICLE →
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

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
              {GLOSSARY.map((g, i) => <GlossaryItem key={i} entry={g} delay={i * 40}/>)}
            </div>
          </div>
        </Reveal>
      </div>

      {activePost && <ArticleModal post={activePost} onClose={() => setActivePost(null)}/>}
    </section>
  );
}

function ArticleModal({ post, onClose }) {
  const accent = 'var(--orange)';
  const paragraphs = post.body.split('\n\n').filter(Boolean);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(5,7,12,0.82)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '60px 20px 40px', overflowY: 'auto',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 760, borderRadius: 'var(--radius-xl)',
        padding: 'clamp(20px, 5vw, 48px) clamp(18px, 5vw, 48px)', position: 'relative',
        border: '1px solid var(--glass-stroke)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'var(--ink-2)',
        }}>×</button>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
          <span className="chip"><span style={{ color: accent }}>{post.cat}</span></span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{post.read}</span>
          <span className="chip" style={{ fontSize: 9 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}/>
            <span>AUTO-GENERATED</span>
          </span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 'auto' }}>{post.date}</span>
        </div>

        <h2 className="serif" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.015em', margin: '0 0 16px' }}>
          {post.title}
        </h2>

        {post.hook && (
          <div style={{
            fontSize: 15, fontStyle: 'italic', color: 'var(--ink-2)',
            padding: '14px 18px', borderLeft: `3px solid ${accent}`,
            background: `${accent}0d`, borderRadius: '0 8px 8px 0',
            fontFamily: 'var(--font-serif)', lineHeight: 1.5, marginBottom: 28,
          }}>
            "{post.hook}"
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <h3 key={i} style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>{para.replace(/\*\*/g, '')}</h3>;
            }
            const parts = para.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)', margin: 0 }}>
                {parts.map((part, j) =>
                  part.startsWith('**') ? <strong key={j} style={{ color: 'var(--ink)', fontWeight: 600 }}>{part.replace(/\*\*/g, '')}</strong> : part
                )}
              </p>
            );
          })}
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--glass-stroke)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoMark size={22}/>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Generated by SIGMENTUM AI · {post.date}</span>
          <div style={{ flex: 1 }}/>
          <button onClick={onClose} className="btn btn-signal" style={{ padding: '8px 20px', fontSize: 13 }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function GlossaryItem({ entry, delay }) {
  const [open, setOpen] = useState(false);
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

const SOCIAL_LINKS = [
  {
    label: 'X / Twitter',
    href: import.meta.env.VITE_SOCIAL_X || '',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.633L18.245 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Telegram',
    href: import.meta.env.VITE_SOCIAL_TELEGRAM || '',
    path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  },
  {
    label: 'Reddit',
    href: import.meta.env.VITE_SOCIAL_REDDIT || '',
    path: 'M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z',
  },
  {
    label: 'Discord',
    href: import.meta.env.VITE_SOCIAL_DISCORD || '',
    path: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.1.13 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
];

function SocialBar() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {SOCIAL_LINKS.map(s => (
        <a
          key={s.label}
          href={s.href || '#'}
          aria-label={s.label}
          {...(!s.href ? { 'aria-disabled': 'true' } : { target: '_blank', rel: 'noopener noreferrer' })}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8,
            color: 'var(--ink-4)', border: '1px solid var(--line)',
            textDecoration: 'none', transition: 'color 180ms, border-color 180ms',
            ...(s.href ? {} : { pointerEvents: 'none', opacity: 0.35 }),
          }}
          onMouseEnter={s.href ? e => {
            e.currentTarget.style.color = 'var(--orange)';
            e.currentTarget.style.borderColor = 'var(--orange)';
          } : undefined}
          onMouseLeave={s.href ? e => {
            e.currentTarget.style.color = 'var(--ink-4)';
            e.currentTarget.style.borderColor = 'var(--line)';
          } : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={s.path}/>
          </svg>
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ padding: '100px 0 60px', borderTop: '1px solid var(--line)', marginTop: 40, position: 'relative', overflow: 'hidden' }}>
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
          <SocialBar />
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
