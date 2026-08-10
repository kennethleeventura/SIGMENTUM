import { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { LogoMark } from './primitives';

// ─── Stripe config ────────────────────────────────────────────────────────────
export const STRIPE_LINKS = {
  signal:   'https://buy.stripe.com/REPLACE_SIGNAL_LINK',
  momentum: 'https://buy.stripe.com/REPLACE_MOMENTUM_LINK',
};
export const STRIPE_PORTAL = 'https://billing.stripe.com/REPLACE_PORTAL_LINK';

// ─── Paper wallet ─────────────────────────────────────────────────────────────
const MOCK_POSITIONS = [
  { id: 'p1', asset: 'ETH/USDT', direction: 'Long',  size: 0.80,  entry: 3210.50, current: 3287.40, opened: '2026-07-28T14:22:00Z' },
  { id: 'p2', asset: 'BTC/USDT', direction: 'Long',  size: 0.015, entry: 67840.00, current: 69120.00, opened: '2026-07-30T09:11:00Z' },
  { id: 'p3', asset: 'EUR/USD',  direction: 'Short', size: 2000,  entry: 1.0872,  current: 1.0841,  opened: '2026-08-01T16:45:00Z' },
];
const MOCK_TRADES = [
  { id: 't1', asset: 'SOL/USDT', direction: 'Long',  size: 5,    entry: 158.20,   exit: 171.80,   pnl:  68.00, closed: '2026-07-25T11:30:00Z' },
  { id: 't2', asset: 'BTC/USDT', direction: 'Short', size: 0.02, entry: 70200.00, exit: 68900.00, pnl:  26.00, closed: '2026-07-26T08:15:00Z' },
  { id: 't3', asset: 'ETH/USDT', direction: 'Long',  size: 1.2,  entry: 3050.00,  exit: 3180.00,  pnl: 156.00, closed: '2026-07-27T15:40:00Z' },
  { id: 't4', asset: 'AAPL',     direction: 'Long',  size: 3,    entry: 218.50,   exit: 213.20,   pnl: -15.90, closed: '2026-07-29T16:00:00Z' },
  { id: 't5', asset: 'GBP/USD',  direction: 'Short', size: 1500, entry: 1.2710,   exit: 1.2655,   pnl:  82.50, closed: '2026-08-01T12:20:00Z' },
];

function calcUnrealized(pos) {
  const diff = pos.direction === 'Long' ? pos.current - pos.entry : pos.entry - pos.current;
  return diff * pos.size;
}

function freshWallet() {
  const closedPnl = MOCK_TRADES.reduce((s, t) => s + t.pnl, 0);
  return { startBalance: 10000, closedPnl, balance: 10000 + closedPnl, positions: MOCK_POSITIONS, trades: MOCK_TRADES };
}

function fmt(n, dec = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// ─── Account context ──────────────────────────────────────────────────────────
const AccountCtx = createContext(null);
export function useAccount() { return useContext(AccountCtx); }

function loadAccount() {
  try { return JSON.parse(localStorage.getItem('sig_acc') || 'null'); } catch { return null; }
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(loadAccount);
  const [modal, setModal]     = useState(null);
  const [tourStep, setTourStep] = useState(null);

  // Trigger tour on new account
  useEffect(() => {
    if (account && account.completedOnboarding === false) {
      const t = setTimeout(() => setTourStep(0), 900);
      return () => clearTimeout(t);
    }
  }, [account?.email]);

  const persist = useCallback((acc) => {
    localStorage.setItem('sig_acc', JSON.stringify(acc));
    setAccount(acc);
  }, []);

  const openAuth     = useCallback((tab = 'signup') => setModal({ type: 'auth', tab }), []);
  const openCheckout = useCallback((tier) => setModal({ type: 'checkout', tier }), []);
  const openAccount  = useCallback(() => setModal({ type: 'account' }), []);
  const openWallet   = useCallback(() => setModal({ type: 'wallet' }), []);
  const closeModal   = useCallback(() => setModal(null), []);

  const signIn = useCallback((email, plan = 'free') => {
    const prev = loadAccount();
    const isNew = !prev || prev.email !== email;
    persist({
      email,
      plan,
      since:               prev?.since   || new Date().toISOString(),
      usage:               prev?.usage   || { signals: 3, backtests: 1 },
      wallet:              prev?.wallet  || freshWallet(),
      completedOnboarding: isNew ? false : (prev?.completedOnboarding ?? true),
    });
  }, [persist]);

  const signOut = useCallback(() => {
    localStorage.removeItem('sig_acc');
    setAccount(null);
    setModal(null);
    setTourStep(null);
  }, []);

  const resetWallet = useCallback(() => {
    if (!account) return;
    persist({ ...account, wallet: freshWallet() });
  }, [account, persist]);

  const finishTour = useCallback(() => {
    setTourStep(null);
    setAccount(prev => {
      if (!prev) return prev;
      const updated = { ...prev, completedOnboarding: true };
      localStorage.setItem('sig_acc', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AccountCtx.Provider value={{ account, openAuth, openCheckout, openAccount, openWallet, resetWallet, signIn, signOut }}>
      {children}
      {modal?.type === 'auth'     && <AuthModal     tab={modal.tab}   onClose={closeModal}/>}
      {modal?.type === 'checkout' && <CheckoutModal tier={modal.tier} onClose={closeModal}/>}
      {modal?.type === 'account'  && <AccountPanel                    onClose={closeModal}/>}
      {modal?.type === 'wallet'   && <WalletPanel                     onClose={closeModal}/>}
      {tourStep !== null && <OnboardingTour step={tourStep} setStep={setTourStep} onFinish={finishTour}/>}
    </AccountCtx.Provider>
  );
}

// ─── Onboarding tour ──────────────────────────────────────────────────────────
const TOUR_STEPS = [
  { icon: '✦', title: 'Welcome to Sigmentum', body: "You're in! Here's a 30-second look at the key features — then you're free to explore.", anchor: null },
  { icon: '⚡', title: 'Live Signal Feed',     body: 'Real-time buy and sell signals across 50+ instruments. Each row shows confidence, bias, and the AI reasoning behind it.', anchor: '#signals' },
  { icon: '◎', title: 'HindsightSandbox',     body: 'Backtest any signal rule against 2 years of real price data in seconds. No code, no risk.', anchor: '#sandbox' },
  { icon: '$', title: 'Paper Trading Wallet',  body: 'Your account comes pre-loaded with $10,000 in simulated funds. Open your account panel to start tracking trades.', anchor: '#pricing' },
];

function OnboardingTour({ step, setStep, onFinish }) {
  const cur    = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (cur?.anchor) {
      document.querySelector(cur.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, cur?.anchor]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 250, width: 'min(380px, calc(100vw - 48px))' }}>
      <style>{`@keyframes slideUpIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="glass glass-strong" style={{
        borderRadius: 20, padding: '20px 22px',
        boxShadow: 'var(--shadow-lg)', animation: 'slideUpIn 280ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 18 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              height: 3, borderRadius: 2, transition: 'all 400ms',
              flex: i === step ? 2 : 1,
              background: i === step ? 'var(--orange)' : i < step ? 'var(--ink-4)' : 'var(--glass-stroke)',
            }}/>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'var(--orange-glow)', border: '1px solid rgba(238,106,19,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, color: 'var(--orange)',
          }}>{cur.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{cur.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55 }}>{cur.body}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={onFinish} style={{
            fontSize: 11, color: 'var(--ink-4)', border: 'none', background: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '4px 0',
          }}>Skip tour</button>
          <div style={{ flex: 1 }}/>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="btn" style={{ fontSize: 12, padding: '7px 14px' }}>← Back</button>
          )}
          <button onClick={isLast ? onFinish : () => setStep(s => s + 1)}
            className="btn btn-signal" style={{ fontSize: 12, padding: '7px 16px' }}>
            {isLast ? 'Get started →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Overlay wrapper ──────────────────────────────────────────────────────────
function Overlay({ onClose, children, align = 'center' }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(5,7,12,0.84)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: align === 'center' ? 'center' : 'stretch',
      justifyContent: align === 'right' ? 'flex-end' : 'center',
      padding: align === 'center' ? '20px' : 0,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

// ─── AuthModal ────────────────────────────────────────────────────────────────
function AuthModal({ tab: initialTab, onClose }) {
  const { signIn } = useAccount();
  const [tab, setTab]       = useState(initialTab || 'signup');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'signup' && pw !== confirm) { setError("Passwords don't match."); return; }
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    signIn(email, 'free');
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)',
    color: 'var(--ink)', fontSize: 14, fontFamily: 'var(--font-sans)',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <Overlay onClose={onClose}>
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 440, borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 5vw, 40px)', position: 'relative', boxShadow: 'var(--shadow-lg)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32,
          borderRadius: '50%', border: '1px solid var(--glass-stroke)',
          background: 'var(--inner-card)', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>You're in.</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Free account created. Redirecting…</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <LogoMark size={32}/>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>Sigmentum</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>AI trading signals platform</div>
              </div>
            </div>

            <div style={{
              display: 'flex', background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
              borderRadius: 12, padding: 4, marginBottom: 24, gap: 4,
            }}>
              {['signup', 'signin'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
                  flex: 1, padding: '8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize: 13, fontWeight: tab === t ? 600 : 400,
                  boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 200ms', fontFamily: 'var(--font-sans)',
                }}>{t === 'signup' ? 'Create account' : 'Sign in'}</button>
              ))}
            </div>

            <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="email"    required placeholder="Email address"    value={email}   onChange={e => setEmail(e.target.value)}   style={inp}/>
              <input type="password" required placeholder="Password"         value={pw}      onChange={e => setPw(e.target.value)}      style={inp}/>
              {tab === 'signup' && (
                <input type="password" required placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp}/>
              )}
              {error && (
                <div style={{ fontSize: 12, color: 'var(--orange)', background: 'rgba(238,106,19,0.08)', padding: '8px 12px', borderRadius: 8 }}>{error}</div>
              )}
              {tab === 'signin' && (
                <div style={{ textAlign: 'right', marginTop: -4 }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-4)', cursor: 'pointer' }}>Forgot password?</span>
                </div>
              )}
              <button type="submit" className={tab === 'signup' ? 'btn btn-signal' : 'btn btn-primary'}
                style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '12px', fontSize: 14 }}
                disabled={loading}>
                {loading ? 'One moment…' : tab === 'signup' ? 'Create free account' : 'Sign in'}
              </button>
            </form>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 13, color: 'var(--ink-3)', cursor: 'default', fontFamily: 'var(--font-sans)',
              }}>
                <span style={{ fontSize: 16 }}>G</span> Continue with Google
                <span style={{ fontSize: 10, color: 'var(--ink-5)', marginLeft: 4 }}>(coming soon)</span>
              </button>
            </div>

            <div style={{ marginTop: 16, fontSize: 11, color: 'var(--ink-4)', textAlign: 'center', lineHeight: 1.5 }}>
              By continuing you agree to Sigmentum's Terms of Service and Privacy Policy.
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}

// ─── CheckoutModal ────────────────────────────────────────────────────────────
const TIER_META = {
  free:     { name: 'Free',     price: '$0',  billing: 'forever', color: 'var(--ink-3)', stripe: null },
  signal:   { name: 'Signal',   price: '$28', billing: '/mo',     color: 'var(--orange)', stripe: STRIPE_LINKS.signal },
  momentum: { name: 'Momentum', price: '$82', billing: '/mo',     color: 'var(--green)',  stripe: STRIPE_LINKS.momentum },
};

function CheckoutModal({ tier, onClose }) {
  const { signIn, account } = useAccount();
  const meta = TIER_META[tier?.id || 'free'];
  const [email, setEmail]   = useState(account?.email || '');
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const isFree = tier?.id === 'free';

  const handleFree = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    signIn(email, 'free');
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <Overlay onClose={onClose}>
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 480, borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 5vw, 40px)', position: 'relative', boxShadow: 'var(--shadow-lg)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32,
          borderRadius: '50%', border: '1px solid var(--glass-stroke)',
          background: 'var(--inner-card)', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Free account ready.</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>5 signals/day + $10,000 paper wallet unlocked.</div>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderRadius: 14, marginBottom: 24,
              background: `linear-gradient(135deg, ${meta.color}10, transparent)`,
              border: `1px solid ${meta.color}22`,
            }}>
              <div>
                <div style={{ fontSize: 11, color: meta.color, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.12em', marginBottom: 4 }}>
                  {meta.name.toUpperCase()} PLAN
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                  {isFree ? 'No credit card required' : tier?.id === 'signal' ? '7-day free trial included' : 'Full platform access'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="mono" style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)' }}>{meta.price}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>{meta.billing}</span>
              </div>
            </div>

            {tier?.features && (
              <div style={{ marginBottom: 24 }}>
                {tier.features.slice(0, 4).map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ color: meta.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
                {tier.features.length > 4 && (
                  <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 4, paddingLeft: 24 }}>
                    + {tier.features.length - 4} more features
                  </div>
                )}
              </div>
            )}

            {isFree ? (
              <form onSubmit={handleFree} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {!account && (
                  <input type="email" required placeholder="Your email address"
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 10,
                      border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)',
                      color: 'var(--ink)', fontSize: 14, fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
                    }}/>
                )}
                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
                  disabled={loading}>
                  {loading ? 'Setting up…' : 'Start for free →'}
                </button>
              </form>
            ) : (
              <a href={meta.stripe || '#'} target="_blank" rel="noopener noreferrer"
                className={`btn ${tier?.id === 'momentum' ? 'btn-momentum' : 'btn-signal'}`}
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '13px', fontSize: 15 }}>
                {tier?.id === 'signal' ? 'Start 7-day free trial →' : 'Get Momentum →'}
              </a>
            )}

            <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center', fontSize: 11, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)' }}>
              <span>🔒 SSL secured</span>
              <span>↩ Cancel anytime</span>
              <span>⚡ Stripe payments</span>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}

// ─── AccountPanel ─────────────────────────────────────────────────────────────
const TIER_LABELS = {
  free:     { label: 'Free',     color: 'var(--ink-3)',  bg: 'rgba(11,13,18,0.06)'   },
  signal:   { label: 'Signal',   color: 'var(--orange)', bg: 'rgba(238,106,19,0.10)' },
  momentum: { label: 'Momentum', color: 'var(--green)',  bg: 'rgba(15,184,100,0.10)' },
};

function CloseBtn({ onClose }) {
  return (
    <button onClick={onClose} style={{
      width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--glass-stroke)',
      background: 'var(--inner-card)', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>×</button>
  );
}

function AccountPanel({ onClose }) {
  const { account, signOut, openWallet } = useAccount();
  if (!account) return null;
  const tier    = TIER_LABELS[account.plan] || TIER_LABELS.free;
  const initials = account.email?.[0]?.toUpperCase() || '?';
  const since   = new Date(account.since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isPaid  = account.plan !== 'free';
  const wallet  = account.wallet || freshWallet();

  const unrealized = wallet.positions.reduce((s, p) => s + calcUnrealized(p), 0);
  const totalPnl   = wallet.closedPnl + unrealized;
  const balance    = wallet.balance + unrealized;
  const pnlColor   = totalPnl >= 0 ? 'var(--green)' : 'var(--orange)';

  const usage = [
    { label: 'Signals today',        val: account.usage?.signals  ?? 3, max: account.plan === 'free' ? 5 : 32 },
    { label: 'Backtests this month', val: account.usage?.backtests ?? 1, max: account.plan === 'free' ? 3 : '∞' },
  ];

  return (
    <Overlay onClose={onClose} align="right">
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 360, height: '100%',
        borderRadius: '24px 0 0 24px', padding: '28px 24px',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={28}/>
            <span style={{ fontWeight: 600, fontSize: 15 }}>My Account</span>
          </div>
          <CloseBtn onClose={onClose}/>
        </div>

        {/* Avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 18px', borderRadius: 16,
          background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)', marginBottom: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${tier.color}, ${tier.color}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: 'white',
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>Member since {since}</div>
          </div>
          <span style={{
            marginLeft: 'auto', flexShrink: 0, padding: '3px 10px', borderRadius: 999,
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em',
            background: tier.bg, color: tier.color,
          }}>{tier.label.toUpperCase()}</span>
        </div>

        {/* Paper wallet summary */}
        <button onClick={() => { onClose(); setTimeout(openWallet, 100); }} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderRadius: 14, marginBottom: 16,
          background: 'linear-gradient(135deg, rgba(15,184,100,0.08), rgba(11,93,238,0.06))',
          border: '1px solid rgba(15,184,100,0.15)', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', width: '100%', textAlign: 'left',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 4 }}>PAPER WALLET</div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>${fmt(balance)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: pnlColor }}>
              {totalPnl >= 0 ? '+' : ''}${fmt(Math.abs(totalPnl))}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-5)', marginTop: 2 }}>View wallet →</div>
          </div>
        </button>

        {/* Usage */}
        <div style={{ marginBottom: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Usage this cycle</div>
          {usage.map((u, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: 'var(--ink-2)' }}>{u.label}</span>
                <span className="mono" style={{ color: 'var(--ink-3)' }}>{u.val} / {u.max}</span>
              </div>
              {typeof u.max === 'number' && (
                <div style={{ height: 4, borderRadius: 2, background: 'var(--glass-stroke)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(u.val / u.max * 100, 100)}%`, height: '100%', borderRadius: 2,
                    background: u.val / u.max > 0.8 ? 'var(--orange)' : 'var(--green)',
                    transition: 'width 600ms',
                  }}/>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Billing */}
        <div style={{ padding: '16px 18px', borderRadius: 14, marginBottom: 16, background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Billing</div>
          {isPaid ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}><strong>{tier.label}</strong> plan · renews monthly</div>
              <a href={STRIPE_PORTAL} target="_blank" rel="noopener noreferrer"
                className="btn" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 13, padding: '9px' }}>
                Manage subscription →
              </a>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 12, lineHeight: 1.5 }}>
                You're on the Free plan. Upgrade to unlock unlimited signals and real-time alerts.
              </div>
              <a href="#pricing" onClick={onClose}
                className="btn btn-signal" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: 13, padding: '9px' }}>
                Upgrade plan →
              </a>
            </>
          )}
        </div>

        {/* Connections */}
        <div style={{ marginBottom: 'auto' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Connected channels</div>
          {[
            { icon: '◈', label: 'Telegram',    status: 'Not connected', action: 'Connect' },
            { icon: '✉', label: 'Email alerts', status: account.email,  action: null },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--glass-stroke)',
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{c.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.status}</div>
              </div>
              {c.action && <button className="btn" style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}>{c.action}</button>}
            </div>
          ))}
        </div>

        <button onClick={signOut} style={{
          marginTop: 24, width: '100%', padding: '10px', borderRadius: 10,
          border: '1px solid var(--glass-stroke)', background: 'transparent',
          color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(238,106,19,0.06)'; e.currentTarget.style.color = 'var(--orange)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-3)'; }}>
          Sign out
        </button>
      </div>
    </Overlay>
  );
}

// ─── WalletPanel ──────────────────────────────────────────────────────────────
function WalletPanel({ onClose }) {
  const { account, resetWallet } = useAccount();
  if (!account) return null;

  const wallet     = account.wallet || freshWallet();
  const unrealized = wallet.positions.reduce((s, p) => s + calcUnrealized(p), 0);
  const totalPnl   = wallet.closedPnl + unrealized;
  const balance    = wallet.balance + unrealized;
  const ret        = (totalPnl / wallet.startBalance) * 100;
  const pnlColor   = totalPnl >= 0 ? 'var(--green)' : 'var(--orange)';
  const pnlSign    = totalPnl >= 0 ? '+' : '';

  const [confirmReset, setConfirmReset] = useState(false);
  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetWallet();
    setConfirmReset(false);
  };

  return (
    <Overlay onClose={onClose} align="right">
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 420, height: '100%',
        borderRadius: '24px 0 0 24px', padding: '28px 24px',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, color: 'var(--green)' }}>$</span>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Paper Wallet</span>
            <span style={{
              padding: '2px 8px', borderRadius: 999, fontSize: 9,
              fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em',
              background: 'rgba(15,184,100,0.1)', color: 'var(--green)',
            }}>SIMULATED</span>
          </div>
          <CloseBtn onClose={onClose}/>
        </div>

        {/* Balance card */}
        <div style={{
          padding: '20px 22px', borderRadius: 16, marginBottom: 20,
          background: 'linear-gradient(135deg, rgba(15,184,100,0.08), rgba(11,93,238,0.06))',
          border: '1px solid rgba(15,184,100,0.15)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', marginBottom: 6 }}>PORTFOLIO VALUE</div>
          <div className="mono" style={{ fontSize: 34, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: 14 }}>
            ${fmt(balance)}
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Total P&L',   val: `${pnlSign}$${fmt(Math.abs(totalPnl))}`,  color: pnlColor },
              { label: 'Return',      val: `${pnlSign}${fmt(ret)}%`,                  color: pnlColor },
              { label: 'Started',     val: '$10,000',                                  color: 'var(--ink-3)' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, color: 'var(--ink-5)', marginBottom: 2 }}>{s.label}</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closed P&L bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-4)', marginBottom: 8 }}>
            <span>Realized vs unrealized</span>
            <span className="mono">{pnlSign}${fmt(Math.abs(totalPnl))} total</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--glass-stroke)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${Math.abs(wallet.closedPnl) / Math.abs(totalPnl) * 100}%`, background: 'var(--green)', height: '100%', borderRadius: '3px 0 0 3px' }}/>
            <div style={{ flex: 1, background: unrealized >= 0 ? 'rgba(15,184,100,0.3)' : 'rgba(238,106,19,0.3)', height: '100%', borderRadius: '0 3px 3px 0' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-5)', marginTop: 5 }}>
            <span>Closed +${fmt(wallet.closedPnl)}</span>
            <span>Open {unrealized >= 0 ? '+' : ''}${fmt(unrealized)}</span>
          </div>
        </div>

        {/* Open positions */}
        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Open Positions ({wallet.positions.length})</div>
          {wallet.positions.map(pos => {
            const pnl    = calcUnrealized(pos);
            const pnlPct = (pnl / (pos.entry * pos.size)) * 100;
            const isGain = pnl >= 0;
            const dec    = pos.entry > 100 ? 2 : 4;
            return (
              <div key={pos.id} style={{
                padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{pos.asset}</span>
                    <span style={{
                      padding: '1px 7px', borderRadius: 999, fontSize: 9,
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                      background: pos.direction === 'Long' ? 'rgba(15,184,100,0.1)' : 'rgba(238,106,19,0.1)',
                      color: pos.direction === 'Long' ? 'var(--green)' : 'var(--orange)',
                    }}>{pos.direction.toUpperCase()}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: isGain ? 'var(--green)' : 'var(--orange)' }}>
                    {isGain ? '+' : ''}${fmt(pnl)} <span style={{ color: 'var(--ink-5)', fontWeight: 400 }}>({isGain ? '+' : ''}{fmt(pnlPct)}%)</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--ink-4)' }}>
                  <span>Size {pos.size}</span>
                  <span>Entry {fmt(pos.entry, dec)}</span>
                  <span>Now {fmt(pos.current, dec)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trade history */}
        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Closed Trades</div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--glass-stroke)' }}>
            {wallet.trades.map((t, i) => {
              const isGain = t.pnl >= 0;
              const dt = new Date(t.closed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: i % 2 === 0 ? 'var(--inner-card)' : 'transparent',
                  borderTop: i === 0 ? 'none' : '1px solid var(--glass-stroke)',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{t.asset}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-5)' }}>{dt} · {t.direction}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: isGain ? 'var(--green)' : 'var(--orange)' }}>
                      {isGain ? '+' : '-'}${fmt(Math.abs(t.pnl))}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink-5)' }}>closed</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <button onClick={handleReset} style={{
          marginTop: 'auto', width: '100%', padding: '10px', borderRadius: 10,
          border: `1px solid ${confirmReset ? 'var(--orange)' : 'var(--glass-stroke)'}`,
          background: confirmReset ? 'rgba(238,106,19,0.06)' : 'transparent',
          color: confirmReset ? 'var(--orange)' : 'var(--ink-4)',
          fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 180ms',
        }}>
          {confirmReset ? 'Confirm — reset to $10,000?' : 'Reset wallet to $10,000'}
        </button>
      </div>
    </Overlay>
  );
}
