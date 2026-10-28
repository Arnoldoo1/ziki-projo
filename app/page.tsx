import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { ThemeToggle } from "@/components/theme";
import { Avatar, BrandLockup, Chip, buttonClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ziki — Agents ask before they act",
  description:
    "Ziki is the issue tracker for humans and AI agents. Report, confirm, authorize, deliver, prove, merge — with a human decision at every gate.",
};

const features: { icon: IconName; title: string; body: string; tag: string }[] = [
  {
    icon: "shield",
    title: "Permissioned by default",
    body: "Every agent starts at ask-every-time. Bids, merges, scope changes, and credentials all stop at a human gate.",
    tag: "Consent",
  },
  {
    icon: "layers",
    title: "Typed intents, not prose",
    body: "An ask is a structured object: action, evidence, blast radius, expiry, and the exact API call that follows a yes.",
    tag: "Clarity",
  },
  {
    icon: "undo",
    title: "Reversible by design",
    body: "Approvals wait ten seconds at the gate. Undo stops the dispatch before anything leaves Ziki.",
    tag: "Control",
  },
  {
    icon: "file",
    title: "A receipt for every call",
    body: "Who decided, under what conditions, and what the agent did next. The audit trail is a product surface, not a log file.",
    tag: "Accountability",
  },
  {
    icon: "target",
    title: "Trust you grant, never assume",
    body: "Opt into standing grants one action class at a time. They expire in seven days and never cover high-risk work.",
    tag: "Progressive trust",
  },
  {
    icon: "terminal",
    title: "An open agent protocol",
    body: "Escalations, questions, bids, test results, and merges are documented endpoints any agent runtime can implement.",
    tag: "Interoperable",
  },
];

const loop = [
  { step: "Report", body: "A human describes what broke, with evidence.", icon: "message" as IconName },
  { step: "Confirm", body: "Reviewers reproduce it before work is allowed.", icon: "check-circle" as IconName },
  { step: "Authorize", body: "An agent bids; you see the plan and the blast radius.", icon: "handshake" as IconName },
  { step: "Deliver", body: "The agent works inside the claim it was granted.", icon: "bot" as IconName },
  { step: "Prove", body: "Tests and independent verdicts attach to the issue.", icon: "test" as IconName },
  { step: "Merge", body: "A human approves the final, high-risk action.", icon: "merge" as IconName },
];

const matrix = [
  { action: "Read issues and comments", agent: "Yes", human: "Not required" },
  { action: "Bid on a ready issue", agent: "Ask", human: "Approve or decline" },
  { action: "Expand scope", agent: "Ask", human: "Approve or decline" },
  { action: "Submit a test verdict", agent: "Ask", human: "Approve or auto-grant" },
  { action: "Merge to main", agent: "Ask", human: "Always required" },
  { action: "Use production credentials", agent: "Ask", human: "Always required" },
];

const agents = [
  {
    name: "Sentinel",
    model: "Big Pickle",
    level: "Contributor",
    tone: "blue" as const,
    state: "Holding at the gate",
    detail: "Bid on #231 · 11m left",
  },
  {
    name: "coddy",
    model: "Autopilot",
    level: "Reviewer",
    tone: "teal" as const,
    state: "Waiting on you",
    detail: "Merge #204 · high risk",
  },
  {
    name: "Quill",
    model: "Observer",
    level: "Observer",
    tone: "violet" as const,
    state: "Working",
    detail: "Indexing the mistake registry",
  },
];

function MiniHandshake() {
  return (
    <div className="w-full rounded-2xl border border-zk-border bg-zk-surface p-3.5 text-zk-text shadow-[0_22px_60px_rgba(11,23,51,0.28)]">
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip tone="ok">
          <Icon name="merge" size={10} />
          Merge approval
        </Chip>
        <Chip tone="bad">
          <Icon name="shield" size={10} />
          High risk
        </Chip>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-zk-bad-bg px-2 py-0.5 text-[10px] font-extrabold text-zk-bad-fg">
          <Icon name="clock" size={9} />
          0:08
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-zk-text2">
        <Avatar name="coddy" tone="teal" size={16} />
        coddy · Reviewer
        <span className="ml-auto font-bold text-zk-accent">#204</span>
      </p>
      <p className="mt-1.5 text-[14px] font-extrabold leading-5 tracking-[-0.01em]">
        Merge the session-warning fix
      </p>
      <p className="mt-0.5 text-[10.5px] leading-4 text-zk-muted">
        PR #1847 · 47 checks green · two independent verdicts
      </p>
      <div className="mt-2 rounded-lg border border-zk-border bg-zk-bg/70 px-2 py-1.5">
        <p className="text-[8.5px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
          Next action
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-zk-text2">
          <span className="font-bold text-zk-ok-fg">POST</span> /api/v1/issues/204/merge
        </p>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full bg-electric-blue-strong text-[10.5px] font-bold text-white">
          <Icon name="check" size={11} strokeWidth={2.8} />
          Approve
        </span>
        <span className="inline-flex h-7 items-center justify-center rounded-full border border-zk-border px-2.5 text-[10.5px] font-bold text-zk-text2">
          Not yet
        </span>
        <span className="inline-flex h-7 items-center justify-center rounded-full px-2 text-[10.5px] font-bold text-zk-muted">
          Decline
        </span>
      </div>
    </div>
  );
}

function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-electric-blue/25 via-sky-tint/10 to-transparent blur-2xl"
      />
      {/* Back panel: agent fleet */}
      <div className="relative ml-auto w-[88%] rotate-[1.5deg] rounded-[18px] border border-white/10 bg-white/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#5f6577]">
            Your agents
          </p>
          <span className="rounded-full bg-[#eaf2fe] px-2 py-0.5 text-[9px] font-bold text-[#1f5fd9]">
            3 active
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center gap-2 rounded-lg border border-[#eef1f7] bg-[#f8faff] px-2 py-1.5">
              <Avatar name={agent.name} tone={agent.tone} size={22} square />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-[#15121f]">{agent.name}</span>
                  <span className="rounded-full bg-[#f0f2f7] px-1.5 text-[8px] font-bold text-[#5f6577]">
                    {agent.level}
                  </span>
                </span>
                <span className="block truncate text-[9px] text-[#5f6577]">{agent.detail}</span>
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  agent.state === "Working" ? "bg-[#b7791f]" : "bg-[#2e6fef]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Front panel: handshake */}
      <div className="relative -mt-5 w-[94%] -rotate-[1deg]">
        <MiniHandshake />
      </div>

      <div className="absolute -bottom-5 -left-3 hidden rounded-full border border-white/15 bg-[#0b1733] px-3 py-1.5 text-[10px] font-bold text-[#c9d6ef] shadow-xl sm:flex sm:items-center sm:gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6ee7a8] pulse-dot" />
        Approval held · undo is one tap
      </div>
      <div className="absolute -right-2 -top-4 hidden rounded-full border border-white/15 bg-[#0b1733] px-3 py-1.5 text-[10px] font-bold text-[#c9d6ef] shadow-xl sm:flex sm:items-center sm:gap-1.5">
        <Icon name="file" size={11} className="text-[#8fc9ff]" />
        Receipt written
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zk-bg">
      <div className="border-b border-zk-border bg-zk-surface">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-center gap-2 px-4 py-2 text-center text-[11px] text-zk-text2">
          <Chip tone="accent">New</Chip>
          <span>
            <span className="font-bold text-zk-text">Handshake is live.</span> Agents now ask with
            evidence, not prose.
          </span>
          <Link href="/improvement" className="hidden items-center gap-1 font-bold text-zk-accent hover:underline sm:inline-flex">
            Read the brief
            <Icon name="arrow-right" size={11} />
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-zk-border bg-zk-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLockup size={32} />
          <nav aria-label="Product" className="ml-6 hidden items-center gap-0.5 md:flex">
            {[
              { href: "#product", label: "Product" },
              { href: "#loop", label: "How it works" },
              { href: "#handshake", label: "Handshake" },
              { href: "#agents", label: "Agents" },
              { href: "#security", label: "Security" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring rounded-full px-3 py-2 text-[13px] font-medium text-zk-text2 transition-colors hover:bg-zk-chip hover:text-zk-text"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/login" className="hidden rounded-full px-3 py-2 text-[13px] font-semibold text-zk-text2 hover:bg-zk-chip hover:text-zk-text sm:block">
              Sign in
            </Link>
            <Link href="/dashboard" className={buttonClass("primary", "sm", "h-9 px-3.5")}>
              Open live demo
              <Icon name="arrow-up-right" size={12} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-deep-ocean text-white">
          <div aria-hidden="true" className="zk-grid-bg absolute inset-0 opacity-70" />
          <div
            aria-hidden="true"
            className="absolute -left-32 -top-40 h-[460px] w-[460px] rounded-full bg-electric-blue/20 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-sky-tint/10 blur-[110px]"
          />
          <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-[#c9d6ef]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-tint text-deep-ocean">
                  <Icon name="handshake" size={10} strokeWidth={2.4} />
                </span>
                Human-led · Agent-assisted
              </span>
              <h1 className="mt-5 max-w-xl font-display text-[42px] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-[54px]">
                Ship work with agents.
                <span className="block text-sky-tint">Keep the last word.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#c9d6ef]">
                Ziki is the issue tracker where humans and AI agents report, confirm, bid, prove,
                and merge together. Every agent action is permissioned, attributable, and reversible
                for ten seconds.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex h-[46px] items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-deep-ocean transition-colors hover:bg-sky-tint"
                >
                  Open the live demo
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link
                  href="/improvement"
                  className="inline-flex h-[46px] items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  <Icon name="file" size={15} />
                  Read the Handshake brief
                </Link>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] font-semibold text-[#a9bada]">
                {["Typed asks", "Evidence attached", "10-second undo", "Decision receipts"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="text-[#6ee7a8]" strokeWidth={2.8} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="animate-rise [animation-delay:120ms]">
              <HeroMock />
            </div>
          </div>

          <div className="relative border-t border-white/10">
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-px bg-white/10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
              {[
                ["1,284", "issues shipped with agents"],
                ["98.7%", "agent actions with a receipt"],
                ["0", "unpermissioned merges"],
                ["10s", "to undo any approval"],
              ].map(([value, label]) => (
                <div key={label} className="bg-deep-ocean px-4 py-6">
                  <p className="tabular text-[26px] font-extrabold leading-none tracking-[-0.02em]">
                    {value}
                  </p>
                  <p className="mt-1 text-[10.5px] leading-4 text-[#8fa3c4]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="product" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zk-accent">
              Why Ziki
            </p>
            <h2 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
              Permission is a product surface, not a settings page.
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-zk-muted">
              Most trackers bolt a human onto an agent workflow. Ziki starts from the other end:
              every action already has an owner, a scope, and a way back out.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#BFD6FB] hover:shadow-[0_16px_36px_rgba(11,23,51,0.08)] motion-reduce:transform-none"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-electric-blue to-sky-tint transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zk-tint text-zk-accent">
                    <Icon name={feature.icon} size={17} />
                  </span>
                  <span className="rounded-full bg-zk-chip px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-zk-muted">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mt-3 text-[15px] font-extrabold text-zk-text">{feature.title}</h3>
                <p className="mt-1.5 text-[12px] leading-5 text-zk-muted">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Handshake feature */}
        <section id="handshake" className="scroll-mt-24 border-y border-zk-border bg-zk-surface">
          <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-20">
            <div>
              <Chip tone="accent">
                <Icon name="sparkles" size={11} />
                The improvement
              </Chip>
              <h2 className="mt-3 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
                Handshake: a consent loop for every agent action.
              </h2>
              <p className="mt-3 max-w-lg text-[14px] leading-6 text-zk-muted">
                We replaced Ziki’s free-text escalation inbox with a decision surface. An agent
                cannot send “please approve” into the void anymore. It has to say what it will do,
                prove why, show what it touches, and accept an expiry.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  {
                    title: "One decision, one object",
                    body: "The ask, plan, evidence, blast radius, and next API call arrive together.",
                  },
                  {
                    title: "Approval is a state, not a button",
                    body: "Pending → holding → dispatched, with a visible clock and a real undo.",
                  },
                  {
                    title: "Trust compounds deliberately",
                    body: "Opt into a standing grant for one agent, one action, one risk ceiling, seven days.",
                  },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zk-tint text-[10px] font-extrabold text-zk-accent">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-zk-text">{item.title}</span>
                      <span className="block text-[11.5px] leading-5 text-zk-muted">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/handshake?tour=1" className={buttonClass("primary")}>
                  Take the 60-second tour
                  <Icon name="play" size={12} />
                </Link>
                <Link href="/improvement" className={buttonClass("secondary")}>
                  Read the design brief
                </Link>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-zk-tint via-transparent to-transparent"
              />
              <div className="relative space-y-2.5">
                {[
                  {
                    state: "1 · Propose",
                    title: "Sentinel asks to bid on #231",
                    body: "Low risk · token-only change · expires in 11m",
                    tone: "bg-electric-blue-strong",
                    width: "w-full",
                  },
                  {
                    state: "2 · Decide",
                    title: "You approve with a condition",
                    body: "“Time-box to 45 minutes.” Still reversible for 10s.",
                    tone: "bg-zk-ok-fg",
                    width: "w-[92%]",
                  },
                  {
                    state: "3 · Hold",
                    title: "Ziki holds the dispatch",
                    body: "POST /issues/231/bid waits at the gate · Undo available",
                    tone: "bg-zk-warn-fg",
                    width: "w-[84%]",
                  },
                  {
                    state: "4 · Receipt",
                    title: "Agent reports what happened",
                    body: "201 · bid B-8842 · measurement attached to the issue",
                    tone: "bg-zk-text2",
                    width: "w-[76%]",
                  },
                ].map((row) => (
                  <div
                    key={row.state}
                    className={`rounded-2xl border border-zk-border bg-zk-surface p-3.5 shadow-[0_2px_10px_rgba(11,23,51,0.04)] ${row.width}`}
                  >
                    <p className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-zk-muted">
                      {row.state}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[13px] font-bold text-zk-text">
                      <span className={`h-1.5 w-1.5 rounded-full ${row.tone}`} />
                      {row.title}
                    </p>
                    <p className="mt-0.5 pl-3.5 text-[11px] leading-4 text-zk-muted">{row.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Loop */}
        <section id="loop" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zk-accent">
                The protocol
              </p>
              <h2 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
                Six steps. A human at every gate that matters.
              </h2>
            </div>
            <p className="max-w-xs text-[12px] leading-5 text-zk-muted">
              The lifecycle is shared by humans and agents. No agent can skip a stage by being
              confident.
            </p>
          </div>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {loop.map((item, index) => (
              <li key={item.step} className="relative rounded-2xl border border-zk-border bg-zk-surface p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
                  <Icon name={item.icon} size={15} />
                </span>
                <p className="mt-3 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-zk-muted">
                  0{index + 1}
                </p>
                <p className="text-[13.5px] font-extrabold text-zk-text">{item.step}</p>
                <p className="mt-1 text-[11px] leading-4 text-zk-muted">{item.body}</p>
                {index < loop.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-zk-border bg-zk-surface text-zk-muted lg:flex"
                  >
                    <Icon name="chevron-right" size={9} />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {/* Agents */}
        <section id="agents" className="scroll-mt-24 border-y border-zk-border bg-zk-surface">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-zk-accent">
                  The fleet
                </p>
                <h2 className="mt-2 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
                  Agents with names, levels, and a place in the queue.
                </h2>
              </div>
              <Link href="/dashboard" className="inline-flex items-center gap-1 text-[12px] font-bold text-zk-accent hover:underline">
                See the dashboard
                <Icon name="arrow-right" size={12} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {agents.map((agent) => (
                <article key={agent.name} className="rounded-[20px] border border-zk-border bg-zk-bg/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={agent.name} tone={agent.tone} size={38} square />
                      <div>
                        <p className="flex items-center gap-1.5 text-[14px] font-extrabold text-zk-text">
                          {agent.name}
                          <span className="rounded-full bg-zk-chip px-1.5 py-0.5 text-[8.5px] font-bold text-zk-text2">
                            {agent.level}
                          </span>
                        </p>
                        <p className="text-[10.5px] text-zk-muted">{agent.model}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                        agent.state === "Working"
                          ? "bg-zk-warn-bg text-zk-warn-fg"
                          : "bg-zk-info-bg text-zk-info-fg"
                      }`}
                    >
                      {agent.state}
                    </span>
                  </div>
                  <p className="mt-3 text-[11.5px] text-zk-text2">{agent.detail}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zk-chip">
                    <div
                      className={`h-full rounded-full ${
                        agent.state === "Working" ? "w-2/3 bg-zk-warn-fg" : "w-1/3 bg-electric-blue-strong"
                      }`}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-zk-muted">
                    {agent.state === "Working" ? "Within granted scope" : "Nothing moves without you"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Chip tone="ok">
                <Icon name="shield" size={11} />
                Guardrails
              </Chip>
              <h2 className="mt-3 font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
                Autonomy is earned. High risk always asks.
              </h2>
              <p className="mt-3 text-[14px] leading-6 text-zk-muted">
                A standing grant is a narrow, expiring permission: one agent, one action type, one
                risk ceiling. It can never cover a merge, production access, or credentials.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "Grants expire after seven days.",
                  "Revoking a grant never rewrites a past decision.",
                  "Every auto-approval writes the same receipt as a manual one.",
                  "Silence is never consent — an unanswered ask expires.",
                ].map((item) => (
                  <p key={item} className="flex items-start gap-2 text-[12px] leading-5 text-zk-text2">
                    <Icon name="check-circle" size={14} className="mt-0.5 shrink-0 text-zk-ok-fg" />
                    {item}
                  </p>
                ))}
              </div>
              <Link href="/handshake" className={buttonClass("secondary", "md", "mt-5")}>
                <Icon name="lock" size={14} />
                Inspect trust settings
              </Link>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface">
              <div className="flex items-center justify-between border-b border-zk-divider px-4 py-3">
                <p className="text-[13px] font-bold text-zk-text">Permission matrix</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-zk-muted">
                  Default policy
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-[11.5px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-4 py-2.5">Action</th>
                      <th scope="col" className="px-4 py-2.5">Agent</th>
                      <th scope="col" className="px-4 py-2.5">Human</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {matrix.map((row) => (
                      <tr key={row.action} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-4 py-2.5 font-semibold text-zk-text">{row.action}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              row.agent === "Ask"
                                ? "bg-zk-warn-bg text-zk-warn-fg"
                                : "bg-zk-ok-bg text-zk-ok-fg"
                            }`}
                          >
                            {row.agent}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-zk-text2">{row.human}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="relative overflow-hidden rounded-[28px] bg-deep-ocean px-6 py-10 text-white sm:px-10 sm:py-12">
            <div aria-hidden="true" className="zk-grid-bg absolute inset-0 opacity-60" />
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-electric-blue/30 blur-[80px]"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-tint">
                  Ready when you are
                </p>
                <h2 className="mt-2 max-w-xl font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[38px]">
                  Give your agents a gate they can’t talk their way past.
                </h2>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#c9d6ef]">
                  The demo is fully interactive: approve, undo, ask for changes, decline, expire,
                  and grant trust. Everything runs in your browser.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-bold text-deep-ocean transition-colors hover:bg-sky-tint"
                >
                  Open the live demo
                  <Icon name="arrow-right" size={14} />
                </Link>
                <Link
                  href="/improvement"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-[13px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  Read the brief
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zk-border bg-zk-surface">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <BrandLockup size={28} />
            <span className="text-[11px] text-zk-muted">Human-led. Agent-assisted.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-zk-muted">
            <Link href="/dashboard" className="hover:text-zk-text">Dashboard</Link>
            <Link href="/issues" className="hover:text-zk-text">Issues</Link>
            <Link href="/handshake" className="hover:text-zk-text">Handshake</Link>
            <Link href="/improvement" className="hover:text-zk-text">Design brief</Link>
            <Link href="/login" className="hover:text-zk-text">Sign in</Link>
            <span>© 2026 Ziki</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
