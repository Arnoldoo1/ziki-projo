'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Doodle, type DoodleName } from './WhimsyDoodles';

const FX_COLORS = ['#7a9a00', '#c98a00', '#c0392b', '#0f766e', '#292a23'];
const SPARK_CHARS = ['✦', '✧'];
const REDUCED = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

const DOODLES_BY_ROUTE: { test: (path: string) => boolean; names: DoodleName[] }[] = [
  { test: (p) => p === '/', names: ['danfo', 'jollof', 'mango', 'trophy'] },
  { test: (p) => p === '/tournament', names: ['trophy', 'crown', 'clock', 'coin'] },
  { test: (p) => p === '/leaderboard', names: ['crown', 'medal', 'coin', 'mango'] },
  { test: (p) => p === '/creators' || p.startsWith('/creators/'), names: ['zobo', 'puff', 'mango', 'coin'] },
  { test: (p) => p === '/docs', names: ['coin', 'danfo', 'puff', 'jollof'] },
  { test: (p) => p === '/about', names: ['suya', 'zobo', 'jollof', 'mango'] },
  { test: (p) => p === '/signin', names: ['puff', 'zobo', 'coin', 'jollof'] },
  { test: (p) => p === '/hangout', names: ['danfo', 'puff', 'coin', 'mango'] },
  { test: (p) => p.startsWith('/toybox'), names: ['mango', 'zobo', 'coin', 'danfo'] },
  { test: (p) => p.startsWith('/games') || p.startsWith('/categories'), names: ['coin', 'puff', 'mango', 'danfo'] },
];

function doodlesFor(pathname: string) {
  return DOODLES_BY_ROUTE.find((row) => row.test(pathname))?.names ?? ['danfo', 'jollof', 'coin', 'mango'];
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, className: string) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function removeLater(el: HTMLElement, ms = 800) {
  el.addEventListener('animationend', () => el.remove(), { once: true });
  window.setTimeout(() => el.remove(), ms);
}

function spark(fx: HTMLElement, x: number, y: number, color: string, char: string, size: number, angle: number, distance: number) {
  const el = node('span', 'wd-fx-spark');
  el.textContent = char;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${size}px`;
  el.style.color = color;
  el.style.setProperty('--wd-dx', `${Math.cos(angle) * distance}px`);
  el.style.setProperty('--wd-dy', `${Math.sin(angle) * distance}px`);
  fx.appendChild(el);
  removeLater(el, 750);
}

function coin(fx: HTMLElement, x: number, y: number, angle: number, distance: number) {
  const el = node('span', 'wd-fx-coin');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty('--wd-dx', `${Math.cos(angle) * distance}px`);
  el.style.setProperty('--wd-dy', `${Math.sin(angle) * distance}px`);
  fx.appendChild(el);
  removeLater(el, 750);
}

function confetti(fx: HTMLElement, x: number, y: number, count = 18) {
  for (let i = 0; i < count; i += 1) {
    const el = node('span', 'wd-fx-confetti');
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 60 + Math.random() * 90;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.background = FX_COLORS[i % FX_COLORS.length];
    el.style.width = `${5 + Math.random() * 6}px`;
    el.style.height = `${3 + Math.random() * 5}px`;
    el.style.setProperty('--wd-dx', `${Math.cos(angle) * distance}px`);
    el.style.setProperty('--wd-dy', `${Math.sin(angle) * distance}px`);
    el.style.setProperty('--wd-rot', `${Math.random() * 540 - 270}deg`);
    fx.appendChild(el);
    removeLater(el, 1000);
  }
}

function burst(fx: HTMLElement, x: number, y: number, big = false) {
  if (REDUCED()) return;
  const ring = node('span', 'wd-fx-ring');
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.setProperty('--wd-ring', big ? '#c98a00' : '#7a9a00');
  fx.appendChild(ring);
  removeLater(ring, 700);

  const sparks = big ? 12 : 8;
  for (let i = 0; i < sparks; i += 1) {
    spark(
      fx,
      x,
      y,
      FX_COLORS[i % 4],
      SPARK_CHARS[i % 2],
      big ? 20 + Math.random() * 8 : 15 + Math.random() * 6,
      (i / sparks) * Math.PI * 2,
      big ? 70 + Math.random() * 50 : 38 + Math.random() * 30,
    );
  }
  coin(fx, x, y, Math.PI * 0.2, big ? 90 : 50);
  coin(fx, x, y, Math.PI * 1.2, big ? 110 : 60);
  if (big) confetti(fx, x, y, 16);
}

const SPARKLES = [
  { x: '2.4%', y: '15%', size: 22, char: '✦', tone: 'wd-s1', delay: '0s', dur: '4.8s' },
  { x: '96.8%', y: '12%', size: 18, char: '✧', tone: 'wd-s2', delay: '-1.4s', dur: '5.6s' },
  { x: '3.2%', y: '46%', size: 16, char: '✧', tone: 'wd-s3', delay: '-2.6s', dur: '4.2s' },
  { x: '96.2%', y: '42%', size: 24, char: '✦', tone: 'wd-s4', delay: '-0.8s', dur: '6.2s' },
  { x: '2.8%', y: '76%', size: 18, char: '✦', tone: 'wd-s2', delay: '-3.2s', dur: '5.2s' },
  { x: '96.6%', y: '74%', size: 16, char: '✧', tone: 'wd-s1', delay: '-2s', dur: '4.6s' },
  { x: '7%', y: '90%', size: 20, char: '✦', tone: 'wd-s3', delay: '-1.1s', dur: '5.8s' },
  { x: '91%', y: '88%', size: 18, char: '✧', tone: 'wd-s4', delay: '-3.8s', dur: '5s' },
];

type Anchors = {
  signin: HTMLElement | null;
  auth: HTMLElement | null;
  tourney: HTMLElement | null;
  footer: HTMLElement | null;
  medals: HTMLElement[];
};

export function WhimsyDecor() {
  const pathname = usePathname();
  const names = useMemo(() => doodlesFor(pathname), [pathname]);
  const fxRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<Anchors>({ signin: null, auth: null, tourney: null, footer: null, medals: [] });
  const [authRect, setAuthRect] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.whimsy = 'on';
    return () => {
      delete root.dataset.whimsy;
    };
  }, []);

  // Cursor trail, click bursts, hover sparkles and playful tooltips.
  useEffect(() => {
    const fx = fxRef.current;
    if (!fx) return;
    let lastTrail = 0;
    let tip: HTMLElement | null = null;

    const hideTip = () => {
      tip?.remove();
      tip = null;
    };

    const onMove = (event: PointerEvent) => {
      if (REDUCED() || !FINE()) return;
      const now = performance.now();
      if (now - lastTrail < 55) return;
      lastTrail = now;
      const el = node('span', 'wd-trail');
      el.textContent = SPARK_CHARS[Math.floor(Math.random() * 2)];
      el.style.left = `${event.clientX}px`;
      el.style.top = `${event.clientY}px`;
      el.style.fontSize = `${10 + Math.random() * 7}px`;
      el.style.color = FX_COLORS[Math.floor(Math.random() * 4)];
      el.style.setProperty('--wd-dx', `${(Math.random() - 0.5) * 18}px`);
      el.style.setProperty('--wd-dy', `${8 + Math.random() * 14}px`);
      fx.appendChild(el);
      removeLater(el, 650);
    };

    const onDown = (event: PointerEvent) => {
      if (REDUCED()) return;
      const target = (event.target as Element | null)?.closest?.<HTMLElement>('a, button, summary, [role="button"]');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;
      const text = (target.textContent || '').toLowerCase();
      const big = Boolean(target.closest('.hero .actions')) || text.includes('play now') || text.includes('create free account');
      burst(fx, x, y, big);
      if (big) {
        const label = node('span', 'wd-sharp');
        label.textContent = 'Sharp sharp!';
        label.style.left = `${x}px`;
        label.style.top = `${y - 34}px`;
        fx.appendChild(label);
        removeLater(label, 950);
      }
      hideTip();
      target.classList.remove('wd-squish');
      void target.offsetWidth;
      target.classList.add('wd-squish');
      window.setTimeout(() => target.classList.remove('wd-squish'), 280);
    };

    const onOver = (event: PointerEvent) => {
      if (REDUCED() || !FINE()) return;
      const target = event.target as Element | null;
      if (!target) return;
      const card = target.closest<HTMLElement>('.game, .tag-tile, .promo, .tourney-panel, .creator-banner, .panel, .board-card, .step');
      if (card) {
        const from = event.relatedTarget as Node | null;
        if (from && card.contains(from)) return;
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < 3; i += 1) {
          spark(fx, rect.right - 10, rect.top + 10, FX_COLORS[i], SPARK_CHARS[i % 2], 15 + i * 2, -0.6 - i * 0.5, 22 + i * 8);
        }
      }
      const tipTarget = target.closest<HTMLElement>('.btn, .ghost, .nav-signin, .nav nav a');
      if (tipTarget && (tipTarget.textContent || '').trim().length > 1) {
        hideTip();
        tip = node('span', 'wd-tip');
        tip.textContent = 'Sharp sharp!';
        const r = tipTarget.getBoundingClientRect();
        tip.style.left = `${Math.min(Math.max(r.left + r.width / 2, 70), window.innerWidth - 70)}px`;
        tip.style.top = `${Math.max(12, r.top - 10)}px`;
        fx.appendChild(tip);
      }
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.('.btn, .ghost, .nav-signin, .nav nav a')) return;
      hideTip();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('scroll', hideTip, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('scroll', hideTip);
      hideTip();
    };
  }, []);

  // Anchor the sign-in mascot, tournament props, medals and footer strip.
  useEffect(() => {
    let timer = 0;
    let authObserver: MutationObserver | null = null;

    const computeRect = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const mobile = window.innerWidth < 600;
      const modal = el.classList.contains('auth-card');
      const offset = modal ? (mobile ? 62 : 78) : (mobile ? 46 : 60);
      return { top: r.top - offset, left: Math.max(8, r.left - 4) };
    };
    const updateRect = (el: HTMLElement | null) => {
      const next = el ? computeRect(el) : null;
      setAuthRect((prev) => {
        if (!next || !prev) return next;
        return Math.abs(prev.top - next.top) < 1 && Math.abs(prev.left - next.left) < 1 ? prev : next;
      });
    };

    const apply = () => {
      const signin = document.querySelector<HTMLElement>('.signin-card');
      const auth = document.querySelector<HTMLElement>('.auth-card');
      const tourney = document.querySelector<HTMLElement>('.tourney-panel');
      const footer = document.querySelector<HTMLElement>('footer:not(.sm-footer)');
      const medals = Array.from(document.querySelectorAll<HTMLElement>('.lb-table tbody tr'))
        .slice(0, 3)
        .map((row) => row.querySelector<HTMLElement>('td:first-child'))
        .filter((cell): cell is HTMLElement => Boolean(cell));

      [signin, auth, tourney, footer].forEach((el) => el?.classList.add('wd-anchor'));
      medals.forEach((cell) => cell.classList.add('wd-medal-anchor'));
      footer?.classList.add('wd-has-skyline');
      setAnchors({ signin, auth, tourney, footer, medals });
      updateRect(auth);

      if (pathname === '/leaderboard' && !REDUCED() && !sessionStorage.getItem('wd-leader-confetti')) {
        const table = document.querySelector<HTMLElement>('.lb-table');
        if (table && fxRef.current) {
          const rect = table.getBoundingClientRect();
          window.setTimeout(() => {
            confetti(fxRef.current!, rect.left + rect.width / 2, Math.max(90, rect.top + 40), 24);
            sessionStorage.setItem('wd-leader-confetti', '1');
          }, 500);
        }
      }
    };

    const wireAuth = (auth: HTMLElement | null) => {
      if (!auth) return;
      auth.classList.add('wd-anchor');
      const form = auth.querySelector<HTMLFormElement>('form.character-form');
      if (!form || form.dataset.wdWired === '1') return;
      form.dataset.wdWired = '1';
      form.addEventListener('submit', () => {
        const name = form.querySelector<HTMLInputElement>('#character-name')?.value.trim() ?? '';
        if (name.length < 2 || REDUCED()) return;
        const button = form.querySelector<HTMLElement>('button[type="submit"]');
        const rect = button?.getBoundingClientRect();
        window.setTimeout(() => {
          if (!fxRef.current) return;
          confetti(fxRef.current, rect ? rect.left + rect.width / 2 : window.innerWidth / 2, rect ? rect.top : window.innerHeight / 2, 28);
        }, 120);
      });
    };

    apply();
    timer = window.setTimeout(apply, 180);
    const onResize = () => {
      updateRect(document.querySelector<HTMLElement>('.auth-card'));
    };
    window.addEventListener('resize', onResize);
    wireAuth(document.querySelector<HTMLElement>('.auth-card'));

    authObserver = new MutationObserver(() => {
      const auth = document.querySelector<HTMLElement>('.auth-card');
      wireAuth(auth);
      setAnchors((prev) => (prev.auth === auth ? prev : { ...prev, auth }));
      updateRect(auth);
    });
    authObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      authObserver?.disconnect();
      document.querySelectorAll('.wd-anchor').forEach((el) => el.classList.remove('wd-anchor'));
      document.querySelectorAll('.wd-medal-anchor').forEach((el) => el.classList.remove('wd-medal-anchor'));
      document.querySelectorAll('.wd-has-skyline').forEach((el) => el.classList.remove('wd-has-skyline'));
      setAnchors({ signin: null, auth: null, tourney: null, footer: null, medals: [] });
      setAuthRect(null);
    };
  }, [pathname]);

  // Gentle scroll reveals for content below the first screen.
  useEffect(() => {
    if (REDUCED() || pathname === '/hangout' || pathname.startsWith('/toybox') || (pathname.startsWith('/games/') && pathname.endsWith('/play'))) return;
    let timer = 0;
    let observer: IntersectionObserver | null = null;

    const run = () => {
      const selector = 'main > section, main > div > section, .game, .tag-tile, .panel, .board-card, .step, .promo, .creator-banner, .tourney-panel, .lb-you, .faq details';
      const targets = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top > window.innerHeight && !el.classList.contains('wd-reveal');
      });
      if (!targets.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('wd-in');
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
      );
      targets.forEach((el, index) => {
        el.classList.add('wd-reveal');
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
        observer?.observe(el);
      });
    };

    timer = window.setTimeout(run, 240);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      document.querySelectorAll('.wd-reveal').forEach((el) => {
        el.classList.remove('wd-reveal', 'wd-in');
        (el as HTMLElement).style.transitionDelay = '';
      });
    };
  }, [pathname]);

  return (
    <div className="wd-decor" aria-hidden="true">
      <div className="wd-margin-layer">
        {names.map((name, index) => (
          <Doodle key={`${name}-${index}`} name={name} className={`wd-margin wd-margin-${index}`} />
        ))}
      </div>

      <div className="wd-spark-layer">
        {SPARKLES.map((s, index) => (
          <span
            key={index}
            className={`wd-fixed-spark ${s.tone}`}
            style={{ left: s.x, top: s.y, fontSize: s.size, animationDelay: s.delay, animationDuration: s.dur }}
          >
            {s.char}
          </span>
        ))}
      </div>

      <div className="wd-runner">
        <span className="wd-runner-road" />
        <Doodle name="danfo" className="wd-runner-bus" />
      </div>

      <div className="wd-fx" ref={fxRef} />

      {pathname === '/' && (
        <div className="wd-home-mascot">
          <span className="wd-speech wd-speech-home">Naija vibes ✦</span>
          <Doodle name="mascot" />
        </div>
      )}

      {anchors.signin && !anchors.auth
        ? createPortal(<SigninMascot modal={false} />, anchors.signin)
        : null}
      {anchors.auth && authRect ? <AuthMascot rect={authRect} /> : null}
      {anchors.tourney ? createPortal(<TournamentProps />, anchors.tourney) : null}
      {anchors.footer ? createPortal(<FooterProps />, anchors.footer) : null}
      {anchors.medals.map((cell, rank) => (
        <Fragment key={rank}>{createPortal(<MedalProps rank={rank} />, cell)}</Fragment>
      ))}
    </div>
  );
}

function AuthMascot({ rect }: { rect: { top: number; left: number } }) {
  return (
    <div className='wd-auth-mascot' style={{ top: rect.top, left: rect.left }}>
      <span className='wd-speech wd-speech-auth'>Oya, come in!</span>
      <Doodle name='mascot' />
    </div>
  );
}

function SigninMascot({ modal }: { modal: boolean }) {
  return (
    <div className={`wd-signin-mascot${modal ? ' wd-signin-mascot-modal' : ''}`}>
      <span className="wd-speech wd-speech-signin">Oya, come in!</span>
      <Doodle name="mascot" />
    </div>
  );
}

function TournamentProps() {
  return (
    <div className="wd-tourney-props">
      <span className="wd-trophy"><Doodle name="trophy" /></span>
      <span className="wd-clock"><Doodle name="clock" /></span>
    </div>
  );
}

function MedalProps({ rank }: { rank: number }) {
  return (
    <span className={`wd-medal wd-medal-${rank + 1}`}>
      {rank === 0 ? <Doodle name="crown" /> : <Doodle name="medal" />}
      <span className="wd-medal-spark">✦</span>
    </span>
  );
}

function FooterProps() {
  return (
    <>
      <svg className="wd-skyline" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40V31h38v-9h22v9h18V18h34v22h16V27h30v13h20V14h36v26h18V24h26v16h14V19h30v21h18V29h34v11h14V13h40v27h18V25h26v15h12V20h30v20h18V28h30v12h14V15h38v25h18V24h26v16h12V19h34v21h18V30h38v10h14V17h42v23h18V26h24v14h12V20h34v20h18V28h30v12h14V16h40v24h16V27h30v13h16V22h34v18h14V29h32v11h12V18h38v22h16V26h30v14h12V21h34v19h14V30h40v10h14V19h34v21h12V27h28v13H0Z" fill="var(--wd-lime)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M96 40V20l16-10 16 10v20M244 40V12l18-9 18 9v28M392 40V17l16-8 16 8v23M560 40V14l18-10 18 10v26M706 40V22l15-9 15 9v18M900 40V15l16-9 16 9v25M1052 40V20l16-10 16 10v20" fill="var(--wd-gold)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M160 40V28h24v12M310 40V31h28v9M470 40V26h22v14M630 40V31h26v9M800 40V25h24v15M980 40V30h30v10M1130 40V26h26v14" fill="var(--wd-red)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <rect x="520" y="29" width="52" height="11" rx="3" fill="var(--wd-orange)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <circle cx="532" cy="40" r="3" fill="var(--wd-outline)" />
        <circle cx="560" cy="40" r="3" fill="var(--wd-outline)" />
        <path d="M1040 40V18l6-12 6 12M1046 10c-7-7-2-13 5-12-1 6-2 10-5 12M1046 10c7-7 12-2 11 5-6-1-9-2-11-5" fill="var(--wd-green)" stroke="var(--wd-outline)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="wd-signoff">No wahala ✦</span>
    </>
  );
}
