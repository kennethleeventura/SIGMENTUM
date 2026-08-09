// Sourced from frontend/src/data.js — keep in sync
// slug: URL-safe identifier for /glossary/{slug}

export const GLOSSARY = [
  {
    slug: 'ema-9-ema-21',
    term: 'EMA-9 / EMA-21',
    score: 94,
    def: 'Exponential moving averages over 9 and 21 periods. When EMA-9 crosses above EMA-21, momentum is turning constructive. The gap between them measures trend strength.',
    detail: 'EMA-9 and EMA-21 are the two moving averages Sigmentum checks first on every signal. The cross is the event; the spread is the confirmation. A widening gap after a cross means the short-term momentum is accelerating, not stalling. A narrowing gap warns that the trend may be losing energy before a reversal.',
    seoDesc: 'Learn what EMA-9 and EMA-21 mean in trading and how Sigmentum uses the crossover to generate AI trading signals.',
  },
  {
    slug: 'rsi-14',
    term: 'RSI-14',
    score: 91,
    def: 'Relative Strength Index, 14-period. Above 70 = overbought, below 30 = oversold. Sigmentum treats 55–70 as the momentum sweet spot for new Long entries.',
    detail: 'RSI is a bounded oscillator that tells you how fast price has moved relative to its recent history. The standard interpretation (above 70 = overbought) is useful but incomplete. For trend-following signals, entering at RSI 65 in an uptrend is often more reliable than waiting for RSI to dip below 50 first — because in a strong trend, RSI rarely returns to "cheap" levels.',
    seoDesc: 'RSI-14 explained: what the Relative Strength Index measures, what the 55–70 sweet spot means, and how Sigmentum weights it in the confidence score.',
  },
  {
    slug: 'confidence-score',
    term: 'Confidence score',
    score: 97,
    def: 'An integer 0–100 emitted by the AI, reflecting convergence of trend, momentum, volatility, and event-risk inputs. Above 70 = tradable; above 80 = high conviction. Not a probability of success.',
    detail: 'The confidence score is not a win-rate prediction. It measures how consistently four inputs — trend alignment, momentum quality, volatility regime, and event risk — point in the same direction. A score of 84 means three of the four inputs are strongly aligned, with the fourth contributing positively. A score of 55 means the inputs are split and the signal should not be taken.',
    seoDesc: 'What is a Sigmentum confidence score? How the 0–100 AI confidence rating is calculated across trend, momentum, volatility, and event-risk inputs.',
  },
  {
    slug: 'bias',
    term: 'Bias',
    score: 89,
    def: 'The directional stance the AI recommends: Long, Short, or Neutral. Neutral is a valid output when signal quality is insufficient. Do not trade a Neutral signal.',
    detail: 'Bias is the first field to read on any signal. Long means the AI sees a better-than-threshold probability that price rises from the entry point. Short means the inverse. Neutral is information, not silence — it means the four inputs are in conflict or the market is at a structural inflection where the direction is genuinely uncertain. Neutral signals are correct not to take.',
    seoDesc: 'What "bias" means in a Sigmentum signal — Long, Short, and Neutral explained, and how to interpret each for trading decisions.',
  },
  {
    slug: 'rr-risk-reward',
    term: 'R:R (Risk:Reward)',
    score: 95,
    def: 'Ratio of potential profit to potential loss, measured to TP2. Sigmentum requires a minimum of 1.8 across all active signals. Below 1.5, the system suppresses the signal regardless of confidence.',
    detail: 'R:R is calculated as (TP2 − Entry) ÷ (Entry − SL). Sigmentum never emits a signal with R:R below 1.5. The minimum of 1.8 is a structural requirement because it sets the floor at which a strategy with a 45% win rate still generates positive expectancy. At R:R 2.0+, a 40% win rate generates positive expectancy — meaning the system tolerates more signal misses without the account declining.',
    seoDesc: 'Risk:reward ratio in trading: what R:R means, how to calculate it, and why Sigmentum requires a minimum of 1.8 before emitting any signal.',
  },
  {
    slug: 'volatility-regime',
    term: 'Volatility regime',
    score: 86,
    def: 'Rolling standard deviation of returns, bucketed as compressing, expanding, or stable. The regime modulates confidence weighting — breakout signals score higher in compressing environments.',
    detail: 'A compressing regime means recent candles are narrower than the historical average — the market is coiling. Breakout signals in a compressing regime follow through more reliably because the directional move is releasing stored energy. An expanding regime means the market is already moving — breakout signals in this environment are often chasing, and the expected R:R degrades because stops must be wider to survive the existing noise.',
    seoDesc: 'Volatility regime in trading: what compressing and expanding volatility means and how it affects Sigmentum signal confidence weighting.',
  },
  {
    slug: 'atr',
    term: 'ATR',
    score: 82,
    def: 'Average True Range — the average candle size over N periods. Used for stop placement (stops go 1× ATR beyond the zone boundary) and breakout filters (volume must exceed 1.2× average on the breakout candle).',
    detail: 'True Range on any given candle is the largest of: (High − Low), (High − Previous Close), (Previous Close − Low). ATR averages these over 14 periods by default. Sigmentum uses ATR in two places: stop loss placement (1× ATR beyond the structural zone boundary, not a round number) and breakout validation (volume above 1.2× average ATR signals that institutional participants are behind the move).',
    seoDesc: 'Average True Range (ATR) explained: what ATR measures, how it is calculated, and how Sigmentum uses it for stop placement and signal filtering.',
  },
  {
    slug: 'drawdown',
    term: 'Drawdown',
    score: 90,
    def: 'Peak-to-trough equity decline. A strategy with 68% win rate can still have 20%+ drawdowns depending on position sizing and loss clustering. Managing drawdown is primarily a sizing problem, not a win rate problem.',
    detail: 'Maximum drawdown is the largest percentage decline from an equity peak to the subsequent trough before a new peak is reached. Sequence of returns matters enormously: six consecutive losses at 2% risk each produces a 12% drawdown. The same six losses spread across 30 trades at 0.5% risk produce a 3% drawdown from the same signals. The signals did not change; the sizing did.',
    seoDesc: 'Trading drawdown explained: what maximum drawdown means, why it matters more than win rate, and how position sizing controls it.',
  },
  {
    slug: 'tp1-tp2',
    term: 'TP1 / TP2',
    score: 88,
    def: 'First and second take-profit targets. TP1 is where you take partial profit and move your stop to breakeven. TP2 is where you close the remaining position. Never skip TP1 in anticipation of TP2.',
    detail: 'TP1 is typically set at the first major resistance level or at 40–50% of the full TP2 distance. It serves two functions: locking in partial profit, and establishing the trigger for moving the stop to breakeven on the remainder. The move to breakeven after TP1 eliminates the losing scenario on the remainder of the position, turning it into a free trade.',
    seoDesc: 'TP1 and TP2 in trading: what take-profit levels mean, when to move to breakeven, and how Sigmentum uses the two-target structure.',
  },
  {
    slug: 'stop-loss',
    term: 'Stop loss (SL)',
    score: 93,
    def: 'The price level at which the trade thesis is structurally invalid. Set at the zone boundary, not at a round number. Moving a stop loss against your position is the single most correlated behavior with long-run unprofitability.',
    detail: 'Sigmentum places stop losses 1× ATR beyond the structural zone boundary, not at a round number or at a fixed dollar amount. The rationale: a round number (e.g., 2,330 on Gold) is where everyone else puts their stop, which means it is a magnet for stop hunts before the actual move. The zone boundary, by contrast, is the price level where the trade thesis is genuinely wrong — not where it is temporarily uncomfortable.',
    seoDesc: 'Stop loss placement in trading: how to set stops at structural levels rather than round numbers, and why moving stops against your position destroys long-run P&L.',
  },
  {
    slug: 'london-open',
    term: 'London open',
    score: 85,
    def: '8am–10am GMT. The highest-liquidity window of the global trading day for FX and metals. Breakouts during this window with volume confirmation carry significantly higher follow-through rates than the same pattern at other times.',
    detail: 'London accounts for roughly 38% of global FX volume. When London opens, participants who built positions overnight — or are reacting to overnight news — all become simultaneously active. The price discovery in this window reflects genuine institutional order flow. The first 15 minutes are the trap zone: false breakouts that take out retail stops before the real move begins. A signal that triggers in the first 15 minutes should be entered only after a confirmed candle close.',
    seoDesc: 'London open trading: why 8am–10am GMT is the highest-liquidity window for forex and gold, and how Sigmentum adjusts signal confidence for the session.',
  },
  {
    slug: 'event-risk',
    term: 'Event risk',
    score: 87,
    def: 'Binary macro events — CPI, NFP, FOMC — that can move price beyond technical structure. Sigmentum flags these in the risk level field and caps confidence at 75 when one falls within 4 hours of signal generation.',
    detail: 'Event risk is categorical, not continuous. A 10-basis-point surprise in CPI can move EUR/USD by 100+ pips in seconds — far beyond any technical stop. No confidence score, no matter how high, compensates for this. The 75-confidence cap during event windows is a hard override, not a soft adjustment. It means: even a technically perfect setup, on an event day, is sized at 50% or less.',
    seoDesc: 'Event risk in trading: how CPI, NFP, and FOMC releases affect signals, and how Sigmentum caps confidence during high-risk macro windows.',
  },
  {
    slug: 'divergence',
    term: 'Divergence',
    score: 83,
    def: 'When price and RSI move in opposite directions at a swing point. Classic divergence signals momentum deterioration; hidden divergence signals trend continuation. Most reliable when combined with structural levels and extreme RSI readings.',
    detail: 'Classic (regular) bearish divergence: price makes a higher high, RSI makes a lower high. The momentum behind the move is weakening. Most reliable at overbought RSI levels (above 70) after an extended trend, at a known resistance zone. Hidden bullish divergence: price makes a higher low, RSI makes a lower low. The pullback is weak — the trend is likely to resume. Sigmentum uses divergence as a confidence modifier, not a standalone signal.',
    seoDesc: 'RSI divergence explained: classic vs hidden divergence, when each is reliable, and how Sigmentum uses it as a confidence modifier.',
  },
  {
    slug: 'breakeven-stop',
    term: 'Breakeven stop',
    score: 84,
    def: 'Stop loss moved to the entry price after TP1 is reached. Allows the remaining position to run to TP2 with zero downside risk. Should be triggered at TP1, not before — moving to breakeven too early is a primary cause of premature stop-outs.',
    detail: 'The mistake traders make most often with breakeven stops is triggering them too early — before the trade has enough room to confirm itself. Moving to breakeven after only 0.5 ATR of movement puts the stop back into the normal noise range of the market, and the trade gets stopped out at zero on moves that would have reached TP1 with more room.',
    seoDesc: 'Breakeven stop in trading: when to move your stop to entry price, why timing matters, and the TP1-trigger rule Sigmentum uses.',
  },
  {
    slug: 'half-kelly-sizing',
    term: 'Half-Kelly sizing',
    score: 80,
    def: 'Position sizing at 50% of the Kelly-optimal fraction. Dramatically reduces variance while sacrificing only ~25% of theoretical growth rate. The practical target is 1.5–2% of capital at risk per signal, consistent with Sigmentum\'s default risk model.',
    detail: 'Full Kelly sizing requires knowing your exact win rate and R:R with certainty. You never do. Your historical win rate is an estimate. Half-Kelly accounts for this estimation error: it halves the position size but reduces worst-case drawdowns by roughly half while only cutting the long-run growth rate by about 25%. For most discretionary traders, the psychological benefit of surviving large losing streaks outweighs the theoretical growth rate sacrifice.',
    seoDesc: 'Half-Kelly position sizing explained: what it means, how to calculate it, and why Sigmentum targets 1.5–2% capital risk per signal.',
  },
];

export function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[/()]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
