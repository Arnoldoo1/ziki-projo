# Ziki Workshop — a whimsical edition

**Route:** `/workshop`  
**Status:** Working prototype, sharing the same Handshake store as the classic app.

Ziki Workshop is a second design direction for the same product: a cozy craft table where humans and their agents make things together. It keeps the serious consent mechanics underneath, but makes the decision surface feel like a place instead of a queue.

The classic recreation remains at `/dashboard`, `/issues`, and `/handshake`. The workshop is additive; it does not replace or restyle those routes.

## The idea

The product metaphor is a small shared workshop:

- **The Desk** is the morning dashboard. A window, a plant, a mug, a paper plane, and a tiny agent make the workspace feel inhabited.
- **The Cabinet** is the consent inbox. Agents tuck a paper note into a drawer; the human reads it, adds a condition if needed, and stamps it.
- **The Shelf** is the issue list. Problems are notes looking for a home, with a “cheer” instead of an upvote.
- **The Keyring** is the trust surface. A standing grant is a little key: one agent, one kind of ask, one risk ceiling, seven days.

The whimsy is not decoration on top of the same form. It changes how consent feels: a stamp is deliberate, wax seals make a decision feel finished, and “the ink is drying” gives the ten-second undo a physical metaphor.

## Why whimsy here

Consent UIs often become either bureaucratic (dense policy language) or overly casual (a single “Allow” button that hides the consequences). Ziki Workshop tries a third path: **warm, tactile, and still precise.**

1. **A ritual, not a modal.** Stamping a note is a small, intentional act. The card stays visible, the next API call stays legible, and the undo is one tap.
2. **Warmth lowers the cost of saying no.** “Send it back” is framed as a note, not a rejection. Reasons are offered as chips, so a human can be specific without writing a memo.
3. **Physical state is legible state.** Pending, holding, revising, filed, and expired have different shapes and language. The card’s state is readable at a glance.
4. **The agent stays a character, not a chatbot.** Each agent has a blob avatar, a mood, and a name. The interface can be friendly without pretending the agent is a person.
5. **The serious bits stay serious.** High-risk asks cannot be remembered. Silence is never a yes. Every decision produces a receipt with the exact dispatch payload.

## Visual system

| Token | Day | Night |
| --- | --- | --- |
| Paper | `#fbf1df` | `#211a2b` |
| Card | `#fffdf7` | `#30263d` |
| Ink | `#2b2118` | `#f8eddc` |
| Coral | `#ef6b4a` | `#ff8a6b` |
| Teal | `#2a8c7e` | `#5bc7b5` |
| Butter | `#f2c14e` | `#f6d06b` |
| Sky | `#8ecae6` | `#9ed8ef` |
| Lilac | `#b9a7e6` | `#cbb8f5` |

- **Type:** Fraunces for display headings, Nunito for body and UI. The serif gives the workshop a storybook feel; Nunito keeps dense controls readable.
- **Shape:** irregular `border-radius` values, two-pixel ink borders, and offset hard shadows make cards feel cut from paper.
- **Materials:** washi tape, pins, wax seals, sticker labels, dashed “stitching,” and a subtle dot-grain overlay.
- **Illustration:** hand-drawn SVG doodles (sun, cloud, plant, mug, paper plane, blob agents, keys, stars) rather than an icon library for decorative moments.
- **Motion:** a slow bobbing agent, drifting cloud, rotating sun rays, steam from the mug, a stamp press, and a confetti burst on approval. All are decorative and disabled under `prefers-reduced-motion`.
- **Theme:** a Lamplight toggle switches the wrapper to a deep plum night palette. The little window stays bright, like a lit room.

## Interaction model

### The Cabinet

The cabinet has three drawers:

- **Needs a stamp** — pending and holding asks.
- **Being redrawn** — asks the human sent back for a revision.
- **Filed away** — approved, declined, and expired receipts.

Each ask card includes:

- intent and risk stickers, agent, issue number, confidence, and a live “best before” countdown;
- the exact next call (`POST /api/v1/...`);
- an expandable “Peek inside the envelope” panel with plan, evidence, blast radius, reversibility, and what is not included;
- **Stamp it**, **Ask for a tweak**, and **Send it back**;
- an optional condition picker and “Remember this for a week” grant;
- a 10-second “ink drying” hold with a progress bar and **Un-stamp**;
- a receipt with the decision, conditions or reasons, and an expandable agent payload.

### The Shelf

Issues are paper cards with a status sticker, severity, labels, points, and a cheer count. Clicking anywhere on a card opens a note with the description and comments. Cheering updates the count and is announced through a paper-note toast.

### The Keyring

The sidebar lists active grants. Each can be cut (revoked). **Try a granted ask** injects a matching ask that auto-starts in a 12-second undoable hold, demonstrating the grant path. **Put everything back where it was** resets the demo.

## Accessibility and clarity

- Every icon-only control has an `aria-label`; the theme toggle exposes `aria-pressed`.
- Tabs use `aria-pressed`; the issue dialog is `role="dialog"`, `aria-modal`, labelled by its title, closes on Escape or backdrop click, and locks background scroll.
- The whimsical labels are paired with familiar labels where ambiguity would be costly: “Stamp it” is an approval, “Send it back” is a decline, and the next API call is always visible.
- Text and controls use ink-on-paper contrast; night mode uses cream on plum.
- `prefers-reduced-motion` removes the bobbing, stamp, confetti, and steam animations.
- No horizontal overflow at 390px; the header compacts to two rows and the cabinet stacks.

## Implementation

- `app/workshop/page.tsx` — server entry with metadata.
- `app/workshop/workshop-client.tsx` — the page: desk, cabinet, shelf, modal, theme toggle, votes.
- `components/workshop/ask-card.tsx` — whimsical Handshake card and decision flow.
- `components/workshop/issue-note.tsx` — shelf card and issue dialog.
- `components/workshop/doodles.tsx` — hand-drawn SVG illustrations and agents.
- `app/globals.css` — the `.workshop` design system and animations.
- Shared state: `lib/handshake.ts`, `components/providers.tsx`.

The workshop uses the same `useHandshake` store, seeded data, reducer, grants, and receipts as `/handshake`. A decision made in the workshop is visible in the classic app, and vice versa.

## Demo script

1. Open `/workshop`.
2. Read the desk and the “best before” countdown on the first note.
3. Open “Peek inside the envelope”; point out plan, evidence, blast radius, and what is not included.
4. Stamp the note. Watch the confetti, the stamp, and the ten-second ink-drying bar; un-stamp it.
5. Stamp it again with a condition and “Remember this for a week.”
6. Switch to the next note, ask for a tweak, and show it move to **Being redrawn**.
7. Open **Filed away** and expand **What the agent gets** to show the dispatch payload.
8. Try a granted ask from the keyring and un-stamp the auto-approval.
9. Toggle **Lamplight** to show the night palette.
10. End on **The Shelf**: open a note, cheer it, and show the issue dialog.

## Scope and next steps

This is a design exploration, not a production theme. It reuses the same demo data and in-browser store. A production version would need real API wiring, a server-side audit log, per-workspace theming, and usability testing with people who make high-stakes approval decisions. The point of the exercise is to show that consent can be warm, legible, and reversible without becoming less precise.
