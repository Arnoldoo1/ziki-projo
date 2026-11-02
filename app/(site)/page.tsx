import Link from 'next/link';
import { CategoryTile, GameCard, CreatorCard } from '@/components/Cards';
import { HomePromos } from '@/components/HomePromos';
import { HeroMagic } from '@/components/HeroMagic';
import { categories, creators, games } from '@/lib/site';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { DEFAULT_CHARACTER } from '@/lib/character';

export default function HomePage() {
  const picks = categories.filter((c) => !c.group.includes('Words people search')).slice(0, 8);
  const newThisWeek = [...games]
    .filter((g) => g.slug !== 'the-hangout')
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);
  const hangout = games.find((g) => g.slug === 'the-hangout')!;
  const mostPlayed = [hangout, ...games.filter((g) => g.slug !== 'the-hangout').sort((a, b) => b.plays - a.plays)].slice(0, 8);
  const indie = creators.slice(0, 4);
  const az = [...games].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main>
      <section className="container hero wd-hero-magic-on">
        <HeroMagic />
        <p className="eyebrow">Big imagination. Played everywhere.</p>
        <h1>Good vibes.<br /><mark>Good games.</mark></h1>
        <p className="lead">
          Games made by builders in the community.<br />
          Each one lives at its own start.ng address.<br />
          Pick one and play right in your browser.
        </p>
        <div className="actions">
          <a className="btn" href="#games">Play now</a>
          <Link className="ghost" href="/signin">Create free account</Link>
        </div>
      </section>

      <HomePromos />

      <section className="container tags-picks" aria-labelledby="pick-category">
        <div className="section-head">
          <h2 id="pick-category">Pick a category</h2>
          <Link className="see-all" href="/categories">All categories →</Link>
        </div>
        <div className="tag-grid">{picks.map((c) => <CategoryTile key={c.slug} category={c} />)}</div>
      </section>

      <section className="container shelves" aria-labelledby="new-this-week">
        <div className="section-head">
          <div>
            <p className="eyebrow">New this week</p>
            <h2 id="new-this-week">Every new game shows here first</h2>
          </div>
        </div>
        <div className="shelf-grid">{newThisWeek.map((g) => <GameCard key={g.slug} game={g} />)}</div>
      </section>

      <section className="container home-games" id="games" aria-labelledby="community-games">
        <div className="section-head">
          <div>
            <p className="eyebrow">Most played</p>
            <h2 id="community-games">Games from the community</h2>
            <p className="sub">What everyone&apos;s playing this week</p>
          </div>
          <Link className="see-all" href="/games">See all 189 games →</Link>
        </div>
        <div className="grid">{mostPlayed.map((g) => <GameCard key={g.slug} game={g} />)}</div>
        <div className="center-cta"><Link className="btn" href="/games">See all 189 games</Link></div>
        <details className="az-games">
          <summary>Every game on start.ng, A to Z (189) <span>⌄</span></summary>
          <div className="az-grid">
            {az.map((g) => <Link key={g.slug} href={`/games/${g.slug}`}>{g.title}</Link>)}
          </div>
        </details>
      </section>

      <section className="container creators" id="creators">
        <div className="creator-banner">
          <div>
            <span className="creator-badge">Independent creator</span>
            <h2>Explore games from independent creators</h2>
            <p>Games made and hosted by creators everywhere, from itch.io to their own sites. Find something new, or show the community what you&apos;ve made.</p>
            <div className="actions">
              <Link className="btn" href="/creators">Explore games</Link>
              <Link className="ghost" href="/creators#submit">Submit your game</Link>
            </div>
          </div>
          <div className="creator-art" aria-hidden="true">
            {creators.slice(0, 3).map((c) => <span key={c.slug}><img src={c.cover} alt="" /></span>)}
          </div>
        </div>

        <div className="new-creators">
          <div className="section-head">
            <h2 style={{ fontSize: '1.2rem' }}>New from independent creators</h2>
            <Link className="see-all" href="/creators">See all →</Link>
          </div>
          <div className="grid">{indie.map((c) => <CreatorCard key={c.slug} creator={c} />)}</div>
        </div>
      </section>

      <section className="container how" id="how">
        <div className="section-head">
          <h2>Got a game? Put it on start.ng</h2>
        </div>
        <div className="steps">
          <div className="step"><span className="num">01</span><h3>Build it</h3><p>Any static browser game: HTML, JavaScript, three.js, Phaser. Players bring their start.ng character, scores and friends.</p></div>
          <div className="step"><span className="num">02</span><h3>Push it to GitHub</h3><p>A public repo with a ready-to-play <code>index.html</code> at the top or in <code>dist/</code>, plus a <code>cover.png</code> for its card.</p></div>
          <div className="step"><span className="num">03</span><h3>Publish it</h3><p>One API call with your repo link, no key needed. Or hand your AI <code>start.ng/docs</code> and let it do the lot.</p></div>
          <div className="step"><span className="num">04</span><h3>Approve it once</h3><p>Open the link you get back and it&apos;s live at <code>yourgame.start.ng</code>, with its own leaderboard if you want one.</p></div>
        </div>
        <div className="how-actions">
          <Link className="btn" href="/docs">Read the docs</Link>
          <Link className="ghost" href="/docs.md">Docs for your AI (.md)</Link>
        </div>
      </section>

      <section className="container about" id="about">
        <h2>About start.ng</h2>
        <p>start.ng is Nigeria&apos;s home for browser games, built by the HNG community. Every game is free to play in your browser with no download, and many are made in Naija: danfo rush hour, jollof catching, Lagos markets and more.</p>
        <p>We&apos;re also building a home for web games from across Africa. If you make games anywhere on the continent, you can put yours on start.ng for free.</p>
        <Link className="more" href="/about">More about start.ng →</Link>

        <div className="faq">
          <details><summary>What is start.ng?</summary><p>A home for free browser games made by the HNG community. Each game has its own address, like yourgame.start.ng, and you play it right in your browser.</p></details>
          <details><summary>Is it free?</summary><p>Yes. Every game on start.ng is free to play in your browser. No download, no payment, no fuss.</p></details>
          <details><summary>Are there Nigerian or African web games?</summary><p>Plenty. You&apos;ll find Lagos runners, danfo games, jollof cooking, market dashes, Naija penalty shootouts and games from creators across Africa.</p></details>
          <details><summary>Do I need an account to play?</summary><p>No. Pick a game and play as a guest. Sign in when you want your scores kept, a character that follows you into every game, and a place in the daily tournament.</p></details>
          <details><summary>What is the daily tournament?</summary><p>Every day, five games are picked. Play them before 6 PM Nigeria time. First on a game gets 10 points, second 7, third 5, fourth 3, and everyone else who plays gets 1. Most points wins the day and climbs the overall leaderboard.</p></details>
          <details><summary>How do I put my game on start.ng?</summary><p>Build a static browser game, push it to a public GitHub repo, and call the publish API with the repo link. You approve it once and it lives at yourgame.start.ng. The <Link href="/docs">docs</Link> have every step.</p></details>
        </div>
      </section>

      <section className="container" aria-hidden="true" style={{ display: 'none' }}>
        <CharacterAvatar character={DEFAULT_CHARACTER} size={1} />
      </section>
    </main>
  );
}
