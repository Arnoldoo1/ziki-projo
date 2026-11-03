'use client';

import { useEffect, useRef } from 'react';

function puff(container: HTMLDivElement, rect: DOMRect) {
  const el = document.createElement('span');
  el.className = 'wd-danfo-puff';
  el.textContent = '✦';
  el.style.left = `${rect.left + rect.width * (0.2 + Math.random() * 0.4)}px`;
  el.style.top = `${rect.top + rect.height * 0.55}px`;
  el.style.fontSize = `${10 + Math.random() * 5}px`;
  el.style.color = Math.random() > 0.5 ? 'var(--wd-spark-1)' : 'var(--wd-spark-2)';
  container.appendChild(el);
  const remove = () => el.remove();
  el.addEventListener('animationend', remove, { once: true });
  window.setTimeout(remove, 900);
}

/** The only vehicle: a yellow danfo with a black stripe, driving down the
 *  side margin as the page scrolls, idling with bouncing wheels when stopped.
 *  It is fixed, pointer-events: none, and fades to 25% over text-heavy areas. */
export function ScrollDanfo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const puffsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const puffs = puffsRef.current;
    if (!root || !puffs) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      root.classList.add('is-parked');
      root.style.transform = 'translate3d(0, 42vh, 0)';
      return;
    }

    let frame = 0;
    let idleTimer = 0;
    let lastY = window.scrollY;
    let lastPuff = 0;

    const update = () => {
      frame = 0;
      const sy = window.scrollY;
      const travel = Math.max(240, window.innerHeight - 190);
      const y = 82 + ((sy * 0.42) % travel);
      const wave = Math.sin(sy / 170) * 16;
      const tilt = Math.cos(sy / 170) * 5;
      const direction = sy >= lastY ? 1 : -1;
      lastY = sy;
      root.style.transform = `translate3d(${wave.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) scaleX(${direction})`;
      root.classList.add('is-driving');
      root.classList.remove('is-idle');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.classList.remove('is-driving');
        root.classList.add('is-idle');
      }, 160);

      const rect = root.getBoundingClientRect();
      let overText = false;
      const probes: [number, number][] = [
        [rect.left + rect.width / 2, rect.top + 10],
        [rect.left + rect.width / 2, rect.top + rect.height / 2],
        [rect.left + rect.width / 2, rect.top + rect.height - 10],
        [rect.left + 6, rect.top + rect.height / 2],
        [rect.right - 6, rect.top + rect.height / 2],
      ];
      for (const [px, py] of probes) {
        const el = document.elementFromPoint(px, py);
        if (el?.closest('h1,h2,h3,p,a,button,input,label,select,textarea,.game,.card,.panel,.tag-tile,.promo,.board-card,.lb-table,.docs-content,.auth-card')) {
          overText = true;
          break;
        }
      }
      root.classList.toggle('is-over-text', overText);

      const now = performance.now();
      if (now - lastPuff > 130) {
        lastPuff = now;
        puff(puffs, rect);
      }
    };

    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      puffs.replaceChildren();
    };
  }, []);

  return (
    <div className="wd-danfo-wrap" aria-hidden="true">
      <div ref={rootRef} className="wd-danfo is-idle">
        <svg viewBox="0 0 120 78" className="wd-svg">
          <g className="wd-danfo-body">
            <rect x="6" y="24" width="108" height="36" rx="10" fill="var(--wd-yellow)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
            <path d="M20 24 31 8h42l11 16" fill="var(--wd-yellow)" stroke="var(--wd-outline)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
            <rect x="37" y="11" width="13" height="9" rx="2" fill="var(--wd-teal)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <rect x="54" y="11" width="13" height="9" rx="2" fill="var(--wd-teal)" stroke="var(--wd-outline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M6 42h108" stroke="#1b1c14" strokeWidth="9" />
            <path d="M6 42h108" stroke="var(--wd-lime)" strokeWidth="2" opacity=".55" />
            <rect x="14" y="29" width="17" height="7" rx="2" fill="var(--wd-orange)" stroke="var(--wd-outline)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
            <circle cx="106" cy="33" r="3.4" fill="#fffdf6" stroke="var(--wd-outline)" strokeWidth="1.8" />
            <g className="wd-danfo-wheel">
              <circle cx="30" cy="62" r="9" fill="var(--wd-outline)" />
              <circle cx="30" cy="62" r="4" fill="var(--wd-gold)" />
              <path d="M30 55v14M23 62h14" stroke="var(--wd-gold)" strokeWidth="2" />
            </g>
            <g className="wd-danfo-wheel">
              <circle cx="92" cy="62" r="9" fill="var(--wd-outline)" />
              <circle cx="92" cy="62" r="4" fill="var(--wd-gold)" />
              <path d="M92 55v14M85 62h14" stroke="var(--wd-gold)" strokeWidth="2" />
            </g>
          </g>
        </svg>
      </div>
      <div ref={puffsRef} className="wd-danfo-puffs" />
    </div>
  );
}
