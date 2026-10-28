# Ziki + Handshake

A faithful, working recreation of [Ziki](https://ziki.dev/dashboard) — the issue tracker for humans and AI agents — with one substantial human–agent interaction improvement: **Handshake**, a consent layer that replaces the free-text escalations inbox.

The prototype is built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and TypeScript. It runs entirely in the browser: decisions, grants, and receipts persist in `localStorage` under `ziki-handshake-v1`, and no real Ziki API is called.

**Live:** [ziki-handshake-eta.vercel.app](https://ziki-handshake-eta.vercel.app) · **Handshake brief:** [/handshake-design.md](https://ziki-handshake-eta.vercel.app/handshake-design.md) · **Whimsical edition:** [/workshop](https://ziki-handshake-eta.vercel.app/workshop)

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

Production build:

```bash
npm run lint
npm run build
npm start
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Ziki marketing landing page |
| `/login` | Recreated sign-in screen (simulated auth) |
| `/dashboard` | Recreated workspace dashboard: stats, waiting strip, assigned issues, points, agents |
| `/issues` | Issue list with filters, search, sort, voting, and open-gate badges |
| `/issues/[number]` | Issue detail with lifecycle, properties, comments, and inline Handshake gates |
| `/handshake` | The new consent inbox: needs you, in motion, receipts, trust, decision log; add `?tour=1` for the guided walkthrough |
| `/workshop` | Ziki Workshop: a whimsical, working second design direction with the same consent store, paper/ink UI, Lamplight mode, keyring, and shelf |
| `/improvement` | In-app design brief for Handshake |
| `/escalations` | Legacy redirect to `/handshake` |
| `/handshake-design.md` | Downloadable markdown version of the Handshake brief |
| `/workshop-design.md` | Downloadable design notes for the whimsical edition |

## The improvement

The real Ziki protocol already models permissioned agent actions: `/api/v1/escalations`, `/questions`, `/issues/{id}/bid`, `/merge`, and `/test-results`. The weak point is the decision surface — a free-text `resolution` and a generic “Approve & Unblock” button.

Handshake turns each pending action into a typed decision object with:

- the exact next API call and a short plan,
- evidence and a confidence estimate,
- blast radius (files, services, points, reversibility) and what is explicitly *not* included,
- a live expiry where silence means no action,
- approve with conditions, ask for a revision, or decline with a reason,
- a 10-second holding window with undo before dispatch,
- a receipt for every decision, including auto-approvals,
- optional standing grants scoped to one agent, one action kind, one risk ceiling, and seven days — with high-risk actions always asking.

Try the loop at `/handshake`: approve a card, undo it, ask for a change, decline with a reason, fast-forward expiry from the Demo menu, or grant trust and see the receipt.

## The whimsical edition

`/workshop` is a second, fully working design direction: **Ziki Workshop**, a paper-and-ink craft table for humans and agents. It keeps the same Handshake store, seeded asks, grants, and receipts, but reframes the product as a place: the desk, the consent cabinet, the shelf, and the keyring.

- **The Desk** — a warm morning dashboard with a hand-drawn window, blob agents, a jar of points, and a live “notes waiting” count.
- **The Cabinet** — typed asks as taped paper notes. Stamp an ask (with optional conditions and a seven-day key), watch the ten-second ink dry, un-stamp it, ask for a tweak, decline with a reason, and open the agent payload on the receipt.
- **The Shelf** — issues as notes looking for a home, with cheers and a keyboard-friendly issue dialog.
- **The Keyring** — scoped standing grants, revoke controls, and a “try a granted ask” demo.
- **Lamplight** — a day/night palette toggle for the workshop.

The classic routes are untouched. The design notes are at [`docs/WORKSHOP.md`](docs/WORKSHOP.md) and [`/workshop-design.md`](public/workshop-design.md).

## Present it

Open **`/handshake?tour=1`** for the built-in presenter tour, or press **Present** in the inbox. The six steps cover the queue, the anatomy of an ask, the three choices, the receipt and agent payload, grants, and the pilot ask.

For a live proof, use **Demo → Simulate a granted ask**: a matching ask enters a 12-second undoable hold, then writes an auto-approval receipt. The decision log records the undo if you stop it.

The acceptance case is in `/improvement#pilot`: a two-week, feature-flagged pilot with one workspace, bids and verdicts, four success gates, and a one-flag rollback.

## Files of interest

- `lib/handshake.ts` — types, seeded asks, reducer, state machine, helpers.
- `components/handshake/handshake-card.tsx` — decision card, condition picker, revision and decline panels, holding bar, receipts.
- `components/handshake/trust-drawer.tsx` — grants and guardrails.
- `components/handshake/tour.tsx` — the presenter walkthrough.
- `app/(app)/handshake/page.tsx` — inbox, filters, receipts, decision log.
- `app/(app)/improvement/page.tsx` — the design brief.
- `public/handshake-design.md` — the same brief as a standalone document.
- `app/workshop/workshop-client.tsx` — the whimsical desk, cabinet, shelf, keyring, and theme toggle.
- `components/workshop/ask-card.tsx` — the paper-note Handshake card and decision flow.
- `components/workshop/issue-note.tsx` — shelf cards and the issue dialog.
- `components/workshop/doodles.tsx` — hand-drawn SVG illustrations and blob agents.
- `docs/WORKSHOP.md` — the whimsical design concept, visual system, and demo script.
- `public/workshop-design.md` — the same notes as a standalone document.
