import { useEffect, useRef, useState } from 'react';
import { TG_LIVE_STREAM, POPUP_EVENTS } from './data';
import { LogoMark, Waveform } from './primitives';

export function PopupNotifier() {
  const [queue, setQueue] = useState([]);
  const idxRef = useRef(0);
  const uidRef = useRef(0);

  useEffect(() => {
    const fire = () => {
      const ev = POPUP_EVENTS[idxRef.current % POPUP_EVENTS.length];
      idxRef.current++;
      const uid = ++uidRef.current;
      setQueue((q) => [...q, { ...ev, uid }]);
      setTimeout(() => {
        setQueue((q) => q.filter((n) => n.uid !== uid));
      }, 7000);
    };
    const first = setTimeout(fire, 4500);
    const id = setInterval(fire, 11000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 80, right: 12, zIndex: 60,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
      maxWidth: 'calc(100vw - 24px)',
    }}>
      {queue.map((n) => <PopupCard key={n.uid} n={n}/>)}
    </div>
  );
}

function PopupCard({ n }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);
  const isBuy  = n.kind === 'buy';
  const isSell = n.kind === 'sell';
  const isUpd  = n.kind === 'update';
  const accent = isBuy ? 'var(--green)' : isSell ? 'var(--orange)' : 'var(--blue)';
  const accentRaw = isBuy ? '#0fb864' : isSell ? '#ee6a13' : '#0b5dee';
  const label  = isBuy ? 'BUY SIGNAL' : isSell ? 'SELL SIGNAL' : 'POSITION UPDATE';
  const arrow  = isBuy ? '▲' : isSell ? '▼' : '◆';

  // Parse entry / TP / SL from body text for trade signals
  const entryMatch = n.body.match(/Entry\s+([\d,\.]+)/i);
  const tpMatch    = n.body.match(/TP1?\s+([\d,\.]+)/i);
  const slMatch    = n.body.match(/SL\s+([\d,\.]+)/i);

  return (
    <div className="glass glass-strong" style={{
      pointerEvents: 'auto',
      width: 'min(420px, calc(100vw - 24px))', padding: '14px 16px', borderRadius: 'var(--radius-xl)',
      borderLeft: `4px solid ${accent}`,
      boxShadow: `var(--shadow-lg), 0 0 0 1px ${accentRaw}28, 0 0 48px -12px ${accentRaw}55`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
      transition: 'opacity 400ms cubic-bezier(.2,.7,.2,1), transform 500ms cubic-bezier(.2,.7,.2,1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -30, left: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${accentRaw}, transparent 70%)`,
        opacity: 0.18, filter: 'blur(24px)', pointerEvents: 'none',
      }}/>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, position: 'relative' }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${accentRaw}, ${accentRaw}bb)`,
          boxShadow: `0 4px 14px ${accentRaw}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 20, fontWeight: 700,
        }}>{arrow}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: accent, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.14em', marginBottom: 3 }}>
            {label}
          </div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            {n.asset}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>CONFIDENCE</div>
          <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>{n.conf}%</div>
        </div>
      </div>

      {/* Trade levels (if buy/sell) */}
      {(isBuy || isSell) && (entryMatch || tpMatch || slMatch) && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12,
        }}>
          {[
            entryMatch && { label: 'ENTRY', value: entryMatch[1], col: 'var(--ink-2)' },
            tpMatch    && { label: 'TP1',   value: tpMatch[1],    col: 'var(--green)' },
            slMatch    && { label: 'SL',    value: slMatch[1],    col: 'var(--orange)' },
          ].filter(Boolean).map((item) => (
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
      <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', marginBottom: 14 }}>
        {n.body}
      </div>

      {/* Footer */}
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
    </div>
  );
}

export function LiveTelegram() {
  const [messages, setMessages] = useState([]);
  const startedRef = useRef(false);
  const contRef = useRef(null);

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
      `}</style>
    </div>
  );
}
