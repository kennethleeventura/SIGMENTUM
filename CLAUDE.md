# SIGMENTUM — Project Context for Claude Code

**Read this first, every session.** It is the shared brain between the Cowork growth-planning work and the Claude Code build work. If something here is stale, update it in the same PR as the change.

- **Owner:** Kenneth Ventura (2882 LLC)
- **Repo:** `kennethleeventura/SIGMENTUM`
- **Live:** https://kennethleeventura.github.io/SIGMENTUM/
- **Tagline / H1:** "Where signals meet momentum"
- **Last synced:** August 4, 2026
- **Companion docs:** Notion "SIGMENTUM — Growth Engine Plan" · Airtable base `appNtF62rR4qIOxfO` (Keyword Targets, pSEO Page Templates, Content Pipeline, Automations, Growth Metrics)

---

## 1. What this product is

An AI trading-signal platform. Signals every 15 minutes across 50+ assets (crypto, forex, commodities, equities), a **Hindsight Sandbox** that backtests user-defined rules against 2 years of historical data, paper-trading wallets, and auto-execution agents.

Pricing is the **"2882 model"**: Free / $28 Signal / $82 Momentum.

---

## 2. Current state — verified from the repo, Aug 4 2026

### Stack
Vite 8 + React 19, no router, no state library, no test framework. `frontend/` is the whole app. Deployed to GitHub Pages via `.github/workflows/deploy.yml` with `base: '/SIGMENTUM/'`.

### What is built
| Area | Where | State |
| --- | --- | --- |
| Nav, ticker, hero, candle chart | `sections-a.jsx` | Done |
| Signal feed, AI reasoning, active trade | `sections-b.jsx` | Done |
| Risk dashboard, pipeline, performance, Telegram, Learn | `sections-c.jsx` | Done |
| **Hindsight Sandbox**, Pricing | `sections-d.jsx` | Done |
| Accounts, auth, checkout, subscriptions, onboarding tour, $10k paper wallet | `sections-e.jsx` | **On feature branch only** |
| Blog (12 articles), glossary (15 terms) | `data.js` + `sections-c.jsx` | Done, client-side only |
| Live popups, Telegram stream | `live.jsx` | Done |

### Branch situation
`origin/claude/help-with-build-ujSHT` is **4 commits ahead of `main`** and unmerged:

```
25244fd feat: guided onboarding tour + $10k paper trading wallet
a6601a6 feat: accounts, auth, checkout, and subscription management
71305eb Mobile responsive pass across all sections
3a63737 Fix CI: skip Pages deploy on feature branches
```

**Merging this branch fixes the deploy failures.** See §3.

---

## 3. The deploy failure — diagnosed, fix already written

Six consecutive "Deploy to GitHub Pages" failures on Aug 3. Every one shows **build Succeeded, deploy Failed**.

**Cause:** `main`'s workflow triggers on `branches: [main, claude/help-with-build-ujSHT]`. The build job runs fine on the feature branch, but the `deploy` job targets the `github-pages` environment, which by default only permits deployments from the default branch. So every feature-branch push builds, then dies at deploy with an environment protection error.

**Fix:** commit `3a63737` on the feature branch already adds the guard:

```yaml
deploy:
  needs: build
  if: github.ref == 'refs/heads/main'
```

It is not on `main` yet, so `main`'s workflow keeps failing on every feature-branch push. **Merge the branch and the noise stops.** No other change needed.

---

## 4. ⚠️ The architecture conflict — resolve this before writing more features

This is the single most important open issue and it is why the build effort and the growth plan are currently pulling in opposite directions.

**The growth plan calls for ~1,499 indexable URLs:**

| Template | URL pattern | Pages |
| --- | --- | --- |
| Strategy backtests | `/backtest/{strategy}-{symbol}` | 800 |
| Glossary | `/glossary/{term}` | 350 |
| Asset signals | `/signals/{class}/{symbol}` | 250 |
| Education clusters | `/learn/{pillar}/{article}` | 80 |
| Comparison pages | `/compare/sigmentum-vs-{x}` | 15 |
| Asset-class hubs | `/signals/{class}` | 4 |

**The app currently has exactly one URL.** No router, no routes, no prerendering. Blog posts and glossary terms are JS arrays in `data.js` rendered into modals. There is no `sitemap.xml` and no `robots.txt` in `frontend/public/`. Googlebot sees a single page.

**Programmatic SEO is impossible on this architecture.** Not hard — impossible. The 1,499 pages have nowhere to live.

### Options, in order of preference

1. **`vite-react-ssg` or `vite-plugin-ssr`** — add routing plus static prerendering. Every route becomes a real HTML file with its own title, meta, and JSON-LD. Smallest change that unlocks the plan.
2. **Migrate to Next.js or Astro** — the correct long-term answer for a content-heavy SEO product. Astro is the better fit: content-first, ships almost no JS, and the existing React components port as islands.
3. **Split the app** — keep the SPA as the logged-in dashboard, build a separate static marketing/content site. Clean separation, two deploys.

**Do not generate content pages until one of these is chosen.** Adding more entries to `data.js` produces content Google cannot see or rank.

---

## 5. ⚠️ Remove the fabricated review schema

`frontend/index.html` ships this JSON-LD:

```json
"aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "124" }
```

There are 124 ratings for a product with no verified Stripe account, DR 0, and no indexed pages. If those ratings are not real and independently verifiable, this needs to come out now:

- Google's structured-data policy treats fabricated review markup as spam and it can earn a **manual action against the whole domain** — which would wipe out the entire growth plan before it starts.
- Displaying invented ratings to sell a paid financial product is a false-advertising exposure, and financial products draw more regulatory attention than most.

Delete the `aggregateRating` block until there are real reviews to point at. Everything else in the JSON-LD graph (`SoftwareApplication`, offers, `featureList`) is accurate and should stay.

---

## 6. Conventions

- Components live in `sections-{a..e}.jsx`, grouped by page region, exported as named functions. Follow the existing grouping rather than creating new files per component.
- Shared UI primitives go in `primitives.jsx`. All mock/seed content goes in `data.js`.
- Styling is plain CSS in `index.css` — no Tailwind, no CSS-in-JS. Do not introduce a styling library.
- Dependencies are deliberately minimal (react + react-dom only). Justify any addition in the PR description.
- No test framework yet. If you add one, Vitest fits the Vite setup.

---

## 7. Non-negotiable rules

1. **Never auto-publish financial content.** AI drafts and queues; a human approves before publish. This is a YMYL niche — unreviewed financial content published at scale is the fastest way to get a domain suppressed. Every published article needs a named author, a review date, and a risk disclaimer.
2. **No performance claims that cannot be independently verified.** No invented ratings, win rates, or returns anywhere in the UI, the schema, or the marketing copy.
3. **Every pSEO page must carry data that actually changes.** 250 near-identical asset pages with static numbers get classified as doorway pages and deindexed. The daily-refresh job is a requirement, not an enhancement.
4. **Secrets never enter the repo.** A Firebase service-account key was pasted into a chat on May 10 2026 — if key ID `9dc6972747…` was never rotated, rotate it now.

---

## 8. Blocked on Kenneth — do not attempt to work around these

| Blocker | Blocks |
| --- | --- |
| Stripe verification unanswered since Jan 11 (5 notices) | All checkout, subscriptions, revenue automation. Account at risk. |
| Cloudflare not authorized | Real `sigmentum.com` domain, edge caching, and a deploy target that can serve 1,000+ pages |
| Ahrefs plan has no API access | Rank tracking, keyword volumes. Google Search Console is the free substitute — not yet connected. |
| Zapier has only Google Sheets connected | 8 of 16 planned automations |

---

## 9. Combined backlog

Merged from the Claude Code build work and the Cowork growth plan. **Strict order — each tier depends on the one above it.**

### Tier 0 — Unblock (do first, nothing else matters)
1. Merge `claude/help-with-build-ujSHT` → `main`. Fixes CI, ships auth + checkout + paper wallet + mobile pass.
2. Delete the `aggregateRating` block from `index.html`.
3. Rotate the Firebase service-account key if not already done.
4. **Decide the architecture** (§4). Everything below Tier 1 is blocked on this.

### Tier 1 — Make the site indexable
5. Implement the chosen routing/SSG approach.
6. Add `sitemap.xml` and `robots.txt` to `frontend/public/`.
7. Move blog posts and glossary terms out of `data.js` onto real routes: `/learn/{slug}`, `/glossary/{term}`.
8. Per-route `<title>`, meta description, canonical, and JSON-LD.
9. Connect Google Search Console; submit the sitemap.

### Tier 2 — Foundation content (~50 pages, hand-built)
10. 4 asset-class hubs at `/signals/{class}`, 2,000+ words each.
11. 12 competitor comparison pages at `/compare/sigmentum-vs-{x}` — hand-written, scrupulously fair about what competitors do better.
12. Expand glossary from 15 to 30 highest-volume terms.
13. `/track-record` page publishing honest signal accuracy, including misses.
14. **Sandbox share card** — branded, watermarked image with one-click share to X / Reddit / Discord. *Highest-leverage item in the entire plan; the Sandbox already exists, so this is close.*

### Tier 3 — Programmatic wave 1
15. 250 asset signal pages at `/signals/{class}/{symbol}`.
16. Daily refresh job so every page's data changes (see rule 3).
17. Build-time glossary auto-linker, capped at 8 links per page.
18. **Gate:** if under 60% of pages get indexed, stop and fix quality before wave 2.

### Tier 4 — The moat
19. 800 backtest pages at `/backtest/{strategy}-{symbol}`, each ending in a live "run this yourself" button that preloads the Sandbox.
20. Remaining 300 glossary entries.
21. Education hub clusters, AI-drafted and human-reviewed.

### Tier 5 — Authority (starts now, runs forever)
22. Get listed in the affiliate listicles already ranking for "best AI trading platform."
23. Publish the 2-year indicator dataset as a free citable resource.
24. Product Hunt / r/algotrading launch with a demo video of the Sandbox.

Full automation specs (16 of them, with trigger, action chain, destination, and blocker) live in the Airtable **Automations** table.

---

## 10. Working agreement

- When you finish a tier item, tick it here and note anything that changed the plan.
- When you hit something that contradicts this file, **the repo is the truth** — fix this file.
- Kenneth's default is speed. Push back anyway when something is load-bearing: fabricated data, unreviewed financial claims, or shipping content onto an unindexable architecture are worth the friction.
