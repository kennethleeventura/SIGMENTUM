# SIGMENTUM — Project Context for Claude Code

**Read this first, every session.** It is the shared brain between the Cowork growth-planning work and the Claude Code build work. If something here is stale, update it in the same PR as the change.

- **Owner:** Kenneth Ventura (2882 LLC)
- **Repo:** `kennethleeventura/SIGMENTUM`
- **Live:** https://sigmentumtrade.com · https://kennethleeventura.github.io/SIGMENTUM/ (still resolves)
- **Tagline / H1:** "Where signals meet momentum"
- **Last synced:** August 14, 2026 (post-launch sprint)
- **Companion docs:** Notion "SIGMENTUM — Growth Engine Plan" · Airtable base `appNtF62rR4qIOxfO` (Keyword Targets, pSEO Page Templates, Content Pipeline, Automations, Growth Metrics)

---

## 1. What this product is

An AI trading-signal platform. Signals every 15 minutes across 50+ assets (crypto, forex, commodities, equities), a **Hindsight Sandbox** that backtests user-defined rules against 2 years of historical data, paper-trading wallets, and auto-execution agents.

Pricing is the **"2882 model"**: Free / $28 Signal / $82 Momentum.

---

## 2. Current state — verified from the repo, Aug 4 2026

### Stack
Vite 8 + React 19 SPA in `frontend/` (base `/app/`), Astro 4 SSG in `astro/` (static output). Combined into one GitHub Pages artifact: Astro at `/`, React SPA at `/app/`. Deployed via `.github/workflows/deploy.yml`. Domain `sigmentumtrade.com` live — DNS pointed and TLS cert issued Aug 14 2026.

### What is built
| Area | Where | State |
| --- | --- | --- |
| Nav, ticker, hero, candle chart | `sections-a.jsx` | Done |
| Signal feed, AI reasoning, active trade | `sections-b.jsx` | Done |
| Risk dashboard, pipeline, performance, Telegram, Learn | `sections-c.jsx` | Done |
| **Hindsight Sandbox**, Pricing | `sections-d.jsx` | Done |
| Accounts, auth, checkout, subscriptions, onboarding tour, $10k paper wallet | `sections-e.jsx` | Done (merged Aug 10) |
| Blog (12 articles), glossary (15 terms) | `data.js` + `sections-c.jsx` | Done, client-side only |
| Live popups, Telegram stream | `live.jsx` | Done |

### Branch situation
`main` is at `2236abd` (Aug 10 merge). `claude/help-with-build-ujSHT` is the active development branch — reset to `main` after each merge.

---

## 3. CI — current state (Aug 13)

Workflow at `.github/workflows/deploy.yml` has four jobs:

- **build-astro** — installs, builds, asserts sitemap exists, asserts ≥32 pages, asserts ≥32 sitemap URLs, asserts sitemap URLs match site URL, asserts asset paths reflect base, asserts no broken internal links, fails if `sigmentum.com` or `kennethleeventura.github.io` in `astro/dist/`; uploads artifact.
- **build-react** — installs, builds React SPA with `base: '/app/'`, fails if `sigmentum.com` or `kennethleeventura.github.io` in `frontend/dist/`; uploads artifact.
- **combine** — downloads both artifacts, places React at `_site/app/`, uploads combined as the Pages artifact.
- **deploy** — deploys Pages artifact; guarded by `github.ref == 'refs/heads/main'` so feature-branch pushes build but do not deploy.

Triggers: `push` on `[main, claude/help-with-build-ujSHT]`, `pull_request` against `main`, `workflow_dispatch`.

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

**Architecture decision (Aug 2026):** Astro SSG at root for content + marketing; React SPA at `/app/` for the logged-in dashboard. Combined into one GitHub Pages artifact. Domain: `sigmentumtrade.com` (registered, DNS not yet pointed). `PUBLIC_SITE_URL` env var is the single source of truth for all canonical URLs — set it in GitHub Actions and the Astro config picks it up at build time. Default is the GitHub Pages URL.

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
| ~~`sigmentumtrade.com` DNS not pointed~~ | Resolved Aug 14 — DNS live, TLS cert issued, custom domain configured in GitHub Pages. |
| Ahrefs plan has no API access | Rank tracking, keyword volumes. Google Search Console is the free substitute — not yet connected. |
| Zapier has only Google Sheets connected | 8 of 16 planned automations |

---

## 9. Combined backlog

Merged from the Claude Code build work and the Cowork growth plan. **Strict order — each tier depends on the one above it.**

### Tier 0 — Unblock (do first, nothing else matters)
1. ✅ Merge `claude/help-with-build-ujSHT` → `main`. PR #25 merged Aug 10.
2. ✅ Delete the `aggregateRating` block from `index.html`. Shipped with PR #25.
3. Rotate the Firebase service-account key if not already done.
4. ✅ **Architecture decided:** Astro SSG for content routes (`sigmentumtrade.com`), React SPA at `/app/`. Combined into one GitHub Pages artifact. No Cloudflare required — point `sigmentumtrade.com` DNS to GitHub Pages directly.

### Tier 1 — Make the site indexable
5. ✅ Astro 4 SSG scaffolded in `astro/`. Static output, `site` derived from `PUBLIC_SITE_URL` env var (default: `https://kennethleeventura.github.io/SIGMENTUM`), trailing-slash: never.
6. ✅ `@astrojs/sitemap` pinned at `3.1.6` (exact, no caret). `robots.txt` generated dynamically from `Astro.site` via `src/pages/robots.txt.ts`.
7. ✅ Glossary on real routes: `/glossary` index + `/glossary/{slug}` detail pages (30 terms). Blog/learn routes: pending.
8. ✅ Per-route `<title>`, meta description, canonical, and JSON-LD on all Astro pages. All URLs derived from `Astro.site` — zero hardcoded domains.
9. Connect Google Search Console; submit the sitemap. **Blocked on DNS pointing `sigmentumtrade.com` → GitHub Pages.**

### Tier 1 (continued) — Landing page + domain hygiene
- ✅ `astro/src/pages/index.astro` — hero, features, pricing (2882 tiers $0/$28/$82), SoftwareApplication + Offer JSON-LD, UTMs on all CTAs.
- ✅ `noindex` added to React SPA (`frontend/index.html`) so it doesn't compete with Astro landing.
- ✅ De-hardcoded domain: one `PUBLIC_SITE_URL` env var drives every canonical, JSON-LD URL, sitemap, and robots.txt. CI fails if `sigmentum.com` appears in any dist output.
- ✅ Vite base changed to `/app/`. Both builds combined into one Pages artifact: Astro at `/`, React at `/app/`.
- ✅ **P0: CTA links de-hardcoded.** All `kennethleeventura.github.io` refs replaced with relative paths (`/`, `/#pricing`, `/app/`). CI guard added — fails if `kennethleeventura.github.io` appears in either dist. (commit `43c7058`)
- ✅ **P0: Email capture.** Permanent footer form + exit-intent/scroll-depth modal on every Astro page via Base.astro. Provider: Buttondown (embed-subscribe endpoint, username-only, no API key in client). Controlled by `BUTTONDOWN_USERNAME` repo secret → `PUBLIC_BUTTONDOWN_USERNAME` at build. Modal never fires on first paint (3s delay), dismissed 30 days via cookie. (commit `4ecef35`)
- ✅ **P1: Dockable popups.** `live.jsx` PopupNotifier now has dock/expand toggle. Docked = slim right-edge tab with unread badge. Mobile starts docked, expands to bottom sheet. State via session cookie `sg_popup_docked`. Respects `prefers-reduced-motion`. (commit `84c141b`)
- ✅ **P1: Social bar.** X, Telegram, Reddit, Discord icons in Astro footer and React SPA footer. URLs from `PUBLIC_SOCIAL_*` / `VITE_SOCIAL_*` env vars (set via `SOCIAL_X`, `SOCIAL_TELEGRAM`, `SOCIAL_REDDIT`, `SOCIAL_DISCORD` repo secrets). Icons greyed/disabled when unset — no code change needed when accounts go live. (commit `84c141b`)

### Tier 2 — Foundation content (~50 pages, hand-built)
10. 4 asset-class hubs at `/signals/{class}`, 2,000+ words each.
11. 12 competitor comparison pages at `/compare/sigmentum-vs-{x}` — hand-written, scrupulously fair about what competitors do better.
12. ✅ Glossary expanded from 15 → 30 highest-volume terms. (In `astro/src/data/glossary.js`.)
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
