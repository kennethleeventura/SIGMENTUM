// Sections A — Nav, Ticker, Hero with live signal card
const { useEffect: useEffA, useRef: useRefA, useState: useStateA, useMemo: useMemoA } = React;

function Nav() {
  const [scrolled, setScrolled] = useStateA(false);
  useEffA(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: '#signals', label: 'Signals' },
    { href: '#trade', label: 'Trade' },
    { href: '#reasoning', label: 'AI Reasoning' },
    { href: '#risk', label: 'Risk' },
    { href: '#pipeline', label: 'Pipeline' },
    { href: '#learn', label: 'Learn' },
  ];

  return (
    <div style={{
      position: 'fixed', top: 16, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <nav className="glass glass-strong" style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: 28,
        padding: '14px 18px 14px 22px',
        borderRadius: 999,
        transition: 'all 300ms ease',
        boxShadow: scrolled ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <LogoMark size={40}/>
          <Wordmark size={26}/>
        </a>
        <div style={{ width: 1, height: 24, background: 'var(--line-strong)' }}/>
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{
              padding: '8px 14px', borderRadius: 999,
              fontSize: 14, fontWeight: 500,
              color: 'var(--ink)', textDecoration: 'none',
              transition: 'all 150ms',
              opacity: 0.85,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--blue-glow)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.85'; }}
            >{l.label}</a>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--line-strong)' }}/>
        <a className="btn btn-primary" href="#" style={{ padding: '9px 16px', fontSize: 14 }}>
          Open terminal →
        </a>
      </nav>
    </div>
  );
}

function Ticker() {
  const row = [...ASSETS, ...ASSETS];
  return (
    <div style={{
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      padding: '14px 0',
      background: 'var(--inner-card)',
      backdropFilter: 'blur(8px)',
      overflow: 'hidden',
      mask: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      WebkitMask: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
    }}>
      <div className="ticker-track">
        {row.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{a.class}</span>
            <span className="mono" style={{ fontWeight: 600 }}>{a.sym}</span>
            <span className="mono" style={{ color: 'var(--ink-2)' }}>{a.price.toLocaleString()}</span>
            <span className="mono" style={{
              color: a.pct >= 0 ? 'var(--green)' : 'var(--orange)',
              fontWeight: 500,
            }}>
              {a.pct >= 0 ? '▲' : '▼'} {Math.abs(a.pct).toFixed(2)}%
            </span>
            <Sparkline
              data={buildSpark(14, a.pct >= 0 ? 1 : -1)}
              color={a.pct >= 0 ? 'var(--green)' : 'var(--orange)'}
              width={56} height={18} fill={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Candlestick chart
function CandleChart({ candles, width = 520, height = 220 }) {
  const padL = 0, padR = 0, padT = 12, padB = 12;
  const min = Math.min(...candles.map(c => c.l));
  const max = Math.max(...candles.map(c => c.h));
  const range = max - min || 1;
  const w = (width - padL - padR) / candles.length;
  const y = (v) => padT + (1 - (v - min) / range) * (height - padT - padB);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--green)" stopOpacity="0.18"/>
          <stop offset="1" stopColor="var(--green)" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Subtle grid */}
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1={0} x2={width} y1={padT + p * (height - padT - padB)} y2={padT + p * (height - padT - padB)}
          stroke="rgba(11,13,18,0.05)" strokeDasharray="2 4"/>
      ))}

      {/* Filled line area overlay */}
      {(() => {
        const pts = candles.map((c, i) => [padL + i * w + w/2, y(c.c)]);
        const line = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
        const area = `${line} L ${pts[pts.length-1][0]} ${height} L ${pts[0][0]} ${height} Z`;
        return (
          <g>
            <path d={area} fill="url(#chart-area)"/>
            <path d={line} stroke="var(--green)" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
          </g>
        );
      })()}

      {/* Candles */}
      {candles.map((c, i) => {
        const x = padL + i * w + w/2;
        const up = c.c >= c.o;
        const col = up ? 'var(--green)' : 'var(--orange)';
        return (
          <g key={i} opacity="0.85">
            <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1"/>
            <rect x={x - w*0.3} y={y(Math.max(c.o, c.c))}
              width={w*0.6} height={Math.max(1, Math.abs(y(c.c) - y(c.o)))}
              fill={col}/>
          </g>
        );
      })}

      {/* Entry / TP / SL lines */}
      {(() => {
        const last = candles[candles.length-1].c;
        const lines = [
          { v: last + 0.5, label: 'NOW',   col: 'var(--ink-2)', dash: '' },
          { v: 2358,        label: 'TP1',   col: 'var(--green)', dash: '4 3' },
          { v: 2372.4,      label: 'TP2',   col: 'var(--green)', dash: '4 3' },
          { v: 2329.8,      label: 'SL',    col: 'var(--orange)', dash: '4 3' },
        ];
        return lines.map((L, i) => {
          const yy = y(L.v);
          if (yy < 0 || yy > height) return null;
          return (
            <g key={i}>
              <line x1={0} x2={width} y1={yy} y2={yy} stroke={L.col} strokeWidth="0.9" strokeDasharray={L.dash} opacity="0.7"/>
              <rect x={width - 44} y={yy - 8} width={40} height={16} rx={3} fill="white" stroke={L.col} opacity="0.95"/>
              <text x={width - 24} y={yy + 3} fill={L.col} fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">{L.label}</text>
            </g>
          );
        });
      })()}
    </svg>
  );
}

function Hero() {
  const parallaxOrb1 = useParallax(0.4);
  const parallaxOrb2 = useParallax(0.25);

  return (
    <section id="top" style={{ paddingTop: 180, paddingBottom: 60, position: 'relative' }}>
      {/* Ambient orbs */}
      <div ref={parallaxOrb1} style={{
        position: 'absolute', top: 60, left: '8%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(238,106,19,0.22), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
      }}/>
      <div ref={parallaxOrb2} style={{
        position: 'absolute', top: 180, right: '6%',
        width: 340, height: 340, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,184,100,0.18), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
      }}/>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 48, alignItems: 'center' }}>

          {/* Left — headline */}
          <div>
            <Reveal delay={0}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                <span className="chip">
                  <span className="chip-dot live"></span>
                  <span>AI MARKETS ONLINE</span>
                </span>
                <span className="chip">
                  <span className="mono" style={{ color: 'var(--ink-3)' }}>v2.4 · GPT-4o</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(42px, 5.4vw, 82px)',
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                margin: '0 0 24px',
                color: 'var(--ink)',
                textWrap: 'balance',
              }}>
                Where <span style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 500 }}>signals</span> meet <span style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 500 }}>momentum</span>.
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p style={{
                fontSize: 19, lineHeight: 1.45, color: 'var(--ink-3)',
                maxWidth: 520, margin: '0 0 32px', textWrap: 'pretty',
              }}>
                Institutional-grade trading intelligence, automated end-to-end.
                Every 15 minutes, Sigmentum ingests market structure, runs it through
                a reasoning model, and delivers a ranked signal to your feed.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
                <a className="btn btn-signal" href="#signals">
                  Today's signals <span style={{ fontSize: 16 }}>→</span>
                </a>
                <a className="btn btn-momentum-outline" href="#reasoning">See how it thinks</a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                paddingTop: 24, borderTop: '1px solid var(--line)', maxWidth: 520,
              }}>
                {[
                  { k: 'Win rate', v: '68.4%' },
                  { k: 'Signals / day', v: '32' },
                  { k: 'Avg R:R', v: '1.94' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="eyebrow" style={{ fontSize: 10 }}>{s.k}</div>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — live signal card */}
          <Reveal delay={300}>
            <LiveSignalCard/>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LiveSignalCard() {
  const s = HERO_SIGNAL;
  return (
    <div className="glass lift" style={{
      padding: 24, position: 'relative', overflow: 'hidden',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(238,106,19,0.08)',
    }}>
      {/* Glow corner */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--orange-glow), transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }}/>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="chip">
            <span className="chip-dot live"></span>
            <span>LIVE · {s.timeframe}</span>
          </span>
          <span className="chip">
            <span className="chip-dot signals"></span>
            <span>SIGNAL</span>
          </span>
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.generated}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 16, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{s.pair} · GOLD SPOT</div>
          <div className="mono" style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <CountUp value={s.entry} decimals={2}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <BiasBadge bias={s.bias} confidence={s.confidence}/>
            <span className="mono" style={{ fontSize: 12, color: 'var(--green)' }}>▲ +1.24%</span>
          </div>
        </div>
        <ConfidenceRing value={s.confidence} size={96} stroke={7}/>
      </div>

      {/* Mini chart */}
      <div style={{
        borderRadius: 'var(--radius)',
        background: 'var(--inner-card)',
        border: '1px solid var(--glass-stroke)',
        padding: '10px 6px', marginBottom: 20,
      }}>
        <CandleChart candles={CANDLES} width={520} height={180}/>
      </div>

      {/* Levels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { k: 'Entry', v: s.entry, col: 'var(--ink-2)' },
          { k: 'TP1',   v: s.tp1,   col: 'var(--green)' },
          { k: 'TP2',   v: s.tp2,   col: 'var(--green)' },
          { k: 'SL',    v: s.sl,    col: 'var(--orange)' },
        ].map((L, i) => (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: 10,
            background: 'var(--inner-card)',
            border: '1px solid var(--glass-stroke)',
          }}>
            <div className="eyebrow" style={{ fontSize: 9 }}>{L.k}</div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 500, color: L.col, marginTop: 2 }}>
              {L.v.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Headline + reasoning preview */}
      <div style={{
        padding: '14px 16px', borderRadius: 'var(--radius)',
        background: 'linear-gradient(135deg, rgba(238,106,19,0.06), rgba(15,184,100,0.04))',
        border: '1px solid var(--glass-stroke)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Waveform bars={16} height={14}/>
          <span className="eyebrow" style={{ fontSize: 9 }}>AI HEADLINE</span>
        </div>
        <div className="serif" style={{ fontSize: 17, lineHeight: 1.35, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
          {s.headline}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Ticker, Hero });
