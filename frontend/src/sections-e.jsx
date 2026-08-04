import { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { LogoMark } from './primitives';

// ─── Stripe config ───────────────────────────────────────────────────────────
// Replace these with your real Stripe Payment Link URLs from dashboard.stripe.com
export const STRIPE_LINKS = {
  signal:   'https://buy.stripe.com/REPLACE_SIGNAL_LINK',
  momentum: 'https://buy.stripe.com/REPLACE_MOMENTUM_LINK',
};
export const STRIPE_PORTAL = 'https://billing.stripe.com/REPLACE_PORTAL_LINK';

// ─── Account context ─────────────────────────────────────────────────────────
const AccountCtx = createContext(null);

export function useAccount() {
  return useContext(AccountCtx);
}

function loadAccount() {
  try { return JSON.parse(localStorage.getItem('sig_acc') || 'null'); } catch { return null; }
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(loadAccount);
  const [modal, setModal] = useState(null);

  const openAuth     = useCallback((tab = 'signup') => setModal({ type: 'auth', tab }), []);
  const openCheckout = useCallback((tier) => setModal({ type: 'checkout', tier }), []);
  const openAccount  = useCallback(() => setModal({ type: 'account' }), []);
  const closeModal   = useCallback(() => setModal(null), []);

  const signIn = useCallback((email, plan = 'free') => {
    const acc = { email, plan, since: new Date().toISOString(), usage: { signals: 3, backtests: 1 } };
    localStorage.setItem('sig_acc', JSON.stringify(acc));
    setAccount(acc);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('sig_acc');
    setAccount(null);
    setModal(null);
  }, []);

  return (
    <AccountCtx.Provider value={{ account, openAuth, openCheckout, openAccount, signIn, signOut }}>
      {children}
      {modal?.type === 'auth'     && <AuthModal     tab={modal.tab}   onClose={closeModal} />}
      {modal?.type === 'checkout' && <CheckoutModal tier={modal.tier} onClose={closeModal} />}
      {modal?.type === 'account'  && <AccountPanel                    onClose={closeModal} />}
    </AccountCtx.Provider>
  );
}

// ─── Overlay wrapper ─────────────────────────────────────────────────────────
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

// ─── AuthModal ───────────────────────────────────────────────────────────────
function AuthModal({ tab: initialTab, onClose }) {
  const { signIn, openCheckout } = useAccount();
  const [tab, setTab] = useState(initialTab || 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'signup' && password !== confirm) { setError('Passwords don\'t match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    signIn(email, 'free');
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid var(--glass-stroke)',
    background: 'var(--inner-card)', color: 'var(--ink)',
    fontSize: 14, fontFamily: 'var(--font-sans)',
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <Overlay onClose={onClose}>
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 440, borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 5vw, 40px)', position: 'relative',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--glass-stroke)',
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

            {/* Tab switcher */}
            <div style={{
              display: 'flex', background: 'var(--inner-card)',
              border: '1px solid var(--glass-stroke)', borderRadius: 12,
              padding: 4, marginBottom: 24, gap: 4,
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
              <input type="email" required placeholder="Email address"
                value={email} onChange={e => setEmail(e.target.value)} style={inp}/>
              <input type="password" required placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} style={inp}/>
              {tab === 'signup' && (
                <input type="password" required placeholder="Confirm password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} style={inp}/>
              )}

              {error && (
                <div style={{ fontSize: 12, color: 'var(--orange)', background: 'rgba(238,106,19,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                  {error}
                </div>
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
  signal:   { name: 'Signal',   price: '$28', billing: '/mo',      color: 'var(--orange)', stripe: STRIPE_LINKS.signal },
  momentum: { name: 'Momentum', price: '$82', billing: '/mo',      color: 'var(--green)',  stripe: STRIPE_LINKS.momentum },
};

function CheckoutModal({ tier, onClose }) {
  const { signIn, account } = useAccount();
  const meta = TIER_META[tier?.id || 'free'];
  const [email, setEmail] = useState(account?.email || '');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
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
        padding: 'clamp(24px, 5vw, 40px)', position: 'relative',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--glass-stroke)',
          background: 'var(--inner-card)', cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Free account ready.</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>5 signals/day + paper trading wallet unlocked.</div>
          </div>
        ) : (
          <>
            {/* Plan header */}
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

            {/* Features */}
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
                      border: '1px solid var(--glass-stroke)',
                      background: 'var(--inner-card)', color: 'var(--ink)',
                      fontSize: 14, fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
                    }}/>
                )}
                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
                  disabled={loading}>
                  {loading ? 'Setting up…' : 'Start for free →'}
                </button>
              </form>
            ) : (
              <a href={meta.stripe || '#'}
                target="_blank" rel="noopener noreferrer"
                className={`btn ${tier?.id === 'momentum' ? 'btn-momentum' : 'btn-signal'}`}
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '13px', fontSize: 15 }}>
                {tier?.id === 'signal' ? 'Start 7-day free trial →' : 'Get Momentum →'}
              </a>
            )}

            {/* Trust signals */}
            <div style={{
              display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center',
              fontSize: 11, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)',
            }}>
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
  free:     { label: 'Free',     color: 'var(--ink-3)',  bg: 'rgba(11,13,18,0.06)'      },
  signal:   { label: 'Signal',   color: 'var(--orange)', bg: 'rgba(238,106,19,0.10)'    },
  momentum: { label: 'Momentum', color: 'var(--green)',  bg: 'rgba(15,184,100,0.10)'    },
};

function AccountPanel({ onClose }) {
  const { account, signOut } = useAccount();
  if (!account) return null;
  const tier = TIER_LABELS[account.plan] || TIER_LABELS.free;
  const initials = account.email?.[0]?.toUpperCase() || '?';
  const since = new Date(account.since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isPaid = account.plan !== 'free';

  const usage = [
    { label: 'Signals today',       val: account.usage?.signals ?? 3, max: account.plan === 'free' ? 5 : 32 },
    { label: 'Backtests this month', val: account.usage?.backtests ?? 1, max: account.plan === 'free' ? 3 : '∞' },
  ];

  return (
    <Overlay onClose={onClose} align="right">
      <div className="glass glass-strong" style={{
        width: '100%', maxWidth: 360,
        height: '100%', borderRadius: '24px 0 0 24px',
        padding: '28px 24px', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark size={28}/>
            <span style={{ fontWeight: 600, fontSize: 15 }}>My Account</span>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '1px solid var(--glass-stroke)', background: 'var(--inner-card)',
            cursor: 'pointer', fontSize: 16, color: 'var(--ink-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Avatar + info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 18px', borderRadius: 16,
          background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
          marginBottom: 20,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `linear-gradient(135deg, ${tier.color}, ${tier.color}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.email}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>Member since {since}</div>
          </div>
          <span style={{
            marginLeft: 'auto', flexShrink: 0,
            padding: '3px 10px', borderRadius: 999,
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
            letterSpacing: '0.08em', background: tier.bg, color: tier.color,
          }}>{tier.label.toUpperCase()}</span>
        </div>

        {/* Usage */}
        <div style={{ marginBottom: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Usage this cycle</div>
          {usage.map((u, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: 'var(--ink-2)' }}>{u.label}</span>
                <span className="mono" style={{ color: 'var(--ink-3)' }}>
                  {u.val} / {u.max}
                </span>
              </div>
              {typeof u.max === 'number' && (
                <div style={{ height: 4, borderRadius: 2, background: 'var(--glass-stroke)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(u.val / u.max * 100, 100)}%`, height: '100%',
                    background: u.val / u.max > 0.8 ? 'var(--orange)' : 'var(--green)',
                    borderRadius: 2, transition: 'width 600ms',
                  }}/>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Billing */}
        <div style={{
          padding: '16px 18px', borderRadius: 14, marginBottom: 20,
          background: 'var(--inner-card)', border: '1px solid var(--glass-stroke)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Billing</div>
          {isPaid ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>
                <strong>{tier.label}</strong> plan · renews monthly
              </div>
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
            { icon: '◈', label: 'Telegram', status: 'Not connected', action: 'Connect' },
            { icon: '✉', label: 'Email alerts', status: account.email, action: null },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--glass-stroke)',
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{c.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.status}</div>
              </div>
              {c.action && (
                <button className="btn" style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}>{c.action}</button>
              )}
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={signOut} style={{
          marginTop: 24, width: '100%', padding: '10px',
          borderRadius: 10, border: '1px solid var(--glass-stroke)',
          background: 'transparent', color: 'var(--ink-3)',
          fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          transition: 'all 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(238,106,19,0.06)'; e.currentTarget.style.color = 'var(--orange)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-3)'; }}>
          Sign out
        </button>
      </div>
    </Overlay>
  );
}
