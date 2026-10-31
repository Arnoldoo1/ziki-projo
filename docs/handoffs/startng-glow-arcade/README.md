# start.ng — The Glow Arcade (handoff)

A complete, tested change set that adds a whimsical, magical arcade layer to
the start.ng landing page (`/`) and sign-in page (`/signin`) **without
changing the site's original cream, ink and lime theme**. It was authored
against `Arnoldoo1/startng` at commit `ee8a557` (branch `main`).

**Why it lives here:** the automation identity used for this session has
read-only access to `Arnoldoo1/startng` (`push: false`), so the commit could
not be pushed to that repo or deployed to `startng-three.vercel.app`.
Everything is preserved in `startng-glow-arcade.patch` so it can be applied
in one command.

## Apply it

```bash
git clone https://github.com/Arnoldoo1/startng.git
cd startng
git checkout -b whimsy/glow-arcade
git am /path/to/startng-glow-arcade.patch
npm ci
npm run build
npm run dev
```

Then open `http://localhost:3000/` and `http://localhost:3000/signin`.
Merge the branch into `main` and let the existing Vercel project deploy.

## What the patch contains

- **Theme preserved** — the page background, body text, nav, footer, cards,
  typography and the Daily Challenge card stay exactly as the original start.ng
  theme. Only the landing hero and sign-in page get the extra magic.
- **Hero** — soft lime / mint / gold washes, drifting glowing orbs and tiny
  firefly specks over the normal cream background.
- **Headline** — Baloo 2 (self-hosted, loaded with `next/font/local`) in the
  house ink colour, with a glowing lime-to-gold wavy ribbon behind “Good games.”
  instead of a flat marker. Every other heading and label keeps the house font.
- **Buttons** — `Play now` and `Create free account` are chunky 3-D arcade
  buttons in the original dark-button and cream-ghost colours, with press
  depth, hover bounce, lime glow and sparkles.
- **Today's Tournament** — a tilted, translucent glass card with a slowly
  pulsing lime border, breathing shadow and floating cover thumbnails. The
  Daily Challenge card is untouched.
- **Sign-in** — the original cream card with its lime offset shadow, now with a
  glowing lime marker behind “Every game.”, soft orbs, sparks and a chunky
  arcade button. The sign-in modal itself is the original one.
- **Micro-interactions** — a lime-and-gold star cursor with a spark trail and a
  subtle pointer tilt on the glass cards. Both are disabled for
  `prefers-reduced-motion` and on touch devices.
- **Dark mode** — works through the site's existing `data-theme` tokens.
- **Scope** — every rule is under `.whimsy` in `app/whimsy.css`; behaviour
  lives in `components/WhimsyLayer.tsx` and `components/WhimsyOrbs.tsx`.

## Verification done

- `tsc --noEmit` clean, `next build` clean.
- Computed-style audits in light, dark and mobile: body `#f6f5ee` / ink
  `#292a23`, ink headline, lime ribbon, dark primary + cream secondary,
  translucent glass card with working `backdrop-filter`, original challenge
  card, no horizontal overflow.
- Headless Chromium (1440×1000 and 390×844) screenshots:
  `home-desktop.jpg`, `home-mobile.jpg`, `home-dark.jpg`, `signin.jpg`,
  `signin-modal.jpg`.
- Deployed to a Vercel temporary URL during validation and re-checked there.

The screenshots in this folder are from the local production build of the
patched code.
