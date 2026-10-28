import type { SVGProps } from "react";

const ink = "#2b2118";
const paper = "#fffdf7";

const tones = {
  blue: { body: "#8ecae6", belly: "#dceff8", cheek: "#ef8f7a" },
  teal: { body: "#8fd5c8", belly: "#d6efe9", cheek: "#ef8f7a" },
  violet: { body: "#cbb8f5", belly: "#ece5fa", cheek: "#ef8f7a" },
  coral: { body: "#f7a58f", belly: "#fbd9cf", cheek: "#e25b44" },
  butter: { body: "#f6d06b", belly: "#fbeec4", cheek: "#ef8f7a" },
};

export type BlobTone = keyof typeof tones;

export function BlobAgent({
  tone = "teal",
  size = 46,
  className,
  hat = false,
}: {
  tone?: BlobTone;
  size?: number;
  className?: string;
  hat?: boolean;
}) {
  const c = tones[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 4.5c11.9 0 19.5 7.7 19.5 18.3 0 4.1-1.6 6.5-1.6 10.1 0 6.6-7.2 10.6-17.9 10.6S6.1 39.5 6.1 32.9c0-3.6-1.6-6-1.6-10.1C4.5 12.2 12.1 4.5 24 4.5Z"
        fill={c.body}
        stroke={ink}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse cx="24" cy="34" rx="10" ry="7" fill={c.belly} opacity="0.85" />
      <circle cx="17.5" cy="23" r="2.2" fill={ink} />
      <circle cx="30.5" cy="23" r="2.2" fill={ink} />
      <path d="M20 28.5c1.4 1.7 2.7 2.4 4 2.4s2.6-.7 4-2.4" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="12.5" cy="27.5" rx="2.5" ry="1.6" fill={c.cheek} opacity="0.7" />
      <ellipse cx="35.5" cy="27.5" rx="2.5" ry="1.6" fill={c.cheek} opacity="0.7" />
      {hat ? (
        <>
          <path d="M13 9.5c2.5-4.6 6.2-6.5 11-6.5s8.5 1.9 11 6.5" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="10" y="8.5" width="28" height="4" rx="2" fill="#f2c14e" stroke={ink} strokeWidth="2" />
        </>
      ) : null}
    </svg>
  );
}

export function Sun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" {...props}>
      <g stroke={ink} strokeWidth="3" strokeLinecap="round">
        <circle cx="60" cy="60" r="26" fill="#f2c14e" />
        <path d="M60 16v-9M60 113v-9M16 60h-9M113 60h-9M29 29l-6-6M97 97l-6-6M91 29l6-6M23 97l-6-6" />
      </g>
      <circle cx="51" cy="56" r="2.6" fill={ink} />
      <circle cx="69" cy="56" r="2.6" fill={ink} />
      <path d="M51 66c2.8 3.6 5.8 5.2 9 5.2s6.2-1.6 9-5.2" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Cloud(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 70" fill="none" aria-hidden="true" {...props}>
      <path
        d="M31 58c-12 0-19-7-19-16 0-8 6-14 14-15C29 15 40 8 52 8c13 0 22 8 24 19 8 1 13 6 13 14 0 10-8 17-20 17H31Z"
        fill={paper}
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M38 57h31" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function PaperPlane(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 70" fill="none" aria-hidden="true" {...props}>
      <path d="M8 32 88 8 63 61 45 40 8 32Z" fill={paper} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="m45 40 43-32M45 40l-4 16" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path
        d="m20 4 4.7 10.2L36 16l-8 7.8L30 35l-10-5.5L10 35l2-11.2L4 16l11.3-1.8L20 4Z"
        fill="#f2c14e"
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path d="M16 2c1.5 9 4.8 12.3 14 14-9.2 1.7-12.5 5-14 14-1.5-9-4.8-12.3-14-14 9.2-1.7 12.5-5 14-14Z" fill="#ef6b4a" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function Plant(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 130" fill="none" aria-hidden="true" {...props}>
      <path d="M50 96V58" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 78c-16 0-25-9-25-24 15-1 25 8 25 24Z" fill="#8fd5c8" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M50 66c14-2 21-11 20-25-14 1-22 10-20 25Z" fill="#8fd5c8" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M50 52c-12-2-18-9-17-21 12 1 18 9 17 21Z" fill="#a8d5ba" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M31 96h38l-5 27c-.4 2-2 3-4 3H40c-2 0-3.6-1-4-3l-5-27Z" fill="#ef8f7a" stroke={ink} strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M31 104h38" stroke={ink} strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

export function Mug(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 110" fill="none" aria-hidden="true" {...props}>
      <path className="w-steam" d="M38 30c-6-7 6-9 0-17" stroke={ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      <path className="w-steam" style={{ animationDelay: "0.9s" }} d="M58 31c-6-7 6-9 0-17" stroke={ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      <path d="M22 43h48v27c0 13-9 22-22 22h-4c-13 0-22-9-22-22V43Z" fill={paper} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M70 51h8c7 0 11 4 11 10s-4 10-11 10h-8" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M22 53h48" stroke="#ef8f7a" strokeWidth="7" />
      <path d="M34 73c4 2 8 2 12 0" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`w-tape ${className}`} />;
}

export function WaxSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" aria-hidden="true">
      <path
        d="M30 3c4 0 6 3 10 3s7-1 9 3-1 7 1 10 5 5 4 9-4 5-4 9 1 7-3 9-7-1-10 1-5 5-9 4-5-4-9-4-7 1-9-3 1-7-1-10-5-5-4-9 4-5 4-9-1-7 3-9 7 1 10-1 5-5 9-4Z"
        fill="#ef6b4a"
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m30 18 3.4 7.2 7.6 1-5.5 5.3 1.3 7.5-6.8-3.6-6.8 3.6 1.3-7.5-5.5-5.3 7.6-1L30 18Z" fill="#fbd9cf" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function KeyDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 34" className={className} fill="none" aria-hidden="true">
      <circle cx="14" cy="17" r="9" fill="#f2c14e" stroke={ink} strokeWidth="2.4" />
      <circle cx="14" cy="17" r="3" fill={paper} stroke={ink} strokeWidth="2" />
      <path d="M23 17h28M43 17v7M50 17v5" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 14" className={className} fill="none" aria-hidden="true">
      <path d="M3 9c33-7 63 5 96-1s71-4 138 1" stroke="#ef6b4a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowDoodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 60" className={className} fill="none" aria-hidden="true">
      <path d="M5 48c18-26 39-35 70-31" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="2 7" />
      <path d="m66 9 13 8-11 9" stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WindowScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 400" className={className} fill="none" aria-hidden="true">
      <rect x="16" y="16" width="488" height="300" rx="28" fill="#cfeaf6" stroke={ink} strokeWidth="3.5" />
      <clipPath id="w-window-clip">
        <rect x="20" y="20" width="480" height="292" rx="25" />
      </clipPath>
      <g clipPath="url(#w-window-clip)">
        <g className="w-spin-slow" style={{ transformOrigin: "410px 92px" }}>
          <g stroke={ink} strokeWidth="3" strokeLinecap="round">
            <path d="M410 38v-14M410 160v-14M356 92h-14M478 92h-14M372 54l-10-10M458 140l-10-10M448 54l10-10M362 140l10-10" />
          </g>
        </g>
        <circle cx="410" cy="92" r="30" fill="#f2c14e" stroke={ink} strokeWidth="3" />
        <circle cx="401" cy="88" r="2.4" fill={ink} />
        <circle cx="419" cy="88" r="2.4" fill={ink} />
        <path d="M401 98c2.6 3 5.7 4.4 9 4.4s6.4-1.4 9-4.4" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <g className="w-drift">
          <path
            d="M92 118c-13 0-21-8-21-18 0-9 7-16 16-17 4-13 15-21 28-21 14 0 24 9 26 21 9 1 15 7 15 16 0 11-9 19-22 19H92Z"
            fill={paper}
            stroke={ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        <path d="M-20 268c54-52 108-57 158-30 38 20 72 21 111-2 46-27 105-23 162 21 39 30 82 33 129 17v68H-20v-74Z" fill="#a8d5ba" stroke={ink} strokeWidth="3" />
        <path d="M-20 296c58-35 110-37 160-12 44 22 84 21 126-4 44-26 96-25 149 5 36 20 70 24 105 15v60H-20v-64Z" fill="#8fd5c8" stroke={ink} strokeWidth="3" />
        <path d="M70 223c7-7 14-7 21 0M110 210c7-7 14-7 21 0" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        <g className="w-float">
          <path d="M300 74 340 58l-12 27-12-8-16-3Z" fill={paper} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="m316 77 24-19" stroke={ink} strokeWidth="1.8" />
        </g>
      </g>
      <rect x="16" y="16" width="488" height="300" rx="28" stroke={ink} strokeWidth="3.5" />
      <path d="M260 20v292M20 196h480" stroke={ink} strokeWidth="3" opacity="0.5" />
      {/* desk */}
      <path d="M0 316h520v22H0z" fill="#e6b98a" stroke={ink} strokeWidth="3" />
      <path d="M22 338v54M498 338v54" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      {/* paper stack */}
      <g>
        <rect x="156" y="280" width="92" height="38" rx="4" fill={paper} stroke={ink} strokeWidth="2.6" transform="rotate(-4 202 299)" />
        <rect x="166" y="272" width="92" height="38" rx="4" fill={paper} stroke={ink} strokeWidth="2.6" transform="rotate(2 212 291)" />
        <path d="M180 284h54M180 293h38" stroke={ink} strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
      </g>
      {/* plant */}
      <g transform="translate(378 240)">
        <path d="M40 66V30" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M40 50C26 50 18 42 18 28c13-1 22 8 22 22Z" fill="#8fd5c8" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M40 40c12-2 18-10 17-22-12 1-19 9-17 22Z" fill="#8fd5c8" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M20 66h40l-5 26H25l-5-26Z" fill="#ef8f7a" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
      </g>
      {/* mug */}
      <g transform="translate(70 250)">
        <path className="w-steam" d="M28 18c-5-6 5-8 0-14" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M14 28h34v18c0 9-6 15-17 15S14 55 14 46V28Z" fill={paper} stroke={ink} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M48 34h6c5 0 8 3 8 8s-3 8-8 8h-6" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14 36h34" stroke="#ef8f7a" strokeWidth="5" />
      </g>
      {/* tiny agent */}
      <g transform="translate(296 270)">
        <g className="w-float-slow">
          <path d="M27 4c13 0 21 8 21 19 0 4-1 6-1 10 0 7-8 11-20 11S7 40 7 33c0-4-1-6-1-10C6 12 14 4 27 4Z" fill="#cbb8f5" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="20" cy="23" r="2.2" fill={ink} />
          <circle cx="34" cy="23" r="2.2" fill={ink} />
          <path d="M21 30c1.6 2 3.6 3 6 3s4.4-1 6-3" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 8c2-3 5-4 9-4s7 1 9 4" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      <path d="M0 372h520" stroke={ink} strokeWidth="2" opacity="0.25" />
      <text x="30" y="392" fill="currentColor" fontFamily="var(--font-nunito), sans-serif" fontSize="11" fontWeight="800" letterSpacing="2" opacity="0.55">
        THE WORKSHOP · 9:12 AM
      </text>
      <g transform="translate(430 358)">
        <g className="w-drift">
          <path d="M0 10c10 0 17 6 17 14" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 5" />
        </g>
      </g>
    </svg>
  );
}
