# start.ng — The Glow Arcade, site-wide (handoff)

A complete, tested change set that gives **every page of start.ng** a
whimsical, magical arcade layer while keeping the original cream, ink and
lime theme. It was authored against `Arnoldoo1/startng` at commit `ee8a557`
(branch `main`).

**Why it lives here:** the automation identity used for this session has
read-only access to `Arnoldoo1/startng` (`push: false`), so the commit could
not be pushed to that repo. Everything is preserved in
`startng-glow-arcade.patch` so it can be applied in one command.

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

Then merge the branch into `main` and let the Vercel project deploy.

## What the patch contains

- **Every site page** — games, categories, game detail, tournament,
  leaderboard, creators, docs, about, profile and sign-in now share the
  Glow Arcade layer. The immersive play/hangout routes and The Sun Market
  stay their own experiences.
- **Background** — `.whimsy-site` wraps the site chrome; soft lime / mint /
  gold washes, drifting orbs and firefly specks sit behind every page on the
  normal cream background.
- **Typography** — Baloo page titles and section headings with a lime star
  after each page title. Body copy, docs prose, footer headings and game-card
  titles keep the house font.
- **Buttons** — every `.btn`, `.ghost`, nav CTA and Google button is a chunky
  3-D arcade button in the original dark/cream colours, with a lime glow and
  sparkle on hover.
- **Glass** — filter/search bars, docs sidebar, profile header, panels,
  boards, email and submit cards, modals, the auth card, help panel and
  toasts.
- **Details** — lime active chips/tabs/segments/pagination, lime focus rings,
  lime nav and footer underlines, card sparkle and glow on hover, the
  tournament panel's pulsing conic border, leaderboard row highlights and
  creator art that responds to the pointer.
- **Micro-interactions** — one `WhimsyLayer` for the whole site: lime-and-gold
  star cursor with a spark trail, plus pointer tilt on game, category, promo,
  board, profile and panel cards. It re-scans after navigation and is off for
  touch and `prefers-reduced-motion`.
- **Dark mode** — works through the site's existing `data-theme` tokens.
- **Scope** — the home hero keeps its glowing lime-and-gold ribbon; all rules
  are scoped under `.whimsy` in `app/whimsy.css`.

## Verification done

- `tsc --noEmit` clean, `next build` clean.
- All site pages audited at 1440×1000 and 390×844: zero horizontal overflow.
- Computed-style checks: cream body, Baloo titles, chunky buttons, glass
  search/docs/profile panels, lime stars, working tilt on games, tournament
  and leaderboard, modal glass, light + dark mode.
- Headless screenshots: `home-desktop.jpg`, `games.jpg`, `tournament.jpg`,
  `leaderboard.jpg`, `creators.jpg`, `categories.jpg`, `docs.jpg`,
  `signin.jpg`, `signin-modal.jpg`, `games-mobile.jpg`, `games-dark.jpg`.
- Deployed to a Vercel temporary URL and re-checked there.

The screenshots in this folder are from that live build.
