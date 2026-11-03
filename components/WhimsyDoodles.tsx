'use client';

import type { CSSProperties } from 'react';

/** Only the award/time pieces are kept: the tournament trophy, leaderboard
 *  crown/medal and the ticking clock. Every food, fruit, coin, mascot and
 *  vehicle doodle has been removed from the project. */
export type DoodleName = 'trophy' | 'crown' | 'medal' | 'clock';

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
