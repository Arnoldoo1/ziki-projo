# start.ng — The Glow Arcade (handoff)

A complete, tested change set that gives the start.ng landing page (`/`) and
sign-in page (`/signin`) a whimsical, magical arcade skin. It was authored
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

- **Hero** — twilight gradient band, drifting glowing orbs, twinkling stars,
  and a soft star-field.
- **Headline** — Baloo 2 (self-hosted, loaded with `next/font/local`), with a
  glowing wavy-ribbon highlight behind “Good games.” instead of a flat marker.
- **Buttons** — `Play now` and `Create free account` are chunky 3-D arcade
  buttons with press depth, hover bounce, glow and sparkles.
- **Today's Tournament** (and the Daily Challenge) — tilted glassmorphism
  cards with a slowly rotating/pulsing conic-gradient border, breathing
  shadow and floating cover thumbnails.
- **Micro-interactions** — a star-wand custom cursor with a spark trail, and
  a subtle pointer tilt on the glass cards. Both are disabled for
  `prefers-reduced-motion` and on touch devices.
- **Sign-in** — the route now shows a glass card with a gradient headline and
  an arcade Google button; the modal that opens from it (and from the home
  page nav) matches. The old auto-open-the-modal-on-arrival behaviour is
  removed so the page itself is the destination.
- **Scope** — every rule is under `.whimsy` in `app/whimsy.css`; the rest of
  the site is untouched. Behaviour lives in `components/WhimsyLayer.tsx` and
  `components/WhimsyOrbs.tsx`.

## Verification done

- `tsc --noEmit` clean, `next build` clean.
- Headless Chromium (1440×1000 and 390×844) screenshots:
  `home-desktop.jpg`, `home-mobile.jpg`, `signin.jpg`, `signin-modal.jpg`.
- Interaction checks: tilt vars update on pointer move, the cursor follows and
  emits a spark trail, and both opt out under reduced motion / touch.
- Modal open/close and the sign-in → Google flow work with the new styles.

The screenshots in this folder are from the local production build of the
patched code.
