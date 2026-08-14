import { useEffect, useRef, useState } from 'react';
import { TG_LIVE_STREAM, POPUP_EVENTS } from './data';
import { LogoMark, Waveform } from './primitives';

function sgCookieGet(name) {
  const m = document.cookie.match(new RegExp('(?:^|;)\\s*' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
function sgCookieSet(name, val) {
  // Session cookie — no Max-Age so it expires when the tab closes
  document.cookie = name + '=' + val + '; path=/; SameSite=Lax';
}

export function PopupNotifier() {
  const [queue, setQueue]     = useState([]);
  const [docked, setDocked]   = useState(false);
  const [unread, setUnread]   = useState(0);
  const [isMobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const idxRef    = useRef(0);
  const uidRef    = useRef(0);
  const dockedRef = useRef(false);

  // Init: mobile detection + cookie-based dock state
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setMobile(mobile);
    const cookieVal   = sgCookieGet('sg_popup_docked');
    const startDocked = cookieVal !== null ? cookieVal === '1' : mobile;
    setDocked(startDocked);
    dockedRef.current = startDocked;
    setMounted(true);

    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keep ref in sync so interval callbacks read current docked value
  useEffect(() => { dockedRef.current = docked; }, [docked]);

  // Popup queue
  useEffect(() => {
    const fire = () => {
      const ev  = POPUP_EVENTS[idxRef.current % POPUP_EVENTS.length];
      const uid = ++uidRef.current;
      idxRef.current++;
      setQueue(q => [...q, { ...ev, uid }]);
      if (dockedRef.current) setUnread(u => u + 1);
      setTimeout(() => setQueue(q => q.filter(n => n.uid !== uid)), 7000);
    };
    const first = setTimeout(fire, 4500);
    const id    = setInterval(fire, 11000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  const toggle = () => {
    const next = !docked;
    dockedRef.current = next;
    setDocked(next);
    sgCookieSet('sg_popup_docked', next ? '1' : '0');
    if (!next) setUnread(0);
  };

  if (!mounted) return null;

  // ── Docked tab ────────────────────────────────────────────────────────────
  if (docked) {
    return (
      <button
        onClick={toggle}
        aria-label={`Signal notifications${unread ? `, ${unread} unread` : ''}. Click to expand.`}
        style={{
          position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 60, width: 36, height: 80,
          borderRadius: '8px 0 0 8px',
          background: 'rgba(15,15,17,0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-stroke)', borderRight: 'none',
          cursor: 'pointer', padding: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: 'var(--shadow-lg)',
          transition: 'box-shadow 200ms',
        }}
      >
        {unread > 0 && (
          <span style={{
            background: 'var(--orange)', color: '#fff',
            fontSize: 9, fontWeight: 700,
            minWidth: 16, height: 16, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        <span style={{
          fontSize: 8, color: 'var(--orange)', fontWeight: 700,
          letterSpacing: '0.1em', writingMode: 'vertical-rl',
          textTransform: 'uppercase',
        }}>SIGNALS</span>
        <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>◀</span>
      </button>
    );
  }

  // ── Mobile: bottom sheet ─────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 60, maxHeight: '52vh',
        background: 'rgba(13,13,15,0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--glass-stroke)',
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.35)',
      }}>
        {/* Sheet header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', flexShrink: 0,
          borderBottom: '1px solid var(--glass-stroke)',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'var(--orange)',
            letterSpacing: '0.12em', fontFamily: 'var(--font-mono)',
          }}>
            LIVE SIGNALS
          </span>
          <button
            onClick={toggle}
            aria-label="Dock signal notifications"
            style={{
              background: 'none', border: '1px solid var(--glass-stroke)',
              cursor: 'pointer', color: 'var(--ink-3)',
              fontSize: 11, padding: '3px 9px', borderRadius: 999,
            }}
          >
            Dock ▶
          </button>
        </div>
        {/* Card list */}
        <div style={{
          overflowY: 'auto', flex: 1,
          padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {queue.length === 0 ? (
            <div style={{
              color: 'var(--ink-3)', fontSize: 13, padding: '20px 0', textAlign: 'center',
            }}>
              Waiting for next signal…
            </div>
          ) : (
            queue.map(n => <PopupCard key={n.uid} n={n} compact />)
          )}
        </div>
      </div>
    );
  }

  // ── Desktop: floating stack ────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', top: 80, right: 12, zIndex: 60,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      maxWidth: 'calc(100vw - 24px)',
    }}>
      {/* Dock control */}
      <button
        onClick={toggle}
        aria-label="Dock signal notifications"
        style={{
          padding: '4px 10px 4px 8px', borderRadius: 999,
          background: 'rgba(15,15,17,0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-stroke)',
          color: 'var(--ink-3)', fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          pointerEvents: 'auto',
        }}
      >
        <span style={{ fontSize: 8 }}>▶</span> Dock
      </button>
      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
        {queue.map(n => <PopupCard key={n.uid} n={n} />)}
      </div>
    </div>
  );
}

function PopupCard({ n, compact }) {
  const [visible, setVisible] = useState(false);
  const reduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isBuy  = n.kind === 'buy';
  const isSell = n.kind === 'sell';
  const accent    = isBuy ? 'var(--green)' : isSell ? 'var(--orange)' : 'var(--blue)';
  const accentRaw = isBuy ? '#0fb864'      : isSell ? '#ee6a13'       : '#0b5dee';
  const label     = isBuy ? 'BUY SIGNAL'  : isSell ? 'SELL SIGNAL'   : 'POSITION UPDATE';
  const arrow     = isBuy ? '▲'           : isSell ? '▼'             : '◆';

  const entryMatch = n.body.match(/Entry\s+([\d,\.]+)/i);
  const tpMatch    = n.body.match(/TP1?\s+([\d,\.]+)/i);
  const slMatch    = n.body.match(/SL\s+([\d,\.]+)/i);

  const slideIn = reduced.current
    ? {}
    : {
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
        transition: 'opacity 400ms cubic-bezier(.2,.7,.2,1), transform 500ms cubic-bezier(.2,.7,.2,1)',
      };

  return (
    <div className="glass glass-strong" style={{
      pointerEvents: 'auto',
      width: compact ? '100%' : 'min(420px, calc(100vw - 24px))',
      padding: compact ? '10px 12px' : '14px 16px',
      borderRadius: 'var(--radius-xl)',
      borderLeft: `4px solid ${accent}`,
      boxShadow: `var(--shadow-lg), 0 0 0 1px ${accentRaw}28, 0 0 48px -12px ${accentRaw}55`,
      opacity: visible ? 1 : 0,
      ...slideIn,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow orb */}
      {!compact && (
        <div style={{
          position: 'absolute', top: -30, left: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${accentRaw}, transparent 70%)`,
          opacity: 0.18, filter: 'blur(24px)', pointerEvents: 'none',
        }}/>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: compact ? 6 : 12, position: 'relative' }}>
        <span style={{
          width: compact ? 32 : 44, height: compact ? 32 : 44,
          borderRadius: compact ? 8 : 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${accentRaw}, ${accentRaw}bb)`,
          boxShadow: `0 4px 14px ${accentRaw}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: compact ? 14 : 20, fontWeight: 700,
        }}>{arrow}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: accent, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.14em', marginBottom: 3 }}>
            {label}
          </div>
          <div className="mono" style={{ fontSize: compact ? 14 : 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            {n.asset}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>CONF</div>
          <div className="mono" style={{ fontSize: compact ? 20 : 28, fontWeight: 700, color: accent, lineHeight: 1 }}>
            {n.conf}%
          </div>
        </div>
      </div>

      {/* Trade levels (desktop/full only) */}
      {!compact && (isBuy || isSell) && (entryMatch || tpMatch || slMatch) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            entryMatch && { label: 'ENTRY', value: entryMatch[1], col: 'var(--ink-2)' },
            tpMatch    && { label: 'TP1',   value: tpMatch[1],    col: 'var(--green)' },
            slMatch    && { label: 'SL',    value: slMatch[1],    col: 'var(--orange)' },
          ].filter(Boolean).map(item => (
            <div key={item.label} style={{
              padding: '8px 10px', borderRadius: 10,
              background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
            }}>
              <div style={{ fontSize: 9, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{item.label}</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: item.col }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Body text */}
      <div style={{
        fontSize: compact ? 12 : 14, lineHeight: 1.55,
        color: 'var(--ink-2)', marginBottom: compact ? 0 : 14,
        display: compact ? '-webkit-box' : undefined,
        WebkitLineClamp: compact ? 2 : undefined,
        WebkitBoxOrient: compact ? 'vertical' : undefined,
        overflow: compact ? 'hidden' : undefined,
      }}>
        {n.body}
      </div>

      {/* Footer (desktop only) */}
      {!compact && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="chip" style={{ fontSize: 10, padding: '3px 9px' }}>
            <span>✉</span><span>EMAIL</span>
          </span>
          <span className="chip" style={{ fontSize: 10, padding: '3px 9px' }}>
            <span>◈</span><span>TELEGRAM</span>
          </span>
          <span className="chip" style={{ fontSize: 10, padding: '3px 9px' }}>
            <span className="chip-dot live" style={{ width: 5, height: 5 }}/>
            <span>SENT</span>
          </span>
          <div style={{ flex: 1 }}/>
          <LogoMark size={18}/>
        </div>
      )}
    </div>
  );
}

export function LiveTelegram() {
  const [messages, setMessages] = useState([]);
  const startedRef = useRef(false);
  const contRef    = useRef(null);

  useEffect(() => {
    const el = contRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !startedRef.current) {
        startedRef.current = true;
        playStream();
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playStream = () => {
    TG_LIVE_STREAM.forEach((msg) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
      }, msg.delay);
    });
    const total = TG_LIVE_STREAM[TG_LIVE_STREAM.length - 1].delay + 8000;
    setTimeout(() => {
      setMessages([]);
      startedRef.current = false;
      playStream();
      startedRef.current = true;
    }, total);
  };

  return (
    <div ref={contRef} className="glass" style={{
      padding: 22, borderRadius: 'var(--radius-xl)',
      display: 'flex', flexDirection: 'column',
      height: 560,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 14,
        borderBottom: '1px solid var(--glass-stroke)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--orange), var(--green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(238,106,19,0.3)',
          }}>
            <LogoMark size={22}/>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>@SigmentumBot</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>live · t.me/sigmentum</div>
          </div>
        </div>
        <span className="chip">
          <span className="chip-dot live"></span>
          <span>LIVE</span>
        </span>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', paddingRight: 4,
        display: 'flex', flexDirection: 'column', gap: 10,
        maskImage: 'linear-gradient(to bottom, transparent, black 4%, black 100%)',
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px', borderRadius: 14,
            background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
            color: 'var(--ink-3)', fontSize: 13,
          }}>
            <Waveform bars={14} height={12}/>
            <span>Waiting for next signal…</span>
          </div>
        )}
        {messages.map((m) => <TgMessage key={m.id} m={m}/>)}
      </div>

      <div style={{
        marginTop: 14, paddingTop: 14,
        borderTop: '1px solid var(--glass-stroke)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: 999,
          background: 'var(--inner-card)',
          border: '1px solid var(--glass-stroke)',
          fontSize: 13, color: 'var(--ink-3)',
        }}>
          Read-only · signals stream here
        </div>
        <button className="btn btn-signal" style={{ padding: '8px 14px', fontSize: 13 }}>
          Subscribe
        </button>
      </div>
    </div>
  );
}

function TgMessage({ m }) {
  const accent = m.kind === 'signal' ? 'var(--orange)'
               : m.kind === 'update' ? 'var(--green)'
               : m.kind === 'memo'   ? 'var(--blue)'
               : 'var(--ink-4)';
  return (
    <div style={{
      padding: 12, borderRadius: 12,
      background: m.kind === 'signal' ? 'rgba(238,106,19,0.08)'
                : m.kind === 'update' ? 'rgba(15,184,100,0.08)'
                : 'var(--inner-card)',
      border: `1px solid ${accent}22`,
      borderLeft: `3px solid ${accent}`,
      animation: 'tgSlideIn 400ms cubic-bezier(.2,.7,.2,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: accent }}>
          {m.title}
        </span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{m.ts}</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)' }}>{m.body}</div>
      <style>{`
        @keyframes tgSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="tgSlideIn"] { animation: none; }
        }
      `}</style>
    </div>
  );
}
