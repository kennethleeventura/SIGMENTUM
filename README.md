# SIGMENTUM

AI-powered trading signal engine built on Make.com — pulls queued assets from Google Sheets, generates GPT-driven analysis, delivers real-time signals via Telegram, and logs all activity to Google Drive. Currently tracking USD/JPY with expansion planned across forex, equities, and crypto markets.

---

## 🚀 Overview

SIGMENTUM is a modular, no-code/low-code trading automation system designed to:

- Identify trade opportunities from structured asset queues  
- Generate AI-enhanced market analysis  
- Deliver actionable signals in real time  
- Log, track, and optimize performance over time  

Built entirely on **Make.com**, SIGMENTUM eliminates the need for complex infrastructure while enabling rapid iteration, automation, and scale.

---

## ⚙️ Core Architecture

**1. Data Input (Google Sheets)**
- Central asset queue (e.g., USD/JPY)
- Fields include: symbol, timeframe, indicators, trigger conditions
- Acts as the control layer for all automation

**2. Automation Engine (Make.com)**
- Scenario watches for new/updated rows
- Routes data through analysis pipeline
- Handles branching logic (buy/sell/hold)

**3. AI Analysis (GPT)**
- Interprets structured + contextual market data
- Outputs:
  - Trade direction (LONG / SHORT / NO TRADE)
  - Entry price
  - Stop loss
  - Take profit targets
  - Confidence score
  - Narrative reasoning

**4. Signal Delivery (Telegram)**
- Instant push notifications
- Clean, formatted trade alerts
- Designed for rapid decision-making

**5. Logging & Storage (Google Drive)**
- Stores all signals + analysis outputs
- Enables backtesting + performance review
- Structured for future AI training datasets

---

## 🔁 Workflow

1. Asset added or updated in Google Sheets  
2. Make.com scenario triggers  
3. Data sent to GPT for analysis  
4. Trade signal generated  
5. Signal delivered via Telegram  
6. Output logged to Google Drive  

---

## 📊 Current Coverage

- **Active Pair:** USD/JPY  
- **Timeframes:** Configurable (scalp → swing)  
- **Strategy Inputs:**  
  - Price action  
  - Trend indicators  
  - Volatility signals  
  - Custom logic (expandable)

---

## 🧠 AI Signal Format

Example output:

```
PAIR: USD/JPY  
DIRECTION: LONG  
ENTRY: 151.20  
STOP LOSS: 150.80  
TAKE PROFIT: 152.00 / 152.40  

CONFIDENCE: 78%  

ANALYSIS:  
Bullish continuation supported by upward trend structure and momentum confirmation. Pullback into support zone provides favorable risk/reward setup.
```

---

## 🧩 Key Features

- Fully automated signal generation  
- No-code architecture (Make.com + Google ecosystem)  
- Modular and scalable across assets/markets  
- Real-time delivery system  
- Built-in logging + performance tracking  
- AI-enhanced decision support  

---

## 🔌 Integrations

- **Make.com** — automation backbone  
- **Google Sheets** — data control layer  
- **OpenAI (GPT)** — analysis engine  
- **Telegram Bot API** — signal delivery  
- **Google Drive** — storage + logs  

---

## 📈 Roadmap

**Phase 1 (Current)**
- USD/JPY signal generation  
- Core automation pipeline  
- Telegram delivery + logging  

**Phase 2**
- Multi-pair forex expansion  
- Equity + crypto integration  
- Strategy diversification  

**Phase 3**
- User dashboard (signals + analytics)  
- Subscription-based access (SIGMENTUM PRO)  
- Performance tracking + trade history UI  

**Phase 4**
- AI Agents (Make.com beta integration)  
  - Personalized signal tuning  
  - Behavioral learning  
  - Automated trade journaling  
  - Smart re-engagement alerts  

---

## 💡 Strategic Edge

SIGMENTUM isn’t just a signal generator — it’s an **adaptive trading intelligence system**:

- Combines structured data + AI reasoning  
- Reduces emotional trading decisions  
- Creates a feedback loop for continuous improvement  
- Designed for scalability into a full SaaS platform  

---

## 🛠 Setup Summary

**Requirements:**
- Make.com account  
- Google Sheets (asset queue)  
- OpenAI API key  
- Telegram Bot  

**High-Level Setup:**
1. Create asset queue in Google Sheets  
2. Build Make.com scenario:
   - Watch rows → process data → call GPT  
3. Format AI response into structured signal  
4. Send output to Telegram bot  
5. Log results to Google Drive  

---

## 🔐 Disclaimer

SIGMENTUM provides AI-generated trading signals for informational purposes only. It does not constitute financial advice. Always perform your own analysis and risk management before executing trades.

---

## 📬 Contact / Collaboration

For partnerships, integrations, or early access to SIGMENTUM PRO, reach out directly or open an issue in this repository.

---

## 🧭 Vision

SIGMENTUM is being built to evolve beyond signals into a **fully autonomous, AI-driven trading ecosystem** — combining automation, intelligence, and user personalization to redefine how individuals interact with financial markets.# SIGMENTUM

AI-powered trading signal engine built on Make.com — pulls queued assets from Google Sheets, generates GPT-driven analysis, delivers real-time signals via Telegram, and logs all activity to Google Drive. Currently tracking USD/JPY with expansion planned across forex, equities, and crypto markets.

---

## 🚀 Overview

SIGMENTUM is a modular, no-code/low-code trading automation system designed to:

- Identify trade opportunities from structured asset queues  
- Generate AI-enhanced market analysis  
- Deliver actionable signals in real time  
- Log, track, and optimize performance over time  

Built entirely on **Make.com**, SIGMENTUM eliminates the need for complex infrastructure while enabling rapid iteration, automation, and scale.

---

## ⚙️ Core Architecture

**1. Data Input (Google Sheets)**
- Central asset queue (e.g., USD/JPY)
- Fields include: symbol, timeframe, indicators, trigger conditions
- Acts as the control layer for all automation

**2. Automation Engine (Make.com)**
- Scenario watches for new/updated rows
- Routes data through analysis pipeline
- Handles branching logic (buy/sell/hold)

**3. AI Analysis (GPT)**
- Interprets structured + contextual market data
- Outputs:
  - Trade direction (LONG / SHORT / NO TRADE)
  - Entry price
  - Stop loss
  - Take profit targets
  - Confidence score
  - Narrative reasoning

**4. Signal Delivery (Telegram)**
- Instant push notifications
- Clean, formatted trade alerts
- Designed for rapid decision-making

**5. Logging & Storage (Google Drive)**
- Stores all signals + analysis outputs
- Enables backtesting + performance review
- Structured for future AI training datasets

---

## 🔁 Workflow

1. Asset added or updated in Google Sheets  
2. Make.com scenario triggers  
3. Data sent to GPT for analysis  
4. Trade signal generated  
5. Signal delivered via Telegram  
6. Output logged to Google Drive  

---

## 📊 Current Coverage

- **Active Pair:** USD/JPY  
- **Timeframes:** Configurable (scalp → swing)  
- **Strategy Inputs:**  
  - Price action  
  - Trend indicators  
  - Volatility signals  
  - Custom logic (expandable)

---

## 🧠 AI Signal Format

Example output:

```
PAIR: USD/JPY  
DIRECTION: LONG  
ENTRY: 151.20  
STOP LOSS: 150.80  
TAKE PROFIT: 152.00 / 152.40  

CONFIDENCE: 78%  

ANALYSIS:  
Bullish continuation supported by upward trend structure and momentum confirmation. Pullback into support zone provides favorable risk/reward setup.
```

---

## 🧩 Key Features

- Fully automated signal generation  
- No-code architecture (Make.com + Google ecosystem)  
- Modular and scalable across assets/markets  
- Real-time delivery system  
- Built-in logging + performance tracking  
- AI-enhanced decision support  

---

## 🔌 Integrations

- **Make.com** — automation backbone  
- **Google Sheets** — data control layer  
- **OpenAI (GPT)** — analysis engine  
- **Telegram Bot API** — signal delivery  
- **Google Drive** — storage + logs  

---

## 📈 Roadmap

**Phase 1 (Current)**
- USD/JPY signal generation  
- Core automation pipeline  
- Telegram delivery + logging  

**Phase 2**
- Multi-pair forex expansion  
- Equity + crypto integration  
- Strategy diversification  

**Phase 3**
- User dashboard (signals + analytics)  
- Subscription-based access (SIGMENTUM PRO)  
- Performance tracking + trade history UI  

**Phase 4**
- AI Agents (Make.com beta integration)  
  - Personalized signal tuning  
  - Behavioral learning  
  - Automated trade journaling  
  - Smart re-engagement alerts  

---

## 💡 Strategic Edge

SIGMENTUM isn’t just a signal generator — it’s an **adaptive trading intelligence system**:

- Combines structured data + AI reasoning  
- Reduces emotional trading decisions  
- Creates a feedback loop for continuous improvement  
- Designed for scalability into a full SaaS platform  

---

## 🛠 Setup Summary

**Requirements:**
- Make.com account  
- Google Sheets (asset queue)  
- OpenAI API key  
- Telegram Bot  

**High-Level Setup:**
1. Create asset queue in Google Sheets  
2. Build Make.com scenario:
   - Watch rows → process data → call GPT  
3. Format AI response into structured signal  
4. Send output to Telegram bot  
5. Log results to Google Drive  

---

## 🔐 Disclaimer

SIGMENTUM provides AI-generated trading signals for informational purposes only. It does not constitute financial advice. Always perform your own analysis and risk management before executing trades.

---

## 📬 Contact / Collaboration

For partnerships, integrations, or early access to SIGMENTUM PRO, reach out directly or open an issue in this repository.

---

## 🧭 Vision

SIGMENTUM is being built to evolve beyond signals into a **fully autonomous, AI-driven trading ecosystem** — combining automation, intelligence, and user personalization to redefine how individuals interact with financial markets.
