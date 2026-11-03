import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container notfound">
      <div>
        <p className="eyebrow-small">404</p>
        <h1>This page is out playing.</h1>
        <p>The link you followed does not exist, or the game packed up and went home. Try the games shelf instead.</p>
        <p className="wd-404-line">Wahala! This page is on a hustle. Go back home.</p>
        <div className="actions" style={{ justifyContent: 'center' }}>
          <Link className="btn" href="/games">Browse all games</Link>
          <Link className="ghost" href="/">Back home</Link>
        </div>
      </div>
    </main>
  );
}
