# start.ng — The Naija Whimsy Layer (decoration-only handoff)

A tested, decoration-only whimsical layer for **every start.ng route** — home,
games, categories, game detail, tournament, leaderboard, creators, docs,
about, sign-in, 404, the Hangout and The Sun Market. It changes **no fonts,
no colour palette, no logo, no layout structure, no existing copy, no routes,
no links and no functionality**. All decorations sit beside/behind content and
are `pointer-events: none`.

Authored against `Arnoldoo1/startng` at `ee8a557` (`main`).

**Why it lives here:** this session has read-only access to
`Arnoldoo1/startng` (`push: false`), so the commit cannot be pushed there or
deployed to the project URL. The patch is preserved here.

## Latest presentation pass (hero · Play · cursor · car)

- **Hero set-piece:** a clipped sunburst halo, dashed orbit, six outlined
  Naija doodles (danfo, jollof, mango, suya, puff, zobo) and six bold
  sparkles sit behind the existing “Good vibes. Good games.” content. The
  highlight now has a double hand-drawn lime/gold underline plus a star.
  No text overlap, no horizontal overflow.
- **Play now celebration:** clicking Play spawns a unique fixed overlay — six
  doodles orbit outward, twelve high-contrast sparkles, a glowing ring and an
  “Oya, let’s play! ✦” sticker. It is `pointer-events: none`, clears after
  1.8s, and never delays the `#games` scroll.
- **Wand cursor:** a lime/gold star-tipped wand follows the pointer with a
  spark trail on fine pointers. Touch and `prefers-reduced-motion` keep the
  native cursor.
- **Curvy danfo:** the straight road/runner is gone. A danfo follows a wavy
  `offset-path` across the full hero width, loops every 9 seconds, and bounces
  slightly; it is hidden under reduced motion.
- **Lines removed:** the vertical dotted page rails and the section/page wavy
  divider lines are gone. The only remaining “line” is the intentional
  hand-drawn underline on “Good games.”
- **Every click:** buttons/links get a squish, a bright ripple, 10–14 bold
  sparkles, three coins and a sticker shout (“Sharp sharp!”, “Oya!”,
  “Correct!”, “E sweet!”, “No wahala!”); big CTAs add confetti. Play now uses
  the full celebration instead. All effects are pointer-events none.

New screenshots: `hero-v2.jpg`, `play-celebration.jpg`, `mobile-v2.jpg`,
`dark-hero.jpg`.

## Apply it

```bash
git clone https://github.com/Arnoldoo1/startng.git
cd startng
git checkout -b whimsy/naija-layer
git am /path/to/startng-naija-whimsy.patch
npm ci && npm run build && npm run dev
```

## Files in the patch

- `app/whimsy.css` — the single reviewable stylesheet (tokens, doodles,
  sparkles, effects, dividers, skyline, reveal, reduced motion, responsive).
- `components/WhimsyDecor.tsx` — fixed doodles + sparkle field, daft danfo
  run, click squish/ripple/sparkles/coins/confetti, cursor trail, tooltips,
  scroll reveals, and path-specific mascot/awards/skyline portals.
- `components/WhimsyDoodles.tsx` — outlined SVG danfo, jollof, suya, puff
  puff, mango, zobo, coin, mascot, trophy, crown, medal, clock.
- `app/layout.tsx` — mounts the layer once for every route and imports the CSS.
- `app/loading.tsx` — spinning-coin loader ("Sharp sharp, loading…").
- `app/not-found.tsx` — adds the requested "Wahala! This page is on a hustle.
  Go back home." sticker + danfo, keeping the original 404 copy.
- `README.md` — documents the layer.

## Whimsy per page

- **Home** — four floating margin doodles (danfo, jollof, mango, trophy),
  sparkle field, wavy underline under “Good games.”, bouncy Play now/Create
  account, card stars, footer skyline + “No wahala ✦”, waving “Naija vibes”
  mascot, top danfo run.
- **Games / categories / game detail** — coin/puff/mango/danfo doodles, sparkle
  field, wavy section dividers, corner sparkles and hover tilt on cards,
  wiggling NEW stickers; search and filters untouched.
- **Tournament** — trophy + ticking clock above the panel, crown/medals in the
  standings, sparkle field, confetti on the leader, wavy dividers.
- **Leaderboard** — crown for #1 and medals for #2/#3, confetti for the leader,
  sparkle field, doodles.
- **Creators / about / docs** — outlined doodles, sparkle field, wavy
  dividers, sparkles on cards/FAQ, playful tooltips.
- **Sign-in** — friendly mascot peeking over the form with “Oya, come in!”,
  lime focus glow, confetti on successful character creation; the form stays
  fully readable.
- **The Hangout / The Sun Market** — sparkle field, margin doodles, click
  effects and tooltips; their own full-screen designs are untouched.
- **404** — the exact requested “Wahala!” line + danfo sticker.

## Verification (light mode first)

- Every route returns 200 (unknown route 404) with **zero horizontal overflow**
  at 1440×1000 and 390×844.
- 4 margin doodles + 8 fixed sparkles are visible on the first screen of every
  desktop route; on mobile 4 sparkles + the top danfo are visible and margin
  doodles are hidden to protect content.
- **Zero decoration-vs-text overlaps** after fixes on home, tournament,
  sign-in and docs (tournament props lifted above the panel, sign-in mascot
  lifted above the card, footer skyline dropped into the footer padding).
- Every visible link/button/summary was hit-tested and clicked in a capture
  harness: 0 decoration interceptions. The only non-matches were links inside
  a closed A–Z `<details>` (not visible) and two long inline docs links whose
  box centre fell between lines — both verified at their first line box.
- Click feedback verified: squish, ripple ring, 8–12 bold sparkles + coins,
  confetti and “Sharp sharp!” for Play now/Create account; navigation and the
  button's action still complete normally.
- Scroll reveals: all reveal targets reach `.wd-in` (0 hidden) after scrolling;
  the Sun Market is skipped so its own hidden tabs are never affected.
- Reduced motion: runner hidden, every animation (including portal mascots,
  trophy, clock, medals and UI sparkles) off, no click effects, no reveals.
- Dark mode: outlines switch to cream, doodles/sparkles glow with the same
  brand shapes; screenshots included.

Screenshots: `home.jpg`, `games.jpg`, `tournament.jpg`, `leaderboard.jpg`,
`creators.jpg`, `docs.jpg`, `signin.jpg`, `footer.jpg`, `404.jpg`,
`mobile-*.jpg`, `dark-home.jpg`.

## Revision (current)

Deployed to the existing Vercel project `nimble-xenon-4wygl2l`:

- **https://nimble-xenon-4wygl2l-anm17.vercel.app**

Removed: custom wand cursor + sparkle trail and every `cursor: none`; the
Sign-in oval/ring and coin spinner; all fruit/food/coin/vehicle doodles
(mango, jollof, suya, puff puff, zobo, coin, danfo/bus/car) from margins,
hero, Play overlay, footer skyline, loader and 404; the straight-line
top runner/road; the hero oval orbit; page-edge/section lines.

Added: accessible word-by-word headline hover on every page, a single
eye-tracking *Naija vibes* mascot on every page (blink, brows, speech,
wiggle, touch auto-look), and one scroll-driven danfo in the side margin
(wavy path, idle bounce, spinning wheels, star puffs, 25% over text,
parked under reduced motion).

Kept: stars, tournament trophy + clock, leaderboard medals, footer
skyline, hero underline, reveals, microcopy, card hover, click sparkles
and shouts.
