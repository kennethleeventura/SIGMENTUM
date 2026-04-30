// Primitives — reusable small components
const { useEffect, useRef, useState, useMemo, useLayoutEffect } = React;

// useReveal — IntersectionObserver-backed reveal
function useReveal(opts = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible');
          if (opts.once !== false) io.unobserve(el);
        }
      });
    }, { threshold: opts.threshold ?? 0.12, rootMargin: opts.rootMargin ?? '0px 0px -5% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ as = 'div', delay = 0, children, className = '', style = {}, ...rest }) {
  const ref = useReveal();
  const Comp = as;
  return (
    <Comp
      ref={ref}
      data-reveal=""
      className={className}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// Logo mark — SVG replica of the Sigmentum glyph
function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <rect x="6" y="6" width="88" height="88" rx="14" fill="#0b5dee"/>
      <rect x="6" y="30" width="64" height="64" rx="10" fill="#0fb864"/>
      <circle cx="28" cy="72" r="14" fill="#ee6a13"/>
    </svg>
  );
}

function Wordmark({ size = 22, color = 'var(--ink)' }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: size,
      letterSpacing: '-0.02em',
      color,
      lineHeight: 1,
    }}>
      sigmentum
    </span>
  );
}

// Sparkline
function Sparkline({ data, color = 'var(--ink-2)', width = 120, height = 36, fill = true }) {
  const { path, area, last } = useMemo(() => {
    if (!data || data.length === 0) return { path: '', area: '', last: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
    const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
    const area = `${path} L ${width} ${height} L 0 ${height} Z`;
    return { path, area, last: pts[pts.length - 1] };
  }, [data, width, height]);

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {fill && (
        <path d={area} fill={color} opacity="0.08"/>
      )}
      <path d={path} className="spark-line" stroke={color}/>
      {last && (
        <circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/>
      )}
    </svg>
  );
}

// Confidence ring (circular meter)
function ConfidenceRing({ value, size = 120, stroke = 8, label = 'CONFIDENCE', color = 'var(--orange)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = performance.now();
        const dur = 1400;
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setAnimated(value * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  const offset = c - (animated / 100) * c;
  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`ring-${label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={color}/>
            <stop offset="1" stopColor="var(--green)"/>
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(11,13,18,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={`url(#ring-${label})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <div className="mono" style={{ fontSize: size * 0.28, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {Math.round(animated)}
        </div>
        <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
      </div>
    </div>
  );
}

// Horizontal confidence bar
function ConfidenceBar({ value, color = 'var(--orange)', height = 6, showValue = true }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setW(value); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        flex: 1, height, borderRadius: 999, background: 'rgba(11,13,18,0.08)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          width: `${w}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}, var(--green))`,
          transition: 'width 1400ms cubic-bezier(.2,.7,.2,1)',
          borderRadius: 999,
        }}/>
      </div>
      {showValue && <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', minWidth: 28, textAlign: 'right' }}>{value}</span>}
    </div>
  );
}

// Typewriter — streams text char by char once visible
function Typewriter({ text, speed = 18, startDelay = 0, onDone, className = '', style = {} }) {
  const [out, setOut] = useState('');
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        setTimeout(() => {
          let i = 0;
          const tick = () => {
            i++;
            setOut(text.slice(0, i));
            if (i < text.length) setTimeout(tick, speed);
            else if (onDone) onDone();
          };
          tick();
        }, startDelay);
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed, startDelay]);

  return <span ref={ref} className={className} style={style}>{out}<span className="tw-caret" style={{ opacity: out.length < text.length ? 1 : 0, color: 'var(--orange)' }}>▍</span></span>;
}

// Animated counter
function CountUp({ value, duration = 1400, decimals = 0, prefix = '', suffix = '', className = '', style = {} }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
        let start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(num * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  const display = typeof value === 'string' && value.includes(',')
    ? Math.round(v).toLocaleString()
    : v.toFixed(decimals);
  return <span ref={ref} className={className} style={style}>{prefix}{display}{suffix}</span>;
}

// Bias badge
function BiasBadge({ bias, confidence }) {
  const map = {
    Long:    { color: 'var(--green)',  bg: 'rgba(15,184,100,0.1)',  glyph: '▲' },
    Short:   { color: 'var(--orange)', bg: 'rgba(238,106,19,0.1)',  glyph: '▼' },
    Neutral: { color: 'var(--ink-3)',  bg: 'rgba(11,13,18,0.06)',   glyph: '◆' },
  };
  const m = map[bias] || map.Neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
      letterSpacing: '0.05em',
      color: m.color, background: m.bg,
      border: `1px solid ${m.color}22`,
    }}>
      <span style={{ fontSize: 9 }}>{m.glyph}</span>
      {bias.toUpperCase()}
      {confidence != null && <span style={{ opacity: 0.7 }}>· {confidence}</span>}
    </span>
  );
}

// Scroll progress bar
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 2, zIndex: 100,
      background: 'transparent', pointerEvents: 'none',
    }}>
      <div style={{
        width: `${p * 100}%`, height: '100%',
        background: `linear-gradient(90deg, var(--orange), var(--green))`,
        transition: 'width 80ms linear',
      }}/>
    </div>
  );
}

// Parallax container — moves children on scroll
function useParallax(strength = 0.1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (rect.top - vh) / (vh + rect.height);
        const y = progress * strength * 120;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [strength]);
  return ref;
}

// Waveform bars
function Waveform({ bars = 32, color = 'var(--orange)', height = 28 }) {
  const [heights, setHeights] = useState(() => Array(bars).fill(0).map(() => 0.3 + Math.random() * 0.7));
  useEffect(() => {
    const id = setInterval(() => {
      setHeights((prev) => prev.map(() => 0.25 + Math.random() * 0.75));
    }, 180);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 2, height: `${h * 100}%`,
          background: color, borderRadius: 2,
          transition: 'height 220ms cubic-bezier(.2,.7,.2,1)',
          opacity: 0.4 + h * 0.6,
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, {
  useReveal, Reveal, LogoMark, Wordmark,
  Sparkline, ConfidenceRing, ConfidenceBar,
  Typewriter, CountUp, BiasBadge,
  ScrollProgress, useParallax, Waveform,
});
