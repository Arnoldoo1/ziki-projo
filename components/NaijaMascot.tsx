'use client';

import { useEffect, useRef, useState } from 'react';

const PHRASES = ['Sharp sharp!', 'Oya, play!', 'No wahala!', 'E sweet!', 'Correct!'];

/** The single Naija vibes mascot. Eyes track the pointer (or wander slowly on
 *  touch), eyebrows lift when the pointer is close, it blinks, bobs, talks on
 *  hover and wiggles when clicked. Decorative and corner-docked. */
export function NaijaMascot() {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftPupil = useRef<SVGCircleElement>(null);
  const rightPupil = useRef<SVGCircleElement>(null);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [talking, setTalking] = useState(false);
  const [wiggling, setWiggling] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const talkTimer = useRef(0);

  const talk = () => {
    setPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    setTalking(true);
    window.clearTimeout(talkTimer.current);
    talkTimer.current = window.setTimeout(() => setTalking(false), 1900);
  };

  const poke = () => {
    talk();
    setWiggling(true);
    window.setTimeout(() => setWiggling(false), 640);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let frame = 0;
    let pointer = false;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const follow = () => {
      let dx: number;
      let dy: number;
      if (fine && pointer) {
        const r = root.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height * 0.42;
        const vx = tx - ex;
        const vy = ty - ey;
        const len = Math.max(1, Math.hypot(vx, vy));
        const reach = Math.min(1, len / 260);
        dx = (vx / len) * 4.6 * reach;
        dy = (vy / len) * 3.6 * reach;
        root.classList.toggle('is-near', len < 280);
      } else {
        const t = performance.now();
        dx = Math.sin(t / 1600) * 4.2;
        dy = Math.sin(t / 2300) * 2.8;
        root.classList.remove('is-near');
      }
      const ease = reduced ? 1 : 0.18;
      cx += (dx - cx) * ease;
      cy += (dy - cy) * ease;
      const value = `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`;
      leftPupil.current?.setAttribute('transform', value);
      rightPupil.current?.setAttribute('transform', value);
      frame = window.requestAnimationFrame(follow);
    };

    const onMove = (event: PointerEvent) => {
      pointer = true;
      tx = event.clientX;
      ty = event.clientY;
    };

    frame = window.requestAnimationFrame(follow);
    window.addEventListener('pointermove', onMove, { passive: true });

    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setBlinking(true);
        window.setTimeout(() => setBlinking(false), 140);
        scheduleBlink();
      }, 2800 + Math.random() * 3200);
    };
    scheduleBlink();

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(blinkTimer);
      window.clearTimeout(talkTimer.current);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`wd-mascot${wiggling ? ' is-wiggling' : ''}${blinking ? ' is-blinking' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Naija vibes mascot"
      onClick={poke}
      onPointerEnter={talk}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); poke(); } }}
    >
      <span className={`wd-mascot-bubble${talking ? ' is-talking' : ''}`}>{phrase}</span>
      <svg viewBox="0 0 120 150" className="wd-mascot-svg" aria-hidden="true">
        <path d="M30 146c0-26 13-38 30-38s30 12 30 38" fill="var(--wd-lime)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        <path d="M44 110c4-12 28-12 32 0" fill="var(--wd-gold)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        <path d="M24 124c-8-4-12-12-10-20M96 124c8-4 12-12 10-20" fill="none" stroke="var(--wd-outline)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="60" cy="64" r="43" fill="var(--wd-gold)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        <path d="M18 56C20 26 40 14 60 14s40 12 42 42c-12-10-26-14-42-14S30 46 18 56Z" fill="var(--wd-lime)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        <path className="wd-mascot-brow" d="M30 44c7-7 17-8 24-2M66 42c7-6 17-5 24 2" fill="none" stroke="var(--wd-outline)" strokeWidth="3.2" strokeLinecap="round" />
        <g className="wd-mascot-eyes">
          <circle className="wd-mascot-eye" cx="43" cy="68" r="15" fill="#fffdf6" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
          <circle className="wd-mascot-eye" cx="77" cy="68" r="15" fill="#fffdf6" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
          <circle ref={leftPupil} className="wd-mascot-pupil" cx="43" cy="68" r="6.6" fill="var(--wd-outline)" />
          <circle ref={rightPupil} className="wd-mascot-pupil" cx="77" cy="68" r="6.6" fill="var(--wd-outline)" />
          <circle cx="46" cy="64" r="2" fill="#fffdf6" />
          <circle cx="80" cy="64" r="2" fill="#fffdf6" />
        </g>
        <path d="M46 88c5 6 23 6 28 0" fill="none" stroke="var(--wd-outline)" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="28" cy="82" r="6" fill="var(--wd-red)" opacity=".85" />
        <circle cx="92" cy="82" r="6" fill="var(--wd-red)" opacity=".85" />
        <path d="M60 104l4 9 9 1.4-6.6 6.4 1.6 9L60 125.4l-8 4.2 1.6-9-6.6-6.4 9-1.4Z" fill="var(--wd-gold)" stroke="var(--wd-outline)" strokeWidth="2" />
      </svg>
    </div>
  );
}
