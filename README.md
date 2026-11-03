# start.ng — recreation + The Sun Market

A working recreation of [start.ng](https://start.ng), Nigeria's home for browser games, plus a separate whimsical design direction called **The Sun Market**.

## Live

- **Faithful clone:** https://startng-three.vercel.app
- **The Sun Market:** https://startng-three.vercel.app/toybox
- **Sun Market design notes:** https://startng-three.vercel.app/toybox/design
- **Docs rendered from the original:** https://startng-three.vercel.app/docs
- **Plain-text docs for AI:** https://startng-three.vercel.app/docs.md

## The Naija whimsy layer (revised)

A decoration-only layer that keeps the original start.ng theme, fonts, copy, layout and functionality intact:

- **Headlines** — every main heading splits into words; each word lifts, tilts, changes to a saturated brand color, draws a colored underline and pops tiny sparkles on hover or tap. The home hero keeps its sunburst halo and ✦/✧ stars.
- **Naija vibes mascot** — one corner mascot on every page with big tracking eyes (pointer-driven), random blinking, eyebrows that lift when the pointer is close, a floating bob, a speech bubble (“Sharp sharp!”, “Oya, play!”, “No wahala!”), and a happy wiggle on click. Touch devices let the eyes wander; reduced motion removes the bob and eases the eyes instantly.
- **One danfo** — a yellow, black-striped danfo drives down the side margin with the scroll on a gently curving path, idles with bouncing wheels, faces its direction and leaves tiny ✦ puffs. It fades to 25% over text-heavy areas, sits behind the content and is parked under reduced motion.
- **Kept** — the fixed twinkling ✦/✧ stars, the tournament trophy + ticking clock, leaderboard crown/medals, footer skyline/sign-off, hero double underline, scroll reveals, playful microcopy, card hovers, and click sparkles/shouts. Play now keeps a stars-and-banner celebration (no doodles).

- `app/whimsy.css` — the single, clearly marked stylesheet.
- `components/WhimsyDecor.tsx` — stars, click effects, awards portals, footer strip and reveals.
- `components/WhimsyDoodles.tsx` — only trophy, crown, medal and clock.
- `components/HeroMagic.tsx` — the hero sunburst halo and stars.
- `components/WordHover.tsx` — accessible word-splitting hover enhancer.
- `components/NaijaMascot.tsx` — the eye-tracking mascot.
- `components/ScrollDanfo.tsx` — the one scroll-driven danfo.
- Mounted once in `app/layout.tsx`; `app/loading.tsx` uses stars only, and `app/not-found.tsx` keeps the “Wahala!” line.

**Removed completely:** the custom wand cursor and sparkle trail; every `cursor: none`; the Sign-in ring/oval and spinner coin; all fruit, food, coin and vehicle doodles (mango, jollof, suya, puff puff, zobo, coin, bus/car) from the margins, hero, Play celebration, footer skyline, loader and 404; the old hover-tilt doodle margin system; the top straight-line danfo runner/road; the oval hero orbit; and the page-edge/section line decorations.

Decorations use `pointer-events: none` (the mascot is the only clickable one), sit behind/beside content with no text overlap, and respect `prefers-reduced-motion`. No fonts, palette, copy, routes, links or functionality changed.

## What is included

- The full 189-game catalogue, 33 categories and 39 independent creators.
- Homepage, games browser, game detail, how-to-play, FAQ, tournament, leaderboard, creators, categories, about, docs, sign-in and profile pages.
- Real interactions: search, filtering, sorting, pagination, favourites, ratings, scores, tournament entry and sharing, hosted tournaments, creator submissions and profile/character editing.
- Playable in-browser arcade: runner, catcher and timing modes on the game play routes.
- A walkable 2D **Hangout** with WASD/arrow controls, NPCs, chat, waving and mobile controls.
- **The Sun Market** at `/toybox`: a floating day market above Lagos with a lantern game draw, six discovery districts, a tiny dare, wish lanterns, a four-light charm system, a hidden sun moth and a Breeze Line portal to the Hangout. A full design-notes page lives at `/toybox/design`.
- Demo state is stored in `localStorage`; there is no external backend.

## Stack

- Next.js 16.4.3 (App Router)
- React 19.3.0
- TypeScript
- Plain global CSS (no Tailwind)
- `marked` for rendering the full fetched start.ng documentation
- Self-hosted P052 display and Nimbus Sans body fonts

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm start
```

## Project structure

```text
app/
  (site)/          faithful start.ng pages and chrome
  (immersive)/     chrome-free play and hangout routes
  (toybox)/        The Sun Market design direction
components/        interactive UI, arcade, hangout, tournament, profile
lib/               game/category/creator data and helpers
public/            covers, creator art, category art, fonts, docs.md
app/globals.css    main site design system and page styles
app/toybox.css     Sun Market design system
```

## Notes

- The clone is a recreation for demonstration; all game names, artwork and copied documentation belong to their original creators and the start.ng / HNG community.
- The Sun Market is a design direction layered on the same catalogue. It does not replace the faithful clone.
- The route remains `/toybox` for continuity with the earlier Toybox direction.
- Accounts, favourites, scores, wishes and market charms are local to the browser in this demo.
