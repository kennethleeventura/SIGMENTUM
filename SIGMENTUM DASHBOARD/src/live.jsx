// Live components — popup signal notifications + live Telegram stream
const { useEffect: useEffL, useRef: useRefL, useState: useStateL } = React;

// --------------------------- Popup notifications ---------------------------
function PopupNotifier() {
  const [queue, setQueue] = useStateL([]);
  const idxRef = useRefL(0);
  const uidRef = useRefL(0);

  useEffL(() => {
    // First popup after a delay, then cycle
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
      position: 'fixed', top: 100, right: 20, zIndex: 60,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {queue.map((n) => <PopupCard key={n.uid} n={n}/>)}
    </div>
  );
}

function PopupCard({ n }) {
  const [visible, setVisible] = useStateL(false);
  useEffL(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);
  const isBuy = n.kind === 'buy';
  const isSell = n.kind === 'sell';
  const isUpdate = n.kind === 'update';
  const accent = isBuy ? 'var(--green)' : isSell ? 'var(--orange)' : 'var(--blue)';
  const label = isBuy ? 'BUY SIGNAL' : isSell ? 'SELL SIGNAL' : 'UPDATE';

  return (
    <div className="glass glass-strong" style={{
      pointerEvents: 'auto',
      width: 340, padding: 14, borderRadius: 'var(--radius-lg)',
      borderLeft: `3px solid ${accent}`,
      boxShadow: `var(--shadow-lg), 0 0 0 1px ${accent}22, 0 0 32px -8px ${accent}44`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 40px))',
      transition: 'opacity 400ms cubic-bezier(.2,.7,.2,1), transform 500ms cubic-bezier(.2,.7,.2,1)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -20, left: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}, transparent 70%)`,
        opacity: 0.2, filter: 'blur(18px)', pointerEvents: 'none',
      }}/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, position: 'relative' }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 14, fontWeight: 600,
        }}>
          {isBuy ? '▲' : isSell ? '▼' : '◆'}
        </span>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ fontSize: 9, color: accent, letterSpacing: '0.14em' }}>{label}</div>
          <div className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{n.asset} · conf {n.conf}</div>
        </div>
        <LogoMark size={20}/>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-2)', marginBottom: 10 }}>
        {n.body}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span className="chip" style={{ fontSize: 9, padding: '2px 7px' }}>
          <span style={{ fontSize: 9 }}>✉</span>
          <span>EMAIL</span>
        </span>
        <span className="chip" style={{ fontSize: 9, padding: '2px 7px' }}>
          <span style={{ fontSize: 9 }}>◈</span>
          <span>TELEGRAM</span>
        </span>
        <span className="chip" style={{ fontSize: 9, padding: '2px 7px' }}>
          <span className="chip-dot live" style={{ width: 5, height: 5 }}/>
          <span>SENT</span>
        </span>
        <div style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>just now</span>
      </div>
    </div>
  );
}

// --------------------------- Live Telegram feed ---------------------------
function LiveTelegram() {
  const [messages, setMessages] = useStateL([]);
  const startedRef = useRefL(false);
  const contRef = useRefL(null);

  useEffL(() => {
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
    // Loop — after last, restart after a pause
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
      {/* Header */}
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

      {/* Message stream */}
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

      {/* Input (decorative) */}
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

Object.assign(window, { PopupNotifier, LiveTelegram });
