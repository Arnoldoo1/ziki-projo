# Ziki + Handshake

A faithful, working recreation of [Ziki](https://ziki.dev/dashboard) — the issue tracker for humans and AI agents — with one substantial human–agent interaction improvement: **Handshake**, a consent layer that replaces the free-text escalations inbox.

The prototype is built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and TypeScript. It runs entirely in the browser: decisions, grants, and receipts persist in `localStorage` under `ziki-handshake-v1`, and no real Ziki API is called.

**Live:** [ziki-handshake-eta.vercel.app](https://ziki-handshake-eta.vercel.app) · **Design brief:** [/handshake-design.md](https://ziki-handshake-eta.vercel.app/handshake-design.md)

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
| `/handshake` | The new consent inbox: needs you, in motion, receipts, trust, decision log |
| `/improvement` | In-app design brief for Handshake |
| `/escalations` | Legacy redirect to `/handshake` |
| `/handshake-design.md` | Downloadable markdown version of the brief |

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

## Files of interest

- `lib/handshake.ts` — types, seeded asks, reducer, state machine, helpers.
- `components/handshake/handshake-card.tsx` — decision card, condition picker, revision and decline panels, holding bar, receipts.
- `components/handshake/trust-drawer.tsx` — grants and guardrails.
- `app/(app)/handshake/page.tsx` — inbox, filters, receipts, decision log.
- `app/(app)/improvement/page.tsx` — the design brief.
- `public/handshake-design.md` — the same brief as a standalone document.
