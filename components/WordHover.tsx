'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const WORD_COLORS = ['var(--wd-spark-1)', 'var(--wd-spark-2)', 'var(--wd-spark-3)', 'var(--wd-spark-4)'];

function wordSpark(fx: HTMLDivElement, rect: DOMRect) {
  for (let i = 0; i < 3; i += 1) {
    const el = document.createElement('span');
    el.className = 'wd-word-spark';
    el.textContent = i % 2 ? '✦' : '✧';
    el.style.left = `${rect.left + Math.random() * Math.max(8, rect.width)}px`;
    el.style.top = `${rect.top + Math.random() * Math.max(8, rect.height)}px`;
    el.style.fontSize = `${11 + Math.random() * 4}px`;
    el.style.color = WORD_COLORS[i % WORD_COLORS.length];
    el.style.setProperty('--wd-word-dx', `${(Math.random() - 0.5) * 22}px`);
    el.style.setProperty('--wd-word-dy', `${-10 - Math.random() * 14}px`);
    fx.appendChild(el);
    const remove = () => el.remove();
    el.addEventListener('animationend', remove, { once: true });
    window.setTimeout(remove, 700);
  }
}

/** Splits the first main heading into words and gives each one its own
 *  springy lift/tilt/colour/underline + tiny sparkles. The visible spans are
 *  aria-hidden; the heading keeps its full text in aria-label. */
export function WordHover() {
  const pathname = usePathname();
  const fxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fx = fxRef.current;
    if (!fx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    const disposers: (() => void)[] = [];

    const bind = (word: HTMLElement) => {
      if (word.dataset.wdBound === '1') return;
      word.dataset.wdBound = '1';
      const enter = () => {
        word.classList.add('is-live');
        if (!reduce) wordSpark(fx, word.getBoundingClientRect());
      };
      const leave = () => word.classList.remove('is-live');
      const tap = () => {
        word.classList.add('is-live');
        if (!reduce) wordSpark(fx, word.getBoundingClientRect());
        window.setTimeout(() => word.classList.remove('is-live'), 650);
      };
      word.addEventListener('pointerenter', enter);
      word.addEventListener('pointerleave', leave);
      word.addEventListener('pointerdown', tap);
      disposers.push(() => {
        word.removeEventListener('pointerenter', enter);
        word.removeEventListener('pointerleave', leave);
        word.removeEventListener('pointerdown', tap);
        delete word.dataset.wdBound;
      });
    };

    let restore: (() => void) | null = null;

    const enhance = () => {
      const h1 = document.querySelector<HTMLElement>('main h1');
      if (!h1) return;
      if (!h1.querySelector('.wd-word')) {
        const label = (h1.textContent || '').replace(/\s+/g, ' ').trim();
        const original = h1.innerHTML;
        h1.setAttribute('aria-label', label);
        let wi = 0;
        const walk = (parent: Node) => {
          for (const child of Array.from(parent.childNodes)) {
            if (child.nodeType === 3) {
              const text = child.textContent || '';
              if (!text.trim()) continue;
              const fragment = document.createDocumentFragment();
              text.split(/(\s+)/).forEach((part) => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                  fragment.appendChild(document.createTextNode(part));
                } else {
                  const span = document.createElement('span');
                  span.className = 'wd-word';
                  span.dataset.wi = String(wi % 4);
                  span.setAttribute('aria-hidden', 'true');
                  span.textContent = part;
                  wi += 1;
                  fragment.appendChild(span);
                }
              });
              parent.replaceChild(fragment, child);
            } else if (child.nodeType === 1) {
              const el = child as HTMLElement;
              if (!el.classList.contains('wd-word')) walk(el);
            }
          }
        };
        walk(h1);
        h1.setAttribute('data-wd-words', '1');
        restore = () => {
          if (!h1.isConnected) return;
          h1.innerHTML = original;
          h1.removeAttribute('aria-label');
          h1.removeAttribute('data-wd-words');
        };
      }
      h1.querySelectorAll<HTMLElement>('.wd-word').forEach(bind);
    };

    [160, 600, 1200, 2200].forEach((delay) => {
      timers.push(window.setTimeout(enhance, delay));
    });

    let debounce = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        const h1 = document.querySelector<HTMLElement>('main h1');
        if (h1 && !h1.querySelector('.wd-word')) enhance();
      }, 80);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(debounce);
      timers.forEach((timer) => window.clearTimeout(timer));
      disposers.forEach((dispose) => dispose());
      restore?.();
      fx.replaceChildren();
    };
  }, [pathname]);

  return <div ref={fxRef} className="wd-word-fx" aria-hidden="true" />;
}
