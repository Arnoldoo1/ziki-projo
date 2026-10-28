import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/ziki-mark.svg"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[7px]"
      aria-hidden="true"
    />
  );
}

export function BrandLockup({
  size = 30,
  href = "/",
  subtitle,
}: {
  size?: number;
  href?: string;
  subtitle?: string;
}) {
  return (
    <Link href={href} className="focus-ring inline-flex items-center gap-2 rounded-lg" aria-label="Ziki home">
      <BrandMark size={size} />
      <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-zk-text">
        ziki
      </span>
      {subtitle ? (
        <span className="ml-1 hidden rounded-full border border-zk-border bg-zk-chip px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zk-muted sm:inline">
          {subtitle}
        </span>
      ) : null}
    </Link>
  );
}

const toneClass = {
  info: "bg-zk-info-bg text-zk-info-fg",
  ok: "bg-zk-ok-bg text-zk-ok-fg",
  bad: "bg-zk-bad-bg text-zk-bad-fg",
  warn: "bg-zk-warn-bg text-zk-warn-fg",
  muted: "bg-zk-chip text-zk-text2",
  accent: "bg-zk-tint text-zk-accent",
  dark: "bg-deep-ocean text-white",
} as const;

export type Tone = keyof typeof toneClass;

export function Chip({
  tone = "muted",
  children,
  dot = false,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${toneClass[tone]} ${className}`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const avatarTone = {
  blue: "bg-zk-info-bg text-zk-info-fg border-[#BFD6FB] dark:border-[#2e4f82]",
  teal: "bg-zk-ok-bg text-zk-ok-fg border-[#B7E4CC] dark:border-[#2b5c46]",
  violet: "bg-[#F1EAFE] text-[#6D3FC4] border-[#DCCBF8] dark:bg-[#241a3d] dark:text-[#c9a9ff] dark:border-[#4a3573]",
  amber: "bg-zk-warn-bg text-zk-warn-fg border-zk-warn-bd",
  rose: "bg-zk-sec-bg text-zk-sec-fg border-[#F4C2CE] dark:border-[#6b2a3d]",
} as const;

export function Avatar({
  name,
  tone = "blue",
  size = 34,
  square = false,
  className = "",
}: {
  name: string;
  tone?: keyof typeof avatarTone;
  size?: number;
  square?: boolean;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
      className={`inline-flex shrink-0 items-center justify-center border font-extrabold ${
        square ? "rounded-[9px]" : "rounded-full"
      } ${avatarTone[tone]} ${className}`}
    >
      {initials}
    </span>
  );
}

export const buttonStyles = {
  primary:
    "bg-electric-blue-strong text-white border border-electric-blue-strong hover:bg-[#255fe0] disabled:opacity-60",
  secondary:
    "bg-zk-surface text-zk-text border border-zk-border hover:bg-zk-chip disabled:opacity-60",
  soft: "bg-zk-tint text-zk-accent border border-transparent hover:bg-[#dcebfd] dark:hover:bg-[#1b3560] disabled:opacity-60",
  ghost:
    "bg-transparent text-zk-text2 border border-transparent hover:bg-zk-chip hover:text-zk-text disabled:opacity-60",
  danger:
    "bg-zk-bad-bg text-zk-bad-fg border border-zk-bad-bd hover:bg-[#fbd9d2] dark:hover:bg-[#4a1c1e] disabled:opacity-60",
  dark: "bg-deep-ocean text-white border border-deep-ocean hover:bg-[#122249] disabled:opacity-60",
} as const;

export function buttonClass(
  variant: keyof typeof buttonStyles = "primary",
  size: "sm" | "md" | "lg" = "md",
  extra = "",
) {
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-[13px] gap-2",
    lg: "h-[46px] px-5 text-sm gap-2",
  };
  return `focus-ring inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-colors disabled:cursor-not-allowed ${sizes[size]} ${buttonStyles[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function Mono({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light" | "tint";
  className?: string;
}) {
  const tones = {
    dark: "bg-zk-text text-zk-surface",
    light: "bg-zk-chip text-zk-text2",
    tint: "bg-zk-tint text-zk-accent",
  };
  return (
    <code
      className={`inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[11px] leading-5 ${tones[tone]} ${className}`}
    >
      {children}
    </code>
  );
}

export function Meter({
  value,
  label,
  tone = "blue",
}: {
  value: number;
  label?: string;
  tone?: "blue" | "green" | "amber";
}) {
  const colors = {
    blue: "bg-electric-blue-strong",
    green: "bg-zk-ok-fg",
    amber: "bg-zk-warn-fg",
  };
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-24 overflow-hidden rounded-full bg-zk-chip"
        role="img"
        aria-label={`${label ?? "Confidence"}: ${value}%`}
      >
        <div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <span className="tabular text-[11px] font-bold text-zk-text2">{value}%</span>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-zk-accent">
      {children}
    </span>
  );
}

export function EmptyState({
  icon = "sparkles",
  title,
  body,
  action,
}: {
  icon?: Parameters<typeof Icon>[0]["name"];
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-zk-border bg-zk-surface px-6 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
        <Icon name={icon} size={18} />
      </span>
      <p className="mt-1 text-sm font-bold text-zk-text">{title}</p>
      <p className="max-w-sm text-[13px] text-zk-muted">{body}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
