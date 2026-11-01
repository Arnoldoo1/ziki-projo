'use client';

import type { CSSProperties } from 'react';

export type DoodleName =
  | 'danfo'
  | 'jollof'
  | 'suya'
  | 'puff'
  | 'mango'
  | 'zobo'
  | 'coin'
  | 'mascot'
  | 'trophy'
  | 'crown'
  | 'medal'
  | 'clock';

const outline = {
  stroke: 'var(--wd-outline)',
  strokeWidth: 2.2,
  vectorEffect: 'non-scaling-stroke' as const,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

export function Doodle({
  name,
  className = '',
  style,
}: {
  name: DoodleName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`wd-doodle wd-doodle-${name} ${className}`.trim()} style={style} aria-hidden="true">
      {name === 'danfo' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <rect x="5" y="26" width="90" height="34" rx="9" fill="var(--wd-yellow)" {...outline} />
          <path d="M19 26 29 11h42l10 15" fill="var(--wd-yellow)" {...outline} />
          <rect x="35" y="14" width="14" height="9" rx="2" fill="var(--wd-teal)" {...outline} />
          <rect x="53" y="14" width="14" height="9" rx="2" fill="var(--wd-teal)" {...outline} />
          <path d="M6 46h88" stroke="var(--wd-red)" strokeWidth="7" />
          <rect x="14" y="34" width="20" height="8" rx="2" fill="var(--wd-orange)" {...outline} />
          <circle cx="27" cy="62" r="8" fill="var(--wd-ink)" {...outline} />
          <circle cx="73" cy="62" r="8" fill="var(--wd-ink)" {...outline} />
          <circle cx="27" cy="62" r="3" fill="var(--wd-gold)" />
          <circle cx="73" cy="62" r="3" fill="var(--wd-gold)" />
        </svg>
      )}
      {name === 'jollof' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <path d="M14 36h72c-2 22-16 33-36 33S16 58 14 36Z" fill="var(--wd-red)" {...outline} />
          <path d="M20 36c6-16 54-16 60 0" fill="var(--wd-orange)" {...outline} />
          <circle cx="34" cy="31" r="4" fill="var(--wd-gold)" {...outline} />
          <circle cx="48" cy="27" r="4" fill="var(--wd-gold)" {...outline} />
          <circle cx="62" cy="31" r="4" fill="var(--wd-gold)" {...outline} />
          <path d="M62 21c5-8 14-8 18-2-7 1-11 4-13 8" fill="var(--wd-green)" {...outline} />
          <path d="M26 54c8 7 40 7 48 0" stroke="var(--wd-outline)" strokeWidth="3" fill="none" />
        </svg>
      )}
      {name === 'suya' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <path d="M16 64 84 12" stroke="var(--wd-brown)" strokeWidth="5" strokeLinecap="round" />
          <rect x="25" y="40" width="18" height="15" rx="4" fill="var(--wd-brown)" {...outline} transform="rotate(-38 34 47)" />
          <rect x="41" y="30" width="18" height="15" rx="4" fill="var(--wd-red)" {...outline} transform="rotate(-38 50 37)" />
          <rect x="57" y="20" width="18" height="15" rx="4" fill="var(--wd-brown)" {...outline} transform="rotate(-38 66 27)" />
          <circle cx="38" cy="42" r="2.6" fill="var(--wd-gold)" />
          <circle cx="54" cy="32" r="2.6" fill="var(--wd-gold)" />
          <circle cx="70" cy="22" r="2.6" fill="var(--wd-gold)" />
          <path d="M18 62c-6 2-10 7-11 12" stroke="var(--wd-outline)" strokeWidth="3" fill="none" />
        </svg>
      )}
      {name === 'puff' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <circle cx="30" cy="50" r="17" fill="var(--wd-gold)" {...outline} />
          <circle cx="52" cy="38" r="19" fill="var(--wd-orange)" {...outline} />
          <circle cx="73" cy="53" r="16" fill="var(--wd-gold)" {...outline} />
          <circle cx="26" cy="44" r="3" fill="var(--wd-red)" opacity=".85" />
          <circle cx="47" cy="31" r="3.4" fill="var(--wd-red)" opacity=".85" />
          <circle cx="69" cy="47" r="3" fill="var(--wd-red)" opacity=".85" />
        </svg>
      )}
      {name === 'mango' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <path d="M50 22c20-8 34 10 30 28-4 19-22 25-33 17-14-9-18-36 3-45Z" fill="var(--wd-orange)" {...outline} />
          <path d="M51 22c-2-9 5-15 14-14-1 8-6 13-14 14Z" fill="var(--wd-green)" {...outline} />
          <path d="M59 35c6 2 9 7 9 14" stroke="var(--wd-gold)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="42" cy="37" r="3" fill="var(--wd-red)" />
        </svg>
      )}
      {name === 'zobo' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <path d="M28 26h44l-6 42H34Z" fill="var(--wd-red)" {...outline} />
          <path d="M28 26h44" stroke="var(--wd-outline)" strokeWidth="5" />
          <path d="M62 16 52 60" stroke="var(--wd-teal)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="46" cy="44" r="7" fill="var(--wd-pink)" {...outline} />
          <path d="M42 44 50 44M46 40v8" stroke="var(--wd-gold)" strokeWidth="2.5" />
          <path d="M38 21c2-6 8-7 10-2" fill="var(--wd-green)" {...outline} />
        </svg>
      )}
      {name === 'coin' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <circle cx="50" cy="40" r="27" fill="var(--wd-gold)" {...outline} />
          <circle cx="50" cy="40" r="19" fill="var(--wd-yellow)" {...outline} />
          <path d="M50 26l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L50 49.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5Z" fill="var(--wd-outline)" />
          <circle cx="34" cy="29" r="2.5" fill="var(--wd-red)" opacity=".85" />
        </svg>
      )}
      {name === 'mascot' && (
        <svg viewBox="0 0 100 100" className="wd-svg">
          <path d="M26 90c0-19 11-27 24-27s24 8 24 27" fill="var(--wd-lime)" {...outline} />
          <circle cx="50" cy="40" r="25" fill="var(--wd-gold)" {...outline} />
          <path d="M27 33c2-16 14-23 23-23s21 7 23 23c-8-6-16-8-23-8s-15 2-23 8Z" fill="var(--wd-lime)" {...outline} />
          <circle cx="41" cy="41" r="3.4" fill="var(--wd-outline)" />
          <circle cx="59" cy="41" r="3.4" fill="var(--wd-outline)" />
          <path d="M42 50c4 4 12 4 16 0" stroke="var(--wd-outline)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <g className="wd-wave">
            <path d="M76 50c8 2 11 10 9 18" stroke="var(--wd-outline)" strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="85" cy="70" r="6" fill="var(--wd-gold)" {...outline} />
          </g>
        </svg>
      )}
      {name === 'trophy' && (
        <svg viewBox="0 0 100 100" className="wd-svg">
          <path d="M30 18h40v18c0 15-9 25-20 25S30 51 30 36Z" fill="var(--wd-gold)" {...outline} />
          <path d="M30 24H18c0 13 6 20 14 21M70 24h12c0 13-6 20-14 21" fill="none" {...outline} />
          <path d="M45 61h10v12H45Z" fill="var(--wd-gold)" {...outline} />
          <path d="M34 80h32" stroke="var(--wd-outline)" strokeWidth="7" strokeLinecap="round" />
          <path d="M50 28l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1Z" fill="var(--wd-outline)" />
        </svg>
      )}
      {name === 'crown' && (
        <svg viewBox="0 0 100 80" className="wd-svg">
          <path d="M16 58 12 25l21 14 17-23 17 23 21-14-4 33Z" fill="var(--wd-gold)" {...outline} />
          <path d="M18 65h64" stroke="var(--wd-outline)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="50" cy="20" r="5" fill="var(--wd-teal)" {...outline} />
          <circle cx="19" cy="26" r="4.5" fill="var(--wd-red)" {...outline} />
          <circle cx="81" cy="26" r="4.5" fill="var(--wd-red)" {...outline} />
          <circle cx="50" cy="48" r="4" fill="var(--wd-lime)" {...outline} />
        </svg>
      )}
      {name === 'medal' && (
        <svg viewBox="0 0 100 100" className="wd-svg">
          <path d="M36 8 50 36 64 8" fill="var(--wd-red)" {...outline} />
          <path d="M48 26 38 8M52 26l10-18" stroke="var(--wd-lime)" strokeWidth="6" />
          <circle cx="50" cy="58" r="24" fill="var(--wd-gold)" {...outline} />
          <circle cx="50" cy="58" r="17" fill="var(--wd-yellow)" {...outline} />
          <path d="M50 44l4 8 9 1.4-6.6 6.4 1.6 9L50 64.4l-8 4.2 1.6-9-6.6-6.4 9-1.4Z" fill="var(--wd-outline)" />
        </svg>
      )}
      {name === 'clock' && (
        <svg viewBox="0 0 100 100" className="wd-svg">
          <circle cx="50" cy="50" r="32" fill="var(--wd-yellow)" {...outline} />
          <circle cx="50" cy="50" r="24" fill="var(--wd-gold)" {...outline} />
          <path d="M50 50V31M50 50l13 9" stroke="var(--wd-outline)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4" fill="var(--wd-red)" {...outline} />
          <path d="M40 10h20M50 10v8" stroke="var(--wd-outline)" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 22 26 28M80 22 74 28" stroke="var(--wd-teal)" strokeWidth="4" strokeLinecap="round" />
          <g className="wd-clock-hand">
            <path d="M50 50V38" stroke="var(--wd-red)" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      )}
    </span>
  );
}

/** Bold outlined sparkle used for static and burst effects. */
export function Sparkle({ size = 18, color = 'var(--wd-spark-1)', char = '✦' }: { size?: number; color?: string; char?: string }) {
  return (
    <span className="wd-spark" style={{ fontSize: size, color }} aria-hidden="true">
      {char}
    </span>
  );
}
