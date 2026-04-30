// Data module — mock signals, assets, AI reasoning traces, glossary, etc.

const ASSETS = [
  { sym: 'EUR/USD', name: 'Euro / US Dollar',        class: 'FX',     price: 1.0847, pct:  0.32, bias: 'Long',    conf: 78, vol: 0.64, rsi: 58 },
  { sym: 'GBP/USD', name: 'British Pound / Dollar',  class: 'FX',     price: 1.2634, pct: -0.18, bias: 'Short',   conf: 62, vol: 0.71, rsi: 44 },
  { sym: 'USD/JPY', name: 'Dollar / Japanese Yen',   class: 'FX',     price: 152.41, pct:  0.55, bias: 'Long',    conf: 71, vol: 0.83, rsi: 63 },
  { sym: 'AUD/USD', name: 'Australian Dollar',       class: 'FX',     price: 0.6589, pct: -0.41, bias: 'Neutral', conf: 48, vol: 0.52, rsi: 50 },
  { sym: 'XAU/USD', name: 'Gold Spot',               class: 'Metals', price: 2341.20, pct:  1.24, bias: 'Long',   conf: 84, vol: 1.12, rsi: 67 },
  { sym: 'WTI',     name: 'Crude Oil WTI',           class: 'Energy', price: 82.47,  pct: -0.92, bias: 'Short',   conf: 68, vol: 1.45, rsi: 41 },
  { sym: 'NAS100',  name: 'NASDAQ 100',              class: 'Indices',price: 18234.5, pct:  0.76, bias: 'Long',    conf: 74, vol: 0.98, rsi: 61 },
  { sym: 'SPX500',  name: 'S&P 500',                 class: 'Indices',price: 5234.18, pct:  0.43, bias: 'Long',    conf: 66, vol: 0.68, rsi: 57 },
  { sym: 'BTC/USD', name: 'Bitcoin',                 class: 'Crypto', price: 71420,  pct:  2.14, bias: 'Long',    conf: 81, vol: 2.34, rsi: 72 },
  { sym: 'ETH/USD', name: 'Ethereum',                class: 'Crypto', price: 3580,   pct:  1.82, bias: 'Long',    conf: 73, vol: 2.10, rsi: 65 },
];

const HERO_SIGNAL = {
  asset: 'XAU/USD',
  name: 'Gold Spot',
  bias: 'Long',
  confidence: 84,
  risk: 'Moderate',
  headline: 'Momentum accelerates as real yields soften into CPI',
  reasoning: 'Gold breaks above the 2,338 resistance with expanding range and RSI pushing into 67 — a zone that historically precedes continuation. EMA-9 has flipped above EMA-21 intraday, and volatility is compressing favorably relative to the trailing five sessions. Signal quality is elevated; momentum confirmation is present across the 1H and 4H windows.',
  entry: 2341.20,
  tp1: 2358.00,
  tp2: 2372.40,
  sl:  2329.80,
  rr: 2.9,
  generated: 'a moment ago',
  pair: 'XAU/USD',
  timeframe: '4H',
};

const SIGNAL_FEED = [
  { t: '09:42', asset: 'XAU/USD', bias: 'Long',    conf: 84, status: 'active',  pct: 1.24 },
  { t: '09:15', asset: 'EUR/USD', bias: 'Long',    conf: 78, status: 'active',  pct: 0.32 },
  { t: '08:58', asset: 'BTC/USD', bias: 'Long',    conf: 81, status: 'active',  pct: 2.14 },
  { t: '08:30', asset: 'USD/JPY', bias: 'Long',    conf: 71, status: 'watching',pct: 0.55 },
  { t: '08:12', asset: 'WTI',     bias: 'Short',   conf: 68, status: 'active',  pct:-0.92 },
  { t: '07:55', asset: 'GBP/USD', bias: 'Short',   conf: 62, status: 'closed-w',pct:-0.18 },
  { t: '07:20', asset: 'NAS100',  bias: 'Long',    conf: 74, status: 'active',  pct: 0.76 },
  { t: '06:48', asset: 'ETH/USD', bias: 'Long',    conf: 73, status: 'watching',pct: 1.82 },
  { t: '06:15', asset: 'AUD/USD', bias: 'Neutral', conf: 48, status: 'hold',    pct:-0.41 },
  { t: '05:42', asset: 'SPX500',  bias: 'Long',    conf: 66, status: 'closed-w',pct: 0.43 },
];

const REASONING_STEPS = [
  { tag: 'ingest',   text: 'Pulling OHLC, EMA-9, EMA-21, RSI-14, volatility, range from SIGNAL_LOG.' },
  { tag: 'context',  text: 'Cross-referencing prior 20 sessions. Volatility regime: compressing. Trend: constructive.' },
  { tag: 'pattern',  text: 'Detecting bullish continuation: EMA-9 > EMA-21, RSI 67 (not overbought), range expansion +14%.' },
  { tag: 'risk',     text: 'DXY softening; CPI release in 36h increases event-risk. Sizing half-unit.' },
  { tag: 'decide',   text: 'Bias: Long XAU/USD. Confidence 84. TP1 2358 / TP2 2372. SL 2329.80. R:R 2.9.' },
  { tag: 'deliver',  text: 'Writing row to GPT Output. Dispatching Telegram alert. Generating .txt memo.' },
];

const PIPELINE = [
  { id: 1, label: 'Scheduler',     sub: 'every 15 min',    tool: 'make.com',      status: 'ok',  ms: 12 },
  { id: 2, label: 'Sheets',        sub: 'SIGNAL_LOG',       tool: 'Google Sheets', status: 'ok',  ms: 340 },
  { id: 3, label: 'GPT-4o',        sub: 'reasoning pass',   tool: 'OpenAI',        status: 'working', ms: 1820 },
  { id: 4, label: 'Parse JSON',    sub: 'schema validate',  tool: 'internal',      status: 'ok',  ms: 6 },
  { id: 5, label: 'Sheets write',  sub: 'GPT Output',       tool: 'Google Sheets', status: 'ok',  ms: 220 },
  { id: 6, label: 'Memo file',     sub: 'SIGMENTUM_*.txt',  tool: 'Drive',         status: 'ok',  ms: 180 },
  { id: 7, label: 'Telegram',      sub: 'signal channel',   tool: 'Telegram',      status: 'ok',  ms: 94 },
];

const PERF_STATS = [
  { label: 'Signals issued',     value: '1,248',  delta: '+42 today',   tone: 'ink' },
  { label: 'Win rate',            value: '68.4%',  delta: '+1.2% WoW',   tone: 'momentum' },
  { label: 'Avg R:R',             value: '1.94',   delta: 'stable',       tone: 'ink' },
  { label: 'Active signals',      value: '7',      delta: '3 new',        tone: 'signals' },
];

const TG_MESSAGES = [
  { from: 'SIGMENTUM', ts: '09:42', kind: 'signal',
    title: 'XAU/USD · LONG · conf 84',
    body: 'Entry 2341.20 · TP1 2358 · TP2 2372 · SL 2329.80. Momentum confirmed across 1H/4H. Memo attached.',
    attach: 'SIGMENTUM_XAUUSD_2026-04-20_09-42.txt' },
  { from: 'SIGMENTUM', ts: '09:15', kind: 'signal',
    title: 'EUR/USD · LONG · conf 78',
    body: 'Range expansion into London open. EMA alignment positive. R:R 2.4.' },
  { from: 'SIGMENTUM', ts: '08:30', kind: 'watch',
    title: 'USD/JPY · WATCHING',
    body: 'Monitoring 152.60 for break + hold. Will promote to active on confirmation.' },
  { from: 'SIGMENTUM', ts: '08:12', kind: 'signal',
    title: 'WTI · SHORT · conf 68',
    body: 'Demand weakness into OPEC minutes. R:R 2.1.' },
];

const BLOG_POSTS = [
  { cat: 'Market Structure', read: '6 min', title: 'Why compressing volatility precedes breakout continuation', excerpt: 'A primer on reading volatility regimes — and how Sigmentum weights them into the confidence score.', date: 'Apr 18', hook: 'If the last five candles are narrower than the five before them, what happens next?' },
  { cat: 'Risk',              read: '4 min', title: 'Position sizing around macro event risk', excerpt: 'CPI, NFP, FOMC. How to cut size without cutting conviction.', date: 'Apr 15', hook: 'Your win rate is 70% — but one bad CPI day can wipe a month. Here\'s the math.' },
  { cat: 'Systems',           read: '8 min', title: 'From sheet to signal: our automation pipeline, explained', excerpt: 'A behind-the-scenes look at the Make → GPT → Sheets → Telegram chain powering every alert.', date: 'Apr 11', hook: 'What actually happens in the 2.67 seconds between market data and your Telegram ping?' },
  { cat: 'Education',         read: '5 min', title: 'Reading a Sigmentum signal: a field guide', excerpt: 'Bias, confidence, risk level, R:R — what each field means and how to act on it.', date: 'Apr 08', hook: 'Long / 78 / Moderate / 2.4 — four numbers that should drive every decision.' },
  { cat: 'Psychology',        read: '7 min', title: 'The 3pm rule: why most traders lose in the last hour', excerpt: 'Fatigue, revenge trades, and the neurochemistry of the final session.', date: 'Apr 04', hook: 'Why does your P&L curve collapse after 3pm — even on winning days?' },
  { cat: 'Education',         read: '9 min', title: 'RSI divergence without the charting-guru fluff', excerpt: 'What divergence actually tells you, and the three kinds worth trading.', date: 'Apr 01', hook: 'If price makes a higher high but RSI doesn\'t — is that a sell signal, or just noise?' },
];

const GLOSSARY = [
  { term: 'EMA-9 / EMA-21',    score: 94, def: 'Exponential moving averages over 9 and 21 periods. When EMA-9 crosses above EMA-21, momentum is turning constructive.', links: [{label:'Investopedia · EMA', ext:true}, {label:'See in signal →', ext:false}] },
  { term: 'RSI-14',            score: 91, def: 'Relative Strength Index, 14-period. Above 70 = overbought, below 30 = oversold. Sigmentum treats 55–70 as the momentum sweet spot.', links: [{label:'Wilder, 1978', ext:true}, {label:'RSI in our feed', ext:false}] },
  { term: 'Confidence score',  score: 97, def: 'An integer 0–100 emitted by the AI, reflecting convergence of trend, momentum, volatility, and event-risk inputs. Above 70 = tradable; above 80 = high conviction.', links: [{label:'Internal methodology', ext:false}] },
  { term: 'Bias',              score: 89, def: 'The directional stance the AI recommends: Long, Short, or Neutral. Neutral is a valid outcome when signal quality is low.', links: [{label:'Reading a signal', ext:false}] },
  { term: 'R:R (Risk:Reward)', score: 95, def: 'Ratio of potential profit to potential loss. Sigmentum targets a minimum of 1.8 across all active signals.', links: [{label:'Glossary: stop loss', ext:false}] },
  { term: 'Volatility regime', score: 86, def: 'Rolling standard deviation of returns, bucketed as compressing, expanding, or stable. The regime modulates position sizing.', links: [{label:'ATR deep dive', ext:true}] },
  { term: 'ATR',               score: 82, def: 'Average True Range — the typical size of a candle over N periods. Used for stop placement and breakout filters.', links: [{label:'Wilder, ATR', ext:true}] },
  { term: 'Drawdown',          score: 90, def: 'Peak-to-trough equity decline. A strategy with 68% win rate can still have 20%+ drawdowns — this is why sizing matters.', links: [{label:'Backtest methodology', ext:false}] },
];

const TG_LIVE_STREAM = [
  { id: 1,  delay: 0,     from: 'SIGMENTUM', ts: 'now', kind: 'signal', title: 'XAU/USD · LONG · 84', body: 'Entry 2341.20 · TP1 2358 · TP2 2372.40 · SL 2329.80 · R:R 2.9' },
  { id: 2,  delay: 4500,  from: 'SIGMENTUM', ts: '4s',  kind: 'memo',   title: '📎 Memo attached', body: 'SIGMENTUM_XAUUSD_2026-04-23_09-42.txt · 2.4 KB' },
  { id: 3,  delay: 9500,  from: 'SIGMENTUM', ts: '9s',  kind: 'watch',  title: 'USD/JPY · WATCHING', body: 'Monitoring 152.60 break. Will promote on 15m close + volume confirm.' },
  { id: 4,  delay: 15000, from: 'SIGMENTUM', ts: '15s', kind: 'signal', title: 'EUR/USD · LONG · 78', body: 'London open range expansion. Entry 1.0847 · SL 1.0821 · R:R 2.4' },
  { id: 5,  delay: 21000, from: 'SIGMENTUM', ts: '21s', kind: 'update', title: 'XAU/USD · TP1 HIT ✓', body: 'Price tagged 2358.00. Moving SL to breakeven. Let TP2 run.' },
  { id: 6,  delay: 27000, from: 'SIGMENTUM', ts: '27s', kind: 'watch',  title: 'BTC/USD · WATCHING', body: 'Approaching 71,800 resistance. Volume climbing. Stand by.' },
];

// Popup notifications that fire every ~8 seconds
const POPUP_EVENTS = [
  { kind: 'buy',    asset: 'XAU/USD', conf: 84, body: 'Momentum confirmed across 1H/4H. TP1 2358 · SL 2329.80.' },
  { kind: 'sell',   asset: 'WTI',     conf: 71, body: 'OPEC minutes bearish. Entry 82.40 · SL 83.10.' },
  { kind: 'buy',    asset: 'BTC/USD', conf: 81, body: 'Range break + volume confirm. Entry 71,420 · SL 70,810.' },
  { kind: 'update', asset: 'XAU/USD', conf: 84, body: 'TP1 hit at 2358. Moving SL to breakeven — letting TP2 run.' },
  { kind: 'sell',   asset: 'GBP/USD', conf: 68, body: 'Rejection at 1.2650. Entry 1.2634 · SL 1.2672.' },
];

// Build a plausible candle series for the hero chart
function buildCandles(n = 80, seed = 2341.2) {
  const out = [];
  let price = seed - 18;
  let t = 0;
  for (let i = 0; i < n; i++) {
    const drift = (i > n * 0.55 ? 0.35 : 0.05);
    const wobble = (Math.sin(i * 0.7) + Math.cos(i * 0.23)) * 0.8;
    const shock = (Math.random() - 0.5) * 1.4;
    const open = price;
    const change = drift + wobble * 0.35 + shock;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.9;
    const low  = Math.min(open, close) - Math.random() * 0.9;
    out.push({ t: i, o: open, h: high, l: low, c: close });
    price = close;
    t++;
  }
  return out;
}

const CANDLES = buildCandles();

function buildSpark(len = 24, trend = 1) {
  const pts = [];
  let v = 50;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * 8 + trend * 0.6;
    pts.push(Math.max(10, Math.min(90, v)));
  }
  return pts;
}

Object.assign(window, {
  ASSETS, HERO_SIGNAL, SIGNAL_FEED, REASONING_STEPS,
  PIPELINE, PERF_STATS, TG_MESSAGES, BLOG_POSTS, GLOSSARY,
  CANDLES, buildSpark,
  TG_LIVE_STREAM, POPUP_EVENTS,
});
