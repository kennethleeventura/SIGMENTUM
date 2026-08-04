import { useEffect, useRef, useState } from 'react';
import { ASSETS, HERO_SIGNAL, CANDLES, buildSpark } from './data';
import { LogoMark, Wordmark, Sparkline, ConfidenceRing, BiasBadge, CountUp, Waveform, Reveal, useParallax, useMobile } from './primitives';
import { useAccount } from './sections-e';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();
  const { account, openAuth, openAccount } = useAccount();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: '#signals',  label: 'Signals'   },
    { href: '#trade',    label: 'Trade'     },
    { href: '#sandbox',  label: 'Sandbox'   },
    { href: '#pricing',  label: 'Pricing'   },
    { href: '#learn',    label: 'Learn'     },
  ];

  return (
    <div style={{
      position: 'fixed', top: 16, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
      pointerEvents: 'none', padding: '0 16px',
    }}>
      <nav className="glass glass-strong" style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center',
        gap: isMobile ? 0 : 28,
        justifyContent: 'space-between',
        padding: isMobile ? '10px 14px 10px 16px' : '14px 18px 14px 22px',
        borderRadius: 999,
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? 500 : 'none',
        transition: 'all 300ms ease',
        boxShadow: scrolled ? 'var(--shadow-lg)' : 'var(--shadow-md)',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark size={isMobile ? 32 : 40}/>
          <Wordmark size={isMobile ? 22 : 26}/>
        </a>

        {!isMobile && <>
          <div style={{ width: 1, height: 24, background: 'var(--line-strong)' }}/>
          <div style={{ display: 'flex', gap: 4 }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} style={{
                padding: '8px 14px', borderRadius: 999,
                fontSize: 14, fontWeight: 500,
                color: 'var(--ink)', textDecoration: 'none',
                transition: 'all 150ms', opacity: 0.85,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--blue-glow)'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.85'; }}
              >{l.label}</a>
            ))}
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--line-strong)' }}/>
          {account ? (
            <button onClick={openAccount} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
              borderRadius: 999, border: '1px solid var(--glass-stroke)',
              background: 'var(--inner-card)', cursor: 'pointer', transition: 'all 150ms',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: account.plan === 'momentum' ? 'var(--green)' : account.plan === 'signal' ? 'var(--orange)' : 'var(--ink-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'white',
              }}>{account.email?.[0]?.toUpperCase()}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                {account.plan === 'free' ? 'Free' : account.plan === 'signal' ? 'Signal' : 'Momentum'}
              </span>
            </button>
          ) : (
            <button onClick={() => openAuth('signup')} className="btn btn-signal" style={{ padding: '9px 16px', fontSize: 14 }}>
              Start free →
            </button>
          )}
        </>}

        {isMobile && (
          <button onClick={() => setOpen(o => !o)} style={{
            width: 40, height: 40, borderRadius: 10,
            background: open ? 'var(--ink)' : 'var(--inner-card)',
            border: '1px solid var(--glass-stroke)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: open ? 'var(--paper)' : 'var(--ink)', flexShrink: 0,
            transition: 'all 200ms',
          }}>
            {open ? '✕' : '☰'}
          </button>
        )}
      </nav>

      {isMobile && open && (
        <div className="glass glass-strong" style={{
          pointerEvents: 'auto', marginTop: 8,
          width: '100%', maxWidth: 500,
          borderRadius: 20, padding: '12px 8px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {links.map((l) => (
            <a key={l.href} href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '12px 16px',
                borderRadius: 12, fontSize: 15, fontWeight: 500,
                color: 'var(--ink)', textDecoration: 'none', transition: 'all 150ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--inner-card)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >{l.label}</a>
          ))}
          <div style={{ padding: '8px 8px 0', borderTop: '1px solid var(--glass-stroke)', marginTop: 8 }}>
            {account ? (
              <button onClick={() => { setOpen(false); openAccount(); }} style={{
                width: '100%', padding: '12px', borderRadius: 12,
                border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)',
                cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-sans)',
                display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)',
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: account.plan === 'momentum' ? 'var(--green)' : account.plan === 'signal' ? 'var(--orange)' : 'var(--ink-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                }}>{account.email?.[0]?.toUpperCase()}</span>
                <span style={{ fontWeight: 500 }}>{account.email}</span>
              </button>
            ) : (
              <button onClick={() => { setOpen(false); openAuth('signup'); }}
                className="btn btn-signal" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                Start free →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Ticker() {
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

function buildTfCandles(tfKey) {
  const cfgs = {
    '1M':  { count: 60, vol: 0.30, trend: 0.006, seed: 1001 },
    '5M':  { count: 48, vol: 0.85, trend: 0.020, seed: 2002 },
    '15M': { count: 32, vol: 1.70, trend: 0.048, seed: 3003 },
    '1H':  { count: 24, vol: 3.20, trend: 0.105, seed: 4004 },
    '4H':  { count: 20, vol: 5.50, trend: 0.240, seed: 5005 },
    '1D':  { count: 30, vol: 9.00, trend: 0.520, seed: 6006 },
  };
  const cfg = cfgs[tfKey] || cfgs['4H'];
  let s = cfg.seed;
  const r = () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
  const tfMins = { '1M': 1, '5M': 5, '15M': 15, '1H': 60, '4H': 240, '1D': 1440 };
  const mins = tfMins[tfKey] || 240;
  const base = new Date('2024-04-15T09:42:00');
  let price = 2341.20 - cfg.vol * cfg.count * 0.28;
  const out = [];
  for (let i = 0; i < cfg.count; i++) {
    const t = new Date(base - (cfg.count - 1 - i) * mins * 60000);
    const label = tfKey === '1D'
      ? t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    const bull = r() > 0.43;
    const mag = r() * cfg.vol;
    const open = price;
    price += (bull ? 1 : -1) * mag * 0.72 + cfg.trend;
    const close = price;
    const wick = mag * (0.18 + r() * 0.32);
    out.push({
      o: +open.toFixed(2), c: +close.toFixed(2),
      h: +(Math.max(open, close) + wick).toFixed(2),
      l: +(Math.min(open, close) - wick * 0.65).toFixed(2),
      vol: Math.round(1400 + r() * 7600), t: label,
    });
  }
  return out;
}

const TF_LIST = ['1M', '5M', '15M', '1H', '4H', '1D'];

export function CandleChart({ candles: defaultCandles, width = 520, height = 220 }) {
  const [tf, setTf] = useState('4H');
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  const candles = tf === '4H' && defaultCandles
    ? defaultCandles.map((c, i) => ({
        ...c,
        t: `${String(6 + Math.floor(i / 3)).padStart(2, '0')}:${['00','20','40'][i % 3]}`,
        vol: 2400 + i * 180,
      }))
    : buildTfCandles(tf);

  const padR = 46, padT = 12, padB = 14;
  const chartW = width - padR;
  const chartH = height - padT - padB;
  const minV = Math.min(...candles.map(c => c.l));
  const maxV = Math.max(...candles.map(c => c.h));
  const range = maxV - minV || 1;
  const cw = chartW / candles.length;
  const yp = (v) => padT + (1 - (v - minV) / range) * chartH;

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const vbX = ((e.clientX - rect.left) / rect.width) * width;
    const idx = Math.max(0, Math.min(candles.length - 1, Math.floor(vbX / cw)));
    setHover({ idx, cx: idx * cw + cw / 2, candle: candles[idx] });
  };

  const hc = hover?.candle;
  const hx = hover?.cx ?? 0;
  const hy = hc ? yp(hc.c) : 0;
  const tooltipPct = hover ? Math.min(hx / width * 100, 56) : 0;

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      {/* Timeframe tabs */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 8, alignItems: 'center' }}>
        {TF_LIST.map(t => (
          <button key={t} onClick={() => { setTf(t); setHover(null); }} style={{
            padding: '3px 9px', borderRadius: 6, fontSize: 11,
            fontFamily: 'var(--font-mono)', cursor: 'pointer', lineHeight: 1.4,
            border: '1px solid ' + (tf === t ? 'var(--orange)' : 'var(--line-strong)'),
            background: tf === t ? 'var(--orange-glow)' : 'transparent',
            color: tf === t ? 'var(--orange)' : 'var(--ink-4)',
            transition: 'all 100ms',
          }}>{t}</button>
        ))}
        {hc && (
          <span className="mono" style={{
            marginLeft: 'auto', fontSize: 11,
            color: hc.c >= hc.o ? 'var(--green)' : 'var(--orange)',
          }}>
            {hc.c >= hc.o ? '▲' : '▼'} {hc.c.toFixed(2)}
          </span>
        )}
      </div>

      {/* OHLCV tooltip */}
      {hc && (
        <div style={{
          position: 'absolute', top: 38,
          left: tooltipPct + '%', transform: 'translateX(-50%)',
          zIndex: 20, pointerEvents: 'none',
          background: '#0b0d12', color: '#f5f5f2',
          padding: '8px 12px', borderRadius: 10,
          fontSize: 11, fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(11,13,18,0.4)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, marginBottom: 5 }}>
            {hc.t} · {tf}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16, rowGap: 3 }}>
            {[
              ['O', hc.o, 'rgba(255,255,255,0.65)'],
              ['H', hc.h, '#0fb864'],
              ['L', hc.l, '#ee6a13'],
              ['C', hc.c, hc.c >= hc.o ? '#0fb864' : '#ee6a13'],
            ].map(([lbl, val, col]) => (
              <div key={lbl} style={{ display: 'flex', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.32)' }}>{lbl}</span>
                <span style={{ color: col, fontWeight: 600 }}>{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
          {hc.vol && (
            <div style={{ marginTop: 5, paddingTop: 5, borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
              Vol {hc.vol.toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* SVG */}
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`ca-${tf}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--green)" stopOpacity="0.16"/>
            <stop offset="1" stopColor="var(--green)" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line key={i} x1={0} x2={chartW} y1={padT + p * chartH} y2={padT + p * chartH}
            stroke="rgba(11,13,18,0.05)" strokeDasharray="2 4"/>
        ))}

        {/* Y-axis labels */}
        {[0, 0.33, 0.66, 1].map((p, i) => (
          <text key={i} x={chartW + 5} y={padT + p * chartH + 3}
            fontSize={8} fill="rgba(11,13,18,0.32)" fontFamily="monospace">
            {(maxV - p * range).toFixed(0)}
          </text>
        ))}

        {/* Area + line */}
        {(() => {
          const pts = candles.map((c, i) => [i * cw + cw / 2, yp(c.c)]);
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
          const area = `${d} L ${pts[pts.length - 1][0]} ${height} L ${pts[0][0]} ${height} Z`;
          return (
            <g>
              <path d={area} fill={`url(#ca-${tf})`}/>
              <path d={d} stroke="var(--green)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
            </g>
          );
        })()}

        {/* Candles */}
        {candles.map((c, i) => {
          const x = i * cw + cw / 2;
          const up = c.c >= c.o;
          const col = up ? 'var(--green)' : 'var(--orange)';
          return (
            <g key={i} opacity={hover && hover.idx !== i ? 0.32 : 0.88}>
              <line x1={x} x2={x} y1={yp(c.h)} y2={yp(c.l)} stroke={col} strokeWidth={1}/>
              <rect
                x={x - Math.max(cw * 0.28, 1.5)} y={yp(Math.max(c.o, c.c))}
                width={Math.max(cw * 0.56, 2)}
                height={Math.max(1, Math.abs(yp(c.c) - yp(c.o)))}
                fill={col}
              />
            </g>
          );
        })}

        {/* Crosshair */}
        {hover && (
          <g>
            <line x1={hx} x2={hx} y1={padT} y2={height - padB}
              stroke="rgba(11,13,18,0.22)" strokeWidth={0.8} strokeDasharray="3 3"/>
            <line x1={0} x2={chartW} y1={hy} y2={hy}
              stroke="rgba(11,13,18,0.22)" strokeWidth={0.8} strokeDasharray="3 3"/>
            <rect x={chartW + 2} y={hy - 8} width={padR - 4} height={16} rx={3}
              fill={hc.c >= hc.o ? 'var(--green)' : 'var(--orange)'}/>
            <text x={chartW + padR / 2 + 1} y={hy + 3.5} textAnchor="middle"
              fontSize={8} fill="white" fontFamily="monospace" fontWeight="600">
              {hc.c.toFixed(1)}
            </text>
          </g>
        )}

        {/* TP/SL levels */}
        {[
          { v: 2358,   label: 'TP1', col: 'var(--green)'  },
          { v: 2372.4, label: 'TP2', col: 'var(--green)'  },
          { v: 2329.8, label: 'SL',  col: 'var(--orange)' },
        ].map((L) => {
          const yy = yp(L.v);
          if (yy < padT - 2 || yy > height - padB + 2) return null;
          return (
            <g key={L.label} opacity={0.75}>
              <line x1={0} x2={chartW} y1={yy} y2={yy}
                stroke={L.col} strokeWidth={0.8} strokeDasharray="4 3"/>
              <rect x={chartW + 2} y={yy - 8} width={padR - 4} height={16} rx={3}
                fill="white" stroke={L.col} opacity={0.96}/>
              <text x={chartW + padR / 2 + 1} y={yy + 3} textAnchor="middle"
                fontSize={8} fill={L.col} fontFamily="monospace" fontWeight="600">
                {L.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Hero() {
  const parallaxOrb1 = useParallax(0.4);
  const parallaxOrb2 = useParallax(0.25);
  const isMobile = useMobile();

  return (
    <section id="top" style={{ paddingTop: isMobile ? 120 : 180, paddingBottom: 60, position: 'relative' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>

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
                fontSize: 'clamp(44px, 5.6vw, 86px)',
                fontWeight: 700,
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
                paddingTop: 24, borderTop: '1px solid var(--line)',
                maxWidth: isMobile ? '100%' : 520,
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

      <div style={{
        borderRadius: 'var(--radius)',
        background: 'var(--inner-card)',
        border: '1px solid var(--glass-stroke)',
        padding: '10px 6px', marginBottom: 20,
      }}>
        <CandleChart candles={CANDLES} width={520} height={180}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
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
