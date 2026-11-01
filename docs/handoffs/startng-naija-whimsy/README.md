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

## Deployment status

**Not deployed yet.** The current `https://nimble-xenon-4wygl2l.tmp.now/`
still serves the previous build. I am waiting for the word **deploy**. That URL
is an unauthenticated Vercel temporary deployment: redeploying the same
anonymous project can replace it, but Vercel may issue a new temporary
hostname. For an exact-URL update the project must be claimed / logged in.
