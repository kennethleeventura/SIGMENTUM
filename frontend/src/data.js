export const ASSETS = [
  { sym: 'EUR/USD', name: 'Euro / US Dollar',        class: 'FX',     price: 1.0847,  pct:  0.32, bias: 'Long',    conf: 78, vol: 0.64, rsi: 58 },
  { sym: 'GBP/USD', name: 'British Pound / Dollar',  class: 'FX',     price: 1.2634,  pct: -0.18, bias: 'Short',   conf: 62, vol: 0.71, rsi: 44 },
  { sym: 'USD/JPY', name: 'Dollar / Japanese Yen',   class: 'FX',     price: 152.41,  pct:  0.55, bias: 'Long',    conf: 71, vol: 0.83, rsi: 63 },
  { sym: 'AUD/USD', name: 'Australian Dollar',       class: 'FX',     price: 0.6589,  pct: -0.41, bias: 'Neutral', conf: 48, vol: 0.52, rsi: 50 },
  { sym: 'XAU/USD', name: 'Gold Spot',               class: 'Metals', price: 2341.20, pct:  1.24, bias: 'Long',    conf: 84, vol: 1.12, rsi: 67 },
  { sym: 'WTI',     name: 'Crude Oil WTI',           class: 'Energy', price: 82.47,   pct: -0.92, bias: 'Short',   conf: 68, vol: 1.45, rsi: 41 },
  { sym: 'NAS100',  name: 'NASDAQ 100',              class: 'Indices',price: 18234.5, pct:  0.76, bias: 'Long',    conf: 74, vol: 0.98, rsi: 61 },
  { sym: 'SPX500',  name: 'S&P 500',                 class: 'Indices',price: 5234.18, pct:  0.43, bias: 'Long',    conf: 66, vol: 0.68, rsi: 57 },
  { sym: 'BTC/USD', name: 'Bitcoin',                 class: 'Crypto', price: 71420,   pct:  2.14, bias: 'Long',    conf: 81, vol: 2.34, rsi: 72 },
  { sym: 'ETH/USD', name: 'Ethereum',                class: 'Crypto', price: 3580,    pct:  1.82, bias: 'Long',    conf: 73, vol: 2.10, rsi: 65 },
];

export const HERO_SIGNAL = {
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

export const SIGNAL_FEED = [
  { t: '09:42', asset: 'XAU/USD', bias: 'Long',    conf: 84, status: 'active',   pct:  1.24 },
  { t: '09:15', asset: 'EUR/USD', bias: 'Long',    conf: 78, status: 'active',   pct:  0.32 },
  { t: '08:58', asset: 'BTC/USD', bias: 'Long',    conf: 81, status: 'active',   pct:  2.14 },
  { t: '08:30', asset: 'USD/JPY', bias: 'Long',    conf: 71, status: 'watching', pct:  0.55 },
  { t: '08:12', asset: 'WTI',     bias: 'Short',   conf: 68, status: 'active',   pct: -0.92 },
  { t: '07:55', asset: 'GBP/USD', bias: 'Short',   conf: 62, status: 'closed-w', pct: -0.18 },
  { t: '07:20', asset: 'NAS100',  bias: 'Long',    conf: 74, status: 'active',   pct:  0.76 },
  { t: '06:48', asset: 'ETH/USD', bias: 'Long',    conf: 73, status: 'watching', pct:  1.82 },
  { t: '06:15', asset: 'AUD/USD', bias: 'Neutral', conf: 48, status: 'hold',     pct: -0.41 },
  { t: '05:42', asset: 'SPX500',  bias: 'Long',    conf: 66, status: 'closed-w', pct:  0.43 },
];

export const REASONING_STEPS = [
  {
    tag: 'MARKET READ',
    icon: '◎',
    text: 'Gold is trending above both its short and long-term averages. EMA-9 (2338.4) is above EMA-21 (2331.8) — the short-term trend is leading the medium-term upward. Price has not closed below EMA-21 in 6 sessions.',
  },
  {
    tag: 'PATTERN DETECTED',
    icon: '◈',
    text: 'Bullish continuation: 4H candle range expanded +14% above its 5-session average with RSI at 67 — in the momentum sweet spot, not yet overbought. No divergence between price and RSI at this high.',
  },
  {
    tag: 'RISK ASSESSMENT',
    icon: '⚠',
    text: 'CPI release in 36 hours triggers an event-risk flag. Technical read is valid, but binary macro events can override structure. Position size is reduced by 50%. Stop is widened by 0.5× ATR to survive pre-event volatility.',
  },
  {
    tag: 'CONVICTION CHECK',
    icon: '◆',
    text: '3 of 4 scoring inputs align bullish — Trend (88), Momentum (76), Volatility (62), Event Risk (55). The event overlay is the only drag. Final confidence: 84 — above the 80 high-conviction threshold.',
  },
  {
    tag: 'TRADE DECISION',
    icon: '→',
    text: 'Long XAU/USD at market (2341.20). Take partial profit at TP1 (2358) and move stop to breakeven. Let the remainder run to TP2 (2372.40). Stop at 2329.80 — below the zone boundary. R:R: 2.9.',
  },
];

export const SIGNAL_FACTORS = {
  trend:     { label: 'Trend Alignment',   score: 88, color: 'var(--green)',  icon: '↗', what: 'EMA-9 crossed above EMA-21 and price is trading above both averages. Short-term momentum is leading medium-term momentum upward.', impact: 'Bullish — adds conviction. Clean EMA alignment with no recent cross-back.', tip: 'Measures whether short and long-term moving averages point in the same direction as the signal bias. The greater the separation, the stronger the trend.' },
  momentum:  { label: 'Momentum Quality',  score: 76, color: 'var(--green)',  icon: '⚡', what: 'RSI-14 is at 67 — in the momentum sweet spot (55–70). The move has energy but is not overbought. No bearish divergence at the current high.', impact: 'Bullish — ideal entry zone. RSI below 70 means there is still upside before exhaustion.', tip: 'Uses RSI to measure whether a move has energy. 55–70 is the ideal zone for new long entries — strong but with room to run before hitting overbought territory.' },
  volatility:{ label: 'Volatility Regime', score: 62, color: 'var(--orange)', icon: '◈', what: 'ATR is expanding — candle range grew +14% vs the 5-session average. The market is becoming more active. Good for breakout follow-through, but demands a wider stop.', impact: 'Mixed — expanding volatility increases follow-through probability but stop distance.', tip: 'Tracks whether daily candle sizes are compressing (coiling for a move) or expanding (already in motion). Compressing = cleaner entries with tighter stops.' },
  event:     { label: 'Event Risk',        score: 55, color: 'var(--orange)', icon: '⚠', what: 'CPI data releases in 36 hours. Binary macro events can move price beyond any technical level regardless of signal strength. Size is cut in half.', impact: 'Risk-negative — confidence capped at 75 on event weeks. Half-position sizing recommended.', tip: 'Measures proximity of major macro releases (CPI, NFP, FOMC). These events override technical structure. Sigmentum never issues full-size signals within 4 hours of a tier-1 event.' },
};

export const PIPELINE = [
  { id: 1, label: 'Scheduler',    sub: 'every 15 min',   tool: 'make.com',      status: 'ok',      ms: 12   },
  { id: 2, label: 'Sheets',       sub: 'SIGNAL_LOG',      tool: 'Google Sheets', status: 'ok',      ms: 340  },
  { id: 3, label: 'GPT-4o',       sub: 'reasoning pass',  tool: 'OpenAI',        status: 'working', ms: 1820 },
  { id: 4, label: 'Parse JSON',   sub: 'schema validate', tool: 'internal',      status: 'ok',      ms: 6    },
  { id: 5, label: 'Sheets write', sub: 'GPT Output',      tool: 'Google Sheets', status: 'ok',      ms: 220  },
  { id: 6, label: 'Memo file',    sub: 'SIGMENTUM_*.txt', tool: 'Drive',         status: 'ok',      ms: 180  },
  { id: 7, label: 'Telegram',     sub: 'signal channel',  tool: 'Telegram',      status: 'ok',      ms: 94   },
];

export const PERF_STATS = [
  { label: 'Signals issued', value: '1,248', delta: '+42 today',  tone: 'ink' },
  { label: 'Win rate',        value: '68.4%', delta: '+1.2% WoW', tone: 'momentum' },
  { label: 'Avg R:R',         value: '1.94',  delta: 'stable',    tone: 'ink' },
  { label: 'Active signals',  value: '7',     delta: '3 new',     tone: 'signals' },
];

export const TG_MESSAGES = [
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

export const BLOG_POSTS = [
  {
    cat: 'Market Structure', read: '6 min', date: 'Apr 18',
    title: 'Why compressing volatility precedes breakout continuation',
    hook: 'If the last five candles are narrower than the five before them, what happens next?',
    excerpt: 'A primer on reading volatility regimes — and how Sigmentum weights them into the confidence score.',
    body: `Volatility compression is one of the most reliable precursors to directional expansion in liquid markets. When the Average True Range shrinks over five or more consecutive sessions, market participants are building positions in relative silence — a coil that eventually releases.

Sigmentum's volatility regime module computes a rolling Z-score of ATR against its 20-session baseline. When that Z-score falls below −0.8, the system flags a "compressing" regime and increases the weight given to momentum indicators in the confidence calculation. The logic: in a compressing market, a breakout backed by RSI momentum and EMA alignment is structurally stronger than the same signal in an expanding, noisy environment.

The practical implication is position timing rather than direction. A Long signal with confidence 78 in a compressing regime is not the same trade as confidence 78 in an expanding one. The former often offers a cleaner entry with a tighter stop, because the recent range defines the failure point precisely. The latter requires wider stops to survive noise, which mathematically compresses the R:R ratio even before you place the trade.

Three things to watch when volatility compresses: (1) volume profile — is it accumulating or distributing? (2) where price is relative to the EMA stack — near or extended? (3) the macro calendar — compression ahead of CPI or NFP is different from compression mid-week. The first two are structural; the third is event risk that can release the coil violently in either direction.

Sigmentum accounts for all three. When the system emits a signal during a compressing regime, the risk level field reflects the event overlay — which is why two signals with identical confidence scores can carry different risk classifications.`,
  },
  {
    cat: 'Risk', read: '4 min', date: 'Apr 15',
    title: 'Position sizing around macro event risk',
    hook: "Your win rate is 70% — but one bad CPI day can wipe a month. Here's the math.",
    excerpt: 'CPI, NFP, FOMC. How to cut size without cutting conviction.',
    body: `Event risk is the category of risk that does not respect technical structure. CPI, Non-Farm Payrolls, FOMC decisions — these are binary moments where the market can gap through every level on your chart in seconds. A technically correct trade, properly sized for normal volatility, can be catastrophically wrong on an event day.

The standard approach is to reduce size, but the question is by how much. A useful framework: estimate the expected move (EM) implied by options pricing for the event, then size your position so that if price moves the full EM against you, you lose no more than 1% of capital. For a typical NFP, that often means cutting size by 50–70% versus your baseline.

Sigmentum's risk level field — Low, Moderate, or High — encodes this automatically. "High" means an active macro event falls within the signal's relevant window. When you see High risk on a signal, the system is telling you that the event overlay overrides the technical read, regardless of how high the confidence score is.

The key mistake to avoid: treating a high-confidence signal as a high-conviction trade on event day. Conviction is a function of your edge. On event day, your edge is structurally impaired. The position size should reflect that — and separately, so should your stop placement, because gaps through stops are real.`,
  },
  {
    cat: 'Systems', read: '8 min', date: 'Apr 11',
    title: 'From sheet to signal: our automation pipeline, explained',
    hook: 'What actually happens in the 2.67 seconds between market data and your Telegram ping?',
    excerpt: 'A behind-the-scenes look at the Make → GPT → Sheets → Telegram chain powering every alert.',
    body: `Every Sigmentum signal starts with a Google Sheet. Market data — close price, percent change, EMA-9, EMA-21, RSI-14, volatility, and range — is written to a "Historical Metrics" tab by a scheduled data fetch. That write triggers the Make.com automation.

Make pulls the latest row, formats it as a structured prompt, and sends it to GPT-4o with a system instruction that constrains the model to return valid JSON only. The schema includes headline, bias, confidence, AI reasoning, risk level, risk rationale, and action summary. Critically, the model is told that confidence is an integer from 0 to 100 and that reasoning is capped at three sentences — this makes the output predictable and parseable downstream.

The JSON response is validated, then written back to a "Signals" sheet tab. A separate Make scenario watches that tab, formats the signal into a Telegram message using Markdown, and sends it to the SIGMENTUM channel. The whole chain, when running smoothly, completes in under three seconds from data ingestion to message delivery.

Two failure modes to be aware of: (1) GPT occasionally returns malformed JSON despite the system prompt — the pipeline handles this with a retry module that catches non-200 responses and re-runs the completion. (2) Telegram rate limits messages at roughly one per second per bot — for simultaneous multi-asset signals, the pipeline queues with a 1.2-second delay between sends.

The design principle throughout is immutability of the signal record. Once written to the Signals sheet, a signal is never modified — updates (TP1 hit, SL moved, closed) are appended as new rows with a status field. This creates a full audit trail of every decision the system made and why.`,
  },
  {
    cat: 'Education', read: '5 min', date: 'Apr 08',
    title: 'Reading a Sigmentum signal: a field guide',
    hook: 'Long / 78 / Moderate / 2.4 — four numbers that should drive every decision.',
    excerpt: 'Bias, confidence, risk level, R:R — what each field means and how to act on it.',
    body: `Every Sigmentum signal contains six fields. Understanding what each one means — and how they interact — is the difference between using the system well and using it blindly.

**Bias** is the directional stance: Long, Short, or Neutral. Neutral is not an error — it is a valid output when the AI determines that signal quality is too low to recommend a direction. Neutral signals should not be traded. They are information about the current market state: unclear, contested, or at a structural inflection point.

**Confidence** is an integer from 0 to 100 reflecting convergence across trend, momentum, volatility, and event-risk inputs. Above 70 is tradable. Above 80 is high conviction. Below 65 should generally be passed. The number is not a probability of success — it is a measure of how much the indicators agree with each other.

**Risk level** — Low, Moderate, or High — is the event-risk overlay. Low means the technical read is clean and no significant macro events fall within the signal window. High means the opposite. Risk level gates position size, not participation. A High-risk signal is not one to skip; it is one to size at 50% or less of your baseline.

**Entry, TP1, TP2, SL** define the trade geometry. TP1 is the first take-profit target — the point at which you should move your stop to breakeven and let TP2 run. Never remove TP1 because you expect TP2. Taking partial profit is not weakness; it is how you survive the trade that goes to TP1, reverses, and would have stopped you out.

**R:R** is the ratio of (TP2 − Entry) to (Entry − SL). Sigmentum targets a minimum of 1.8 across all active signals. If the geometric R:R is below 1.5, the system will not emit the signal regardless of confidence. Asymmetry is non-negotiable.`,
  },
  {
    cat: 'Psychology', read: '7 min', date: 'Apr 04',
    title: 'The 3pm rule: why most traders lose in the last hour',
    hook: 'Why does your P&L curve collapse after 3pm — even on winning days?',
    excerpt: 'Fatigue, revenge trades, and the neurochemistry of the final session.',
    body: `The last hour of the trading session — roughly 3pm to 4pm EST in US markets — is statistically the worst hour for retail traders and statistically one of the best hours for institutional desks. The divergence is not random. It is a direct product of decision fatigue, loss aversion, and the liquidity dynamics of the market close.

Decision fatigue is real and measurable. After six or more hours of screen time, the prefrontal cortex — the part of the brain responsible for impulse control and probabilistic reasoning — shows measurably lower activity. Traders become more reactive and less analytical. They take setups they would have rejected at 9:30am. They size up on losing positions they should have closed. They revenge-trade.

The 3pm hour is also when institutional desks rebalance for the close, creating price movements that have nothing to do with the technical signals that drove the morning session. Retail traders interpret these moves as confirmation of theses that are already dead. The market obliges them with a spike in their direction, then reverses violently at 3:55pm when the institutional order flow completes.

Three practical rules: (1) Conduct a P&L check at 2:45pm. If you are up on the day, reduce size for all remaining trades by 50%. If you are down significantly, consider closing everything and ending the session — the statistical expectation of recovering losses in the final hour is negative for most traders. (2) Do not open new positions after 3:30pm unless the setup was identified before 2pm. The last-hour setups are the ones that feel most compelling and are most dangerous. (3) Log every trade you take after 3pm for one month. The data will tell you what to do.`,
  },
  {
    cat: 'Education', read: '9 min', date: 'Apr 01',
    title: 'RSI divergence without the charting-guru fluff',
    hook: "If price makes a higher high but RSI doesn't — is that a sell signal, or just noise?",
    excerpt: "What divergence actually tells you, and the three kinds worth trading.",
    body: `RSI divergence is one of the most discussed concepts in technical analysis and one of the most consistently misapplied. The core idea is simple: when price makes a new high (or low) but RSI does not confirm it, the momentum behind the move is weakening. But "weakening momentum" is not the same as "reversal imminent," and conflating the two is where most traders lose money.

There are three types of divergence worth understanding. Classic (or regular) divergence: price makes a higher high, RSI makes a lower high. This signals momentum deterioration but not necessarily reversal. It is most reliable after an extended trend, at a known resistance level, and when RSI is above 70. All three conditions together — trend extension, structural resistance, overbought RSI — make it a tradeable signal. Any one condition alone does not.

Hidden divergence is the less-discussed counterpart: price makes a higher low, RSI makes a lower low. This signals trend continuation, not reversal. When you see hidden bullish divergence in an uptrend, the market is telling you the pullback is weak and the trend is likely to resume. This is a signal to add to existing positions or initiate new ones in the direction of the trend.

Exaggerated divergence — where the RSI move is extreme relative to the price move — is the rarest and most powerful. It appears at major inflection points and is best read in conjunction with volume and volatility data, not independently.

Sigmentum's RSI weighting reflects this nuance. The system treats RSI above 70 in a trending market differently from RSI above 70 at the start of a move. Divergence alone does not reduce the confidence score significantly — it reduces the score in combination with other indicators that suggest exhaustion. The AI is looking for convergence of weakness signals, not a single data point.`,
  },
  {
    cat: 'Market Structure', read: '5 min', date: 'Mar 28',
    title: 'Support, resistance, and why levels are zones, not lines',
    hook: "You drew the line at 2,338. Price hit 2,341 and reversed. Was the level broken?",
    excerpt: 'Why treating support and resistance as precise prices destroys otherwise good trades.',
    body: `The most common mistake in charting is precision. Traders draw a horizontal line at a specific price — say 2,338 on Gold — and treat it as a binary: above the line is clear, below the line is broken. The market does not respect this binary. What the market respects is zones of liquidity, and those zones have width.

A level is where significant buying or selling previously occurred. The price at which that activity happened is never exact — it is distributed across a range of prices that represents the aggregate execution of many participants across multiple candles. When price returns to that zone, the same participants become active, but not at a single price. They scale in, scale out, defend their levels at different points within the zone.

For most liquid assets, a usable zone width is 0.3% to 0.5% of price. For Gold at 2,338, that is roughly ±7 to ±12 points. A move to 2,341 that reverses is not a breakout — it is the top of the zone. A move to 2,350 that reverses is a more interesting case: either the zone held at its extreme, or the level has shifted upward.

Sigmentum's entry prices are set at the center of the zone, and the stop loss is set below the bottom of it. This is why the SL sometimes looks slightly wide relative to the entry: it is placed at the point where, if hit, the zone has structurally failed. A stop at the center of the zone is an invitation to be stopped out before the actual failure.`,
  },
  {
    cat: 'Systems', read: '6 min', date: 'Mar 24',
    title: 'How we score confidence: the four-input model',
    hook: 'Trend, momentum, volatility, event risk — not equally weighted, and here is why.',
    excerpt: 'A transparent look at the methodology behind every confidence integer we emit.',
    body: `The confidence score that appears on every Sigmentum signal is not a single calculation — it is the output of a four-input model that weights trend alignment, momentum quality, volatility regime, and event risk. Each input contributes differently depending on market conditions.

Trend alignment (40% base weight) measures whether price is above or below the EMA stack, whether the short-term EMA has crossed the long-term, and how extended price is from the mean. A signal fired when price is extended 2+ ATRs from the EMA cluster receives a trend alignment penalty even if the direction is correct. Extension means risk; the best trend trades happen near the trend, not far from it.

Momentum quality (30% base weight) is primarily RSI, but with context. RSI at 65 in an uptrend is not the same as RSI at 65 in a downtrend. The model adjusts for the directional context and for divergence — if RSI and price are moving in opposite directions at a recent swing, momentum quality is discounted.

Volatility regime (20% base weight) determines whether the current environment is favorable for the signal type. Breakout signals receive a premium in compressing regimes; mean-reversion signals receive a premium in expanding regimes. A breakout signal in an already-expanding regime is a chasing signal and receives a penalty.

Event risk (10% base weight, but with a hard cap) is the macro calendar overlay. When a tier-1 event (CPI, NFP, FOMC, central bank decision) falls within 4 hours of signal generation, the confidence score is capped at 75 regardless of the raw calculation. This is not a bug — it is a design decision that reflects the reality that technical models do not predict binary macro outcomes.`,
  },
  {
    cat: 'Risk', read: '5 min', date: 'Mar 20',
    title: 'The Kelly Criterion, simplified for active traders',
    hook: 'Optimal bet sizing is not "always risk 1%." It depends on your actual edge.',
    excerpt: 'What Kelly actually says — and the half-Kelly adjustment every discretionary trader should use.',
    body: `The Kelly Criterion is a formula for optimal position sizing derived from information theory. The full Kelly formula is: f = (bp − q) / b, where b is the net odds (R:R), p is the probability of winning, and q is the probability of losing. For a trade with 60% win rate and 2:1 R:R, full Kelly suggests sizing at 20% of capital per trade.

That is almost certainly too much. The Kelly formula assumes you know your exact win rate and R:R with certainty. You do not. Your historical win rate is an estimate. Your expected R:R is an assumption about future market behavior. The formula amplifies estimation error. A trader who uses full Kelly and has slightly overestimated their edge will experience drawdowns that are psychologically unmanageable and mathematically ruinous.

The practical adjustment is half-Kelly: use 50% of the Kelly-optimal size. Half-Kelly reduces the expected growth rate only modestly — roughly 25% less than full Kelly in theory — while dramatically reducing variance. The size of your worst drawdowns under half-Kelly is roughly half what it would be under full Kelly. For traders who need to remain psychologically stable to execute, that matters more than the theoretical optimum.

For Sigmentum signals specifically: the system's minimum R:R of 1.8 and average confidence above 70 (implying approximately 60%+ win rate on high-confidence signals) suggests a half-Kelly baseline of approximately 1.5–2% of capital per trade. This aligns with the "1% risk" heuristic that most professional risk management frameworks use — which is not arbitrary but is roughly consistent with half-Kelly for a reasonable edge.`,
  },
  {
    cat: 'Psychology', read: '6 min', date: 'Mar 16',
    title: 'Keeping a trade journal that actually improves your performance',
    hook: 'Most trade journals are P&L logs. A real journal asks why — and that is harder.',
    excerpt: 'What to log, how to review it, and the three patterns that predict long-run consistency.',
    body: `A trade journal that logs only entry price, exit price, and P&L is an accounting spreadsheet, not a performance tool. The purpose of a journal is to make your decision process visible to yourself so you can identify patterns — both useful ones and destructive ones.

The minimum useful journal entry has four fields beyond the basics: (1) Why did you enter? Not "setup looked good." The specific criteria that were met. If you cannot write them down in 30 seconds, you did not have a thesis. (2) What was your original stop, and did you move it? If you moved it — when, why, and did that decision improve or worsen the outcome? (3) What was your emotional state at entry? At exit? This is the one most traders skip and the one most predictive of performance variance. (4) What would you do differently?

After 50 entries, patterns become visible. The three that most consistently predict long-run consistency: first, whether you stick to your stated stop level — traders who move stops against themselves more than 20% of the time have a characteristic drawdown pattern that compounds over time. Second, whether your best trades come from your highest-confidence setups or your highest-excitement setups — these are often not the same. Third, time of day — most discretionary traders have a specific session window where their decision quality is highest. Outside that window, performance degrades.

Sigmentum's signal log is designed to pair with a personal journal. The signal provides the objective read; your journal captures what you did with it and why. The synthesis of the two is what improves over time.`,
  },
  {
    cat: 'Market Structure', read: '7 min', date: 'Mar 12',
    title: 'The London session edge: why the first two hours matter most',
    hook: 'Between 8am and 10am London time, institutional capital moves. Are you positioned for it?',
    excerpt: 'Session overlap, liquidity windows, and how to align your timing with the flow.',
    body: `The foreign exchange and metals markets operate 24 hours a day, but liquidity — the actual willingness of large participants to transact at visible prices — is concentrated in specific windows. The London session open (8am–10am GMT) is the highest-liquidity window of the global trading day for most FX pairs and Gold, and it is where the majority of the daily range is set.

The reason is structural. London is the largest FX trading hub in the world, accounting for roughly 38% of global volume. When London opens, banks, hedge funds, and institutional desks that have been holding positions from the Asian session — or establishing new positions based on overnight news — become active simultaneously. The price discovery that happens in those two hours reflects genuine institutional order flow, not the thin, easily-manipulated markets of the Tokyo session.

Practically, this means two things. First, breakouts that occur in the London open window with volume confirmation are more reliable than the same technical pattern at any other time of day. The volume behind the move is real. Second, "London session traps" — false breakouts in the first 15–30 minutes — are a known institutional strategy for taking out retail stops before the real move begins. A signal that triggers in the first 15 minutes of London should be entered only after a clean candle close, not on the initial print.

Sigmentum's signal timing reflects session awareness. The system logs the session at the time of generation and adjusts confidence weighting accordingly. A breakout signal generated during London active hours receives a higher baseline than the same signal generated at 2am EST.`,
  },
  {
    cat: 'Education', read: '4 min', date: 'Mar 08',
    title: 'What "breakeven" actually means — and when to move your stop',
    hook: 'Moving to breakeven too early costs you more trades than a wide stop ever did.',
    excerpt: 'The mechanics of breakeven stops, when they help, and when they hurt.',
    body: `"Move to breakeven" is the most frequently given and least precisely defined piece of trading advice. Breakeven means your stop is at your entry price. If the trade reverses from there, you exit with zero gain and zero loss. This sounds safe — and in one sense it is. But the timing of when you move to breakeven determines whether it helps or hurts your overall expectancy.

The mistake is moving to breakeven too quickly, before the trade has enough room to work. If you move your stop to entry after price moves 0.5 ATR in your favor, you are creating a very tight stop in a position that still has normal market noise to deal with. The result: you get stopped out at breakeven repeatedly on trades that would have gone to TP1 if you had given them room.

The right trigger for moving to breakeven is TP1. When price reaches your first take-profit target, two things have happened: (1) the trade has proved itself — the directional thesis was correct over a meaningful range of price; (2) you have locked in a partial win if you took profit at TP1. At that point, moving to breakeven on the remainder is not sacrificing the trade — it is free-rolling the second target. If price reverses from TP1 to entry, you exit flat on the runner while having already captured TP1.

Sigmentum's signal structure is designed around this mechanic. TP1 is set at the point where moving to breakeven is rational: far enough that the trade has proven itself, close enough that there is still meaningful room to TP2. The system assumes you take partial profit at TP1 and move the stop — because that is what the R:R calculation assumes.`,
  },
];

export const GLOSSARY = [
  { term: 'EMA-9 / EMA-21',     score: 94, def: 'Exponential moving averages over 9 and 21 periods. When EMA-9 crosses above EMA-21, momentum is turning constructive. The gap between them measures trend strength.', links: [{label:'See in signal feed', ext:false}] },
  { term: 'RSI-14',              score: 91, def: 'Relative Strength Index, 14-period. Above 70 = overbought, below 30 = oversold. Sigmentum treats 55–70 as the momentum sweet spot for new Long entries.', links: [{label:'RSI divergence guide', ext:false}] },
  { term: 'Confidence score',    score: 97, def: 'An integer 0–100 emitted by the AI, reflecting convergence of trend, momentum, volatility, and event-risk inputs. Above 70 = tradable; above 80 = high conviction. Not a probability of success.', links: [{label:'How we score confidence', ext:false}] },
  { term: 'Bias',                score: 89, def: 'The directional stance the AI recommends: Long, Short, or Neutral. Neutral is a valid output when signal quality is insufficient. Do not trade a Neutral signal.', links: [{label:'Reading a signal', ext:false}] },
  { term: 'R:R (Risk:Reward)',   score: 95, def: 'Ratio of potential profit to potential loss, measured to TP2. Sigmentum requires a minimum of 1.8 across all active signals. Below 1.5, the system suppresses the signal regardless of confidence.', links: [{label:'Kelly Criterion guide', ext:false}] },
  { term: 'Volatility regime',   score: 86, def: 'Rolling standard deviation of returns, bucketed as compressing, expanding, or stable. The regime modulates confidence weighting — breakout signals score higher in compressing environments.', links: [{label:'Volatility compression guide', ext:false}] },
  { term: 'ATR',                 score: 82, def: 'Average True Range — the average candle size over N periods. Used for stop placement (stops go 1× ATR beyond the zone boundary) and breakout filters (volume must exceed 1.2× average on the breakout candle).', links: [{label:'Support/resistance guide', ext:false}] },
  { term: 'Drawdown',            score: 90, def: 'Peak-to-trough equity decline. A strategy with 68% win rate can still have 20%+ drawdowns depending on position sizing and loss clustering. Managing drawdown is primarily a sizing problem, not a win rate problem.', links: [{label:'Kelly Criterion guide', ext:false}] },
  { term: 'TP1 / TP2',          score: 88, def: 'First and second take-profit targets. TP1 is where you take partial profit and move your stop to breakeven. TP2 is where you close the remaining position. Never skip TP1 in anticipation of TP2.', links: [{label:'Breakeven stop guide', ext:false}] },
  { term: 'Stop loss (SL)',      score: 93, def: 'The price level at which the trade thesis is structurally invalid. Set at the zone boundary, not at a round number. Moving a stop loss against your position is the single most correlated behavior with long-term unprofitability.', links: [{label:'Position sizing guide', ext:false}] },
  { term: 'London open',         score: 85, def: '8am–10am GMT. The highest-liquidity window of the global trading day for FX and metals. Breakouts during this window with volume confirmation carry significantly higher follow-through rates than the same pattern at other times.', links: [{label:'London session guide', ext:false}] },
  { term: 'Event risk',          score: 87, def: 'Binary macro events — CPI, NFP, FOMC — that can move price beyond technical structure. Sigmentum flags these in the risk level field and caps confidence at 75 when one falls within 4 hours of signal generation.', links: [{label:'Event risk sizing guide', ext:false}] },
  { term: 'Divergence',          score: 83, def: 'When price and RSI move in opposite directions at a swing point. Classic divergence signals momentum deterioration; hidden divergence signals trend continuation. Most reliable when combined with structural levels and extreme RSI readings.', links: [{label:'RSI divergence guide', ext:false}] },
  { term: 'Breakeven stop',      score: 84, def: 'Stop loss moved to the entry price after TP1 is reached. Allows the remaining position to run to TP2 with zero downside risk. Should be triggered at TP1, not before — moving to breakeven too early is a primary cause of premature stop-outs.', links: [{label:'Breakeven stop guide', ext:false}] },
  { term: 'Half-Kelly sizing',   score: 80, def: 'Position sizing at 50% of the Kelly-optimal fraction. Dramatically reduces variance while sacrificing only ~25% of theoretical growth rate. The practical target is 1.5–2% of capital at risk per signal, consistent with Sigmentum\'s default risk model.', links: [{label:'Kelly Criterion guide', ext:false}] },
];

export const TG_LIVE_STREAM = [
  { id: 1, delay: 0,     from: 'SIGMENTUM', ts: 'now', kind: 'signal', title: 'XAU/USD · LONG · 84', body: 'Entry 2341.20 · TP1 2358 · TP2 2372.40 · SL 2329.80 · R:R 2.9' },
  { id: 2, delay: 4500,  from: 'SIGMENTUM', ts: '4s',  kind: 'memo',   title: '📎 Memo attached', body: 'SIGMENTUM_XAUUSD_2026-04-23_09-42.txt · 2.4 KB' },
  { id: 3, delay: 9500,  from: 'SIGMENTUM', ts: '9s',  kind: 'watch',  title: 'USD/JPY · WATCHING', body: 'Monitoring 152.60 break. Will promote on 15m close + volume confirm.' },
  { id: 4, delay: 15000, from: 'SIGMENTUM', ts: '15s', kind: 'signal', title: 'EUR/USD · LONG · 78', body: 'London open range expansion. Entry 1.0847 · SL 1.0821 · R:R 2.4' },
  { id: 5, delay: 21000, from: 'SIGMENTUM', ts: '21s', kind: 'update', title: 'XAU/USD · TP1 HIT ✓', body: 'Price tagged 2358.00. Moving SL to breakeven. Let TP2 run.' },
  { id: 6, delay: 27000, from: 'SIGMENTUM', ts: '27s', kind: 'watch',  title: 'BTC/USD · WATCHING', body: 'Approaching 71,800 resistance. Volume climbing. Stand by.' },
];

export const POPUP_EVENTS = [
  { kind: 'buy',    asset: 'XAU/USD', conf: 84, body: 'Momentum confirmed across 1H/4H. TP1 2358 · SL 2329.80.' },
  { kind: 'sell',   asset: 'WTI',     conf: 71, body: 'OPEC minutes bearish. Entry 82.40 · SL 83.10.' },
  { kind: 'buy',    asset: 'BTC/USD', conf: 81, body: 'Range break + volume confirm. Entry 71,420 · SL 70,810.' },
  { kind: 'update', asset: 'XAU/USD', conf: 84, body: 'TP1 hit at 2358. Moving SL to breakeven — letting TP2 run.' },
  { kind: 'sell',   asset: 'GBP/USD', conf: 68, body: 'Rejection at 1.2650. Entry 1.2634 · SL 1.2672.' },
];

export function buildCandles(n = 80, seed = 2341.2) {
  const out = [];
  let price = seed - 18;
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
  }
  return out;
}

export const CANDLES = buildCandles();

export function buildSpark(len = 24, trend = 1) {
  const pts = [];
  let v = 50;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * 8 + trend * 0.6;
    pts.push(Math.max(10, Math.min(90, v)));
  }
  return pts;
}
