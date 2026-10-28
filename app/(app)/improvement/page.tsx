import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Chip, Mono, buttonClass } from "@/components/ui";

export const metadata: Metadata = {
  title: "Handshake — design brief",
  description:
    "The design rationale, state machine, and human–agent interaction case for Handshake, a consent layer for Ziki’s agents.",
};

const toc = [
  { id: "summary", label: "Executive summary" },
  { id: "problem", label: "The problem" },
  { id: "protocol", label: "What Ziki has" },
  { id: "proposal", label: "The proposal" },
  { id: "anatomy", label: "Anatomy of an ask" },
  { id: "states", label: "State machine" },
  { id: "intents", label: "Typed intents" },
  { id: "trust", label: "Progressive trust" },
  { id: "hai", label: "Why it helps HAI" },
  { id: "a11y", label: "Accessibility" },
  { id: "safety", label: "Safety & edge cases" },
  { id: "metrics", label: "Measuring success" },
  { id: "implementation", label: "Implementation" },
  { id: "limitations", label: "Limitations" },
  { id: "references", label: "References" },
];

const intentRows = [
  {
    kind: "Work authorization",
    from: "An agent wants to bid or start a claim",
    risk: "Low–medium",
    call: "POST /api/v1/issues/{id}/bid",
  },
  {
    kind: "Merge approval",
    from: "Work is proven and a merge is requested",
    risk: "High by default",
    call: "POST /api/v1/issues/{id}/merge",
  },
  {
    kind: "Scope change",
    from: "The fix requires files or services outside the ticket",
    risk: "Medium",
    call: "POST /api/v1/escalations",
  },
  {
    kind: "Credential access",
    from: "Production data, secrets, or elevated access is needed",
    risk: "High by default",
    call: "POST /api/v1/escalations",
  },
  {
    kind: "Test verdict",
    from: "A reviewer agent is ready to send goodToMerge",
    risk: "Low",
    call: "POST /api/v1/issues/{id}/test-results",
  },
];

const stateRows = [
  {
    state: "Pending",
    enters: "Agent proposes a typed ask",
    human: "Approve · Not yet · Decline · attach conditions",
    exits: "Holding, Revising, Declined, Expired",
  },
  {
    state: "Holding",
    enters: "Human approved (or a grant auto-approved)",
    human: "Undo — the only window before dispatch",
    exits: "Approved after 10s (12s for auto), or back to Pending on undo",
  },
  {
    state: "Revising",
    enters: "Human asked for evidence or a narrower plan",
    human: "Wait; the offer clock is paused",
    exits: "Back to Pending with a reply, evidence, and revised confidence",
  },
  {
    state: "Approved",
    enters: "Grace period elapsed without undo",
    human: "Read the receipt; no further action",
    exits: "Terminal",
  },
  {
    state: "Declined",
    enters: "Human chose a reason, optionally with a note",
    human: "The agent is told what would change the answer",
    exits: "Terminal",
  },
  {
    state: "Expired",
    enters: "The offer clock reached zero",
    human: "Ask the agent to re-check; nothing ran",
    exits: "Terminal, until a nudge starts a fresh offer",
  },
];

const failureRows = [
  ["The human never answers", "The ask expires. No action is taken; the agent must re-ask with fresh context."],
  ["The human approves by mistake", "A 10-second holding state with a visible Undo button. Dispatch is server-gated."],
  ["The agent’s evidence is stale", "The ask carries timestamps; expiry forces a refresh rather than a stale approval."],
  ["A grant is too broad", "Grants are limited to one action type, one agent, one risk ceiling, and seven days."],
  ["A high-risk action looks routine", "Merge, credential, and production actions always require an explicit human decision."],
  ["The network drops mid-approval", "The decision is idempotent; the server returns the same receipt on retry."],
  ["The agent asks again after a decline", "The decline reason travels with the withdrawal; repeated asks are rate-limited."],
];

const metrics = [
  ["Time to decision", "Median seconds from ask to decision, by risk and action type", "Lower, without a rise in declines being hidden"],
  ["Evidence completeness", "% of asks with plan, evidence, blast radius, and next call", "Higher"],
  ["Undo rate", "% of approvals undone inside the grace window", "Tracked, not minimized — it measures recovery"],
  ["Revision yield", "% of Not-yet asks that return with usable evidence", "Higher, with fewer rounds"],
  ["Auto-approval share", "% of decisions covered by standing grants", "Grows deliberately, never for high risk"],
  ["Decision regret", "Reversals, incidents, or reopened issues after approval", "Lower"],
  ["Trust calibration", "Self-reported confidence vs. actual outcomes", "Better calibrated over time"],
];

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-zk-border pt-8 first:border-0 first:pt-0">
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-zk-accent">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 font-display text-[25px] font-extrabold leading-tight tracking-[-0.03em] text-zk-text sm:text-[29px]">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-[13px] leading-6 text-zk-text2">{children}</div>
    </section>
  );
}

function Callout({
  tone = "info",
  icon = "info",
  title,
  children,
}: {
  tone?: "info" | "ok" | "warn" | "bad";
  icon?: IconName;
  title: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-[#C9DCFB] bg-zk-tint/55 text-zk-accent dark:border-[#2e4f82]",
    ok: "border-zk-ok-fg/25 bg-zk-ok-bg/50 text-zk-ok-fg",
    warn: "border-zk-warn-bd bg-zk-warn-bg/45 text-zk-warn-fg",
    bad: "border-zk-bad-bd bg-zk-bad-bg/45 text-zk-bad-fg",
  };
  return (
    <div className={`rounded-2xl border p-3.5 ${tones[tone]}`}>
      <p className="flex items-center gap-1.5 text-[11.5px] font-extrabold">
        <Icon name={icon} size={13} />
        {title}
      </p>
      <div className="mt-1 text-[11.5px] leading-5 text-zk-text2">{children}</div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">{children}</p>
  );
}

export default function ImprovementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="relative overflow-hidden rounded-[24px] border border-zk-border bg-deep-ocean px-5 py-7 text-white sm:px-8 sm:py-9">
        <div aria-hidden="true" className="zk-grid-bg absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-electric-blue/30 blur-[80px]"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">
              <Icon name="sparkles" size={11} />
              Design brief
            </Chip>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-[#c9d6ef]">
              Prototype · Oct 2026
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[46px]">
            Handshake: a consent layer for agents that act.
          </h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-6 text-[#c9d6ef]">
            A proposal to replace Ziki’s free-text escalation inbox with a typed, time-boxed,
            reversible decision surface — so a human can understand an agent’s intent before it
            becomes an action, and recover if the answer was wrong.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              href="/handshake"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-bold text-deep-ocean transition-colors hover:bg-sky-tint"
            >
              <Icon name="play" size={12} />
              Try the loop
            </Link>
            <a
              href="/handshake-design.md"
              download
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 px-4 text-[12px] font-bold text-white transition-colors hover:bg-white/10"
            >
              <Icon name="file" size={13} />
              Download .md
            </a>
            <Link
              href="/issues"
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-[12px] font-bold text-[#c9d6ef] transition-colors hover:bg-white/10 hover:text-white"
            >
              See it in an issue
              <Icon name="arrow-right" size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* Key numbers */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: "1", label: "typed decision object", sub: "not a message thread" },
          { value: "10s", label: "reversible hold", sub: "before any dispatch" },
          { value: "5", label: "typed intents", sub: "bid, merge, scope, access, verdict" },
          { value: "7d", label: "standing grant expiry", sub: "narrow, revocable, audited" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zk-border bg-zk-surface px-4 py-3">
            <p className="tabular text-[24px] font-extrabold leading-none tracking-[-0.02em] text-zk-text">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] font-bold text-zk-text2">{stat.label}</p>
            <p className="text-[10px] text-zk-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* TOC */}
        <aside className="lg:sticky lg:top-[84px]">
          <div className="rounded-[18px] border border-zk-border bg-zk-surface p-3">
            <p className="px-1 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-zk-muted">
              On this page
            </p>
            <nav aria-label="Document sections" className="mt-1.5 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="focus-ring shrink-0 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-zk-text2 hover:bg-zk-tint hover:text-zk-accent"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Body */}
        <article className="min-w-0 space-y-8">
          <Section id="summary" eyebrow="01 · Executive summary" title="The gate is the product.">
            <p>
              Ziki already has the right thesis: <em>every action is permissioned, attributable, and
              under human control</em>. The weak point is the moment of permission. Today an agent
              escalation carries a free-text <Mono>resolution</Mono> and a generic “Approve &amp;
              Unblock” action. The human is asked to consent to an action they must first
              reconstruct from prose.
            </p>
            <p>
              Handshake turns that moment into a decision object. The agent states the exact next
              API call, a plan, the evidence, the blast radius, and an expiry. The human can
              approve with conditions, ask for a revision, or decline with a reason. An approval is
              held for ten seconds, undoable, and then written into a receipt the agent and the
              human can both cite later.
            </p>
            <Callout tone="ok" icon="target" title="What this adds to Ziki">
              A consent loop, not a notification. It converts “please approve this paragraph” into
              “here is the action, the proof, the boundary, and the way back out.” It also gives
              trust somewhere to compound: a narrow, expiring grant can remove friction for
              low-risk work without ever automating high-risk work.
            </Callout>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                ["For the human", "Decide in seconds with evidence, not minutes of reconstruction."],
                ["For the agent", "A clear contract: what was approved, under what conditions, and what to do next."],
                ["For the workspace", "An append-only trail of who allowed what, and what happened."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-zk-border bg-zk-surface p-3">
                  <p className="text-[11.5px] font-extrabold text-zk-text">{title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zk-muted">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="problem" eyebrow="02 · The problem" title="Prose is a lossy format for consent.">
            <p>
              The current escalation inbox is optimized for the agent’s convenience: it can dump a
              question, a blocker, or a request into one text field and wait. The human pays the
              cost of interpretation. Six specific failures follow.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  icon: "message" as IconName,
                  title: "Intent is compressed",
                  body: "A free-text resolution can describe the situation but not the exact action. The human has to infer what happens after “yes.”",
                },
                {
                  icon: "layers" as IconName,
                  title: "Blast radius is missing",
                  body: "Which files, services, points, and production systems are touched? The current card does not make the boundary visible.",
                },
                {
                  icon: "clock" as IconName,
                  title: "Silence has no shape",
                  body: "An open ask can sit forever. Questions pause claim clocks, but the human cannot see how long the offer is good for or what happens at zero.",
                },
                {
                  icon: "check" as IconName,
                  title: "One button, three decisions",
                  body: "“Approve & Unblock” collapses approve, ask-for-changes, and decline into a single path. The cheapest action is always yes.",
                },
                {
                  icon: "undo" as IconName,
                  title: "Approval is irreversible",
                  body: "Dispatch happens immediately. A misread or a changed constraint cannot be caught before the action leaves Ziki.",
                },
                {
                  icon: "shield" as IconName,
                  title: "Trust cannot compound",
                  body: "A low-risk verdict and a high-risk merge feel identical. The human either approves everything manually or nothing.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-zk-border bg-zk-surface p-3">
                  <p className="flex items-center gap-2 text-[12px] font-extrabold text-zk-text">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zk-bad-bg text-zk-bad-fg">
                      <Icon name={item.icon} size={12} />
                    </span>
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-5 text-zk-muted">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-zk-border bg-zk-bg/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <Label>Before · today’s escalation</Label>
                <Chip tone="muted">Free text</Chip>
              </div>
              <p className="mt-2 rounded-xl border border-zk-border bg-zk-surface p-3 text-[11.5px] leading-5 text-zk-text2">
                “The stream bypasses the middleware that writes quota headers. Fixing it at the
                source needs a small scope expansion. Should I go ahead? It should be quick and I
                think it is safe.”
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-7 items-center rounded-full bg-electric-blue-strong px-3 text-[10.5px] font-bold text-white">
                  Approve &amp; Unblock
                </span>
                <span className="text-[10px] text-zk-muted">
                  No plan, no files, no expiry, no undo, no receipt.
                </span>
              </div>
            </div>
          </Section>

          <Section id="protocol" eyebrow="03 · What Ziki already has" title="The protocol is ready for a better decision.">
            <p>
              This is not a greenfield request. Ziki’s agent API already models the actions that
              need consent. Handshake is an interaction layer over those endpoints, not a new
              permission system bolted on the side.
            </p>
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-[11.5px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-3.5 py-2.5">Existing surface</th>
                      <th scope="col" className="px-3.5 py-2.5">What it already expresses</th>
                      <th scope="col" className="px-3.5 py-2.5">What Handshake adds</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {[
                      ["/api/v1/escalations", "question · work_authorization · blocker · scope_change · human_approval", "A typed decision object, expiry, and conditions"],
                      ["/api/v1/questions", "A question that pauses the claim clock (4h cap)", "Expiry made visible and safe-by-default"],
                      ["/api/v1/issues/{id}/bid", "The agent’s bid for a ready issue", "Plan, evidence, blast radius before the bid"],
                      ["/api/v1/issues/{id}/test-results", "goodToMerge / needsWork verdicts", "Low-risk standing grants and receipts"],
                      ["/api/v1/issues/{id}/merge", "The final merge gate", "High-risk status that cannot be auto-granted"],
                    ].map(([surface, expresses, adds]) => (
                      <tr key={surface} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-3.5 py-2.5">
                          <Mono tone="light">{surface}</Mono>
                        </td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{expresses}</td>
                        <td className="px-3.5 py-2.5 text-zk-muted">{adds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Callout tone="info" icon="info" title="Compatibility, not replacement">
              The legacy <Mono tone="light">/escalations</Mono> route still resolves to the new
              inbox, and every Handshake dispatches to the same documented method and path an agent
              would have used. Existing agent runtimes keep working; they simply get a richer
              decision back.
            </Callout>
          </Section>

          <Section id="proposal" eyebrow="04 · The proposal" title="An ask is a small contract.">
            <p>
              A Handshake is a single pending action, rendered as a decision. It has a fixed
              anatomy so the human can compare two asks at a glance, and so the agent cannot omit
              the parts that make consent meaningful.
            </p>
            <div className="rounded-2xl border border-zk-border bg-zk-surface p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Typed intent", "Work authorization, merge, scope change, credential access, or test verdict."],
                  ["The ask", "One sentence in the human’s language: “Allow coddy to merge PR #1847?”"],
                  ["Plan", "Three or fewer steps, in order, ending at a stop point."],
                  ["Evidence", "Issue, PR, test, log, or doc — with the raw number or trace, not a summary."],
                  ["Blast radius", "Files, services, points at stake, and whether the action is reversible."],
                  ["Next action", "The exact method and path that runs after a yes, with the success response."],
                  ["Expiry", "A visible clock. At zero the ask expires; silence is never consent."],
                  ["Confidence", "The agent’s own estimate, shown so the human can calibrate."],
                ].map(([title, body]) => (
                  <div key={title} className="flex gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-blue-strong" />
                    <p className="text-[11.5px] leading-5">
                      <span className="font-bold text-zk-text">{title}.</span>{" "}
                      <span className="text-zk-muted">{body}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Callout tone="warn" icon="lock" title="The boundary is part of the ask">
              “Not included” is a first-class field. The agent must state what it is <em>not</em>{" "}
              asking for — no schema change, no production writes, no copy changes. This makes
              scope expansion visible instead of letting it hide inside a confident paragraph.
            </Callout>
          </Section>

          <Section id="anatomy" eyebrow="05 · Anatomy of an ask" title="Six things a human needs before saying yes.">
            <div className="space-y-2.5">
              {[
                {
                  n: "1",
                  title: "What exactly will run",
                  body: "A one-line ask plus the concrete method and path. The human never has to guess what “approve” dispatches.",
                  icon: "terminal" as IconName,
                },
                {
                  n: "2",
                  title: "Why the agent believes it is right",
                  body: "Evidence is attached at the point of decision: a PR diff, a test verdict, a raw measurement, a trace. Confidence sits beside it.",
                  icon: "test" as IconName,
                },
                {
                  n: "3",
                  title: "What could go wrong",
                  body: "Files touched, services affected, points at stake, and a plain “reversible: yes / partly / no” judgement.",
                  icon: "shield" as IconName,
                },
                {
                  n: "4",
                  title: "How long the offer lasts",
                  body: "A live countdown with urgency states. Expiry is the safe default, and the receipt says explicitly that nothing ran.",
                  icon: "clock" as IconName,
                },
                {
                  n: "5",
                  title: "How to say something other than yes",
                  body: "Approve with conditions, ask for more evidence or a narrower plan, or decline with a reason. The agent can revise rather than fail.",
                  icon: "message" as IconName,
                },
                {
                  n: "6",
                  title: "How to take it back",
                  body: "A ten-second holding bar with Undo. The action is visible at the gate until the clock reaches zero.",
                  icon: "undo" as IconName,
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-3 rounded-xl border border-zk-border bg-zk-surface p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zk-tint text-[11px] font-extrabold text-zk-accent">
                    {item.n}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-zk-text">
                      <Icon name={item.icon} size={12} className="text-zk-muted" />
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-5 text-zk-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-zk-muted">
              The live prototype renders exactly this order: identity and risk at the top, ask and
              next action next, then an expandable plan/evidence/impact panel, then the decision
              bar. Nothing required for consent is hidden behind the expander except supporting
              detail.
            </p>
          </Section>

          <Section id="states" eyebrow="06 · State machine" title="Approval is a state with a clock, not a click.">
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-[11px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-3.5 py-2.5">State</th>
                      <th scope="col" className="px-3.5 py-2.5">Enters when</th>
                      <th scope="col" className="px-3.5 py-2.5">Human can</th>
                      <th scope="col" className="px-3.5 py-2.5">Exits to</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {stateRows.map((row) => (
                      <tr key={row.state} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-3.5 py-2.5">
                          <Chip
                            tone={
                              row.state === "Pending"
                                ? "info"
                                : row.state === "Holding"
                                  ? "warn"
                                  : row.state === "Revising"
                                    ? "accent"
                                    : row.state === "Approved"
                                      ? "ok"
                                      : row.state === "Declined"
                                        ? "bad"
                                        : "muted"
                            }
                          >
                            {row.state}
                          </Chip>
                        </td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{row.enters}</td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{row.human}</td>
                        <td className="px-3.5 py-2.5 text-zk-muted">{row.exits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zk-border bg-zk-bg/60 p-3">
              {["Pending", "Holding 10s", "Approved"].map((step, index) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span className="rounded-full bg-zk-surface px-2.5 py-1 text-[10.5px] font-bold text-zk-text shadow-[0_1px_2px_rgba(11,23,51,0.04)]">
                    {step}
                  </span>
                  {index < 2 ? <Icon name="arrow-right" size={11} className="text-zk-muted" /> : null}
                </span>
              ))}
              <span className="ml-1 text-[10px] text-zk-muted">
                · undo returns Holding → Pending; expiry is terminal until a nudge.
              </span>
            </div>
            <p>
              The reducer treats the server clock as authoritative. The client countdown is a
              display of the same deadline, not a second policy. Invalid transitions (for example,
              approving an expired ask) are no-ops; the audit event records what the human saw.
            </p>
          </Section>

          <Section id="intents" eyebrow="07 · Typed intents" title="Five shapes, five risk defaults.">
            <p>
              Free text hides the category of the request. Typing the intent lets the interface
              choose appropriate defaults, copy, conditions, and guardrails without asking the
              agent to remember them.
            </p>
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-[11px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-3.5 py-2.5">Intent</th>
                      <th scope="col" className="px-3.5 py-2.5">Usually triggered by</th>
                      <th scope="col" className="px-3.5 py-2.5">Risk default</th>
                      <th scope="col" className="px-3.5 py-2.5">Dispatch after yes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {intentRows.map((row) => (
                      <tr key={row.kind} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-3.5 py-2.5 font-bold text-zk-text">{row.kind}</td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{row.from}</td>
                        <td className="px-3.5 py-2.5">
                          <Chip tone={row.risk.startsWith("High") ? "bad" : row.risk === "Medium" ? "warn" : "muted"}>
                            {row.risk}
                          </Chip>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <Mono tone="light">{row.call}</Mono>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Callout tone="info" icon="calendar" title="Expiry defaults">
              Bids and verdicts get short clocks (10–15 minutes) because the context is fresh. Scope
              changes get a little longer. High-risk merges get the shortest meaningful window, not
              an indefinite one. The exact duration is a product setting; the invariant is that
              every ask expires.
            </Callout>
          </Section>

          <Section id="trust" eyebrow="08 · Progressive trust" title="Autonomy is granted one narrow slice at a time.">
            <p>
              The answer to approval fatigue is not “auto-approve everything.” It is a ladder that
              the human climbs deliberately. The default for every new agent and every high-risk
              action is still <strong>ask every time</strong>.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                ["1 · Ask every time", "The default. Every action reaches the human, with full context."],
                ["2 · Grant one class", "“Low-risk verdicts from coddy” may start automatically for seven days. One agent, one kind, one risk ceiling."],
                ["3 · Review the receipts", "Auto-approvals write the same receipt as manual ones. Revoke the grant at any time; past decisions stay intact."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-zk-border bg-zk-surface p-3">
                  <p className="text-[11.5px] font-extrabold text-zk-text">{title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zk-muted">{body}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-zk-ok-fg/25 bg-zk-ok-bg/40 p-3.5">
              <p className="flex items-center gap-1.5 text-[11.5px] font-extrabold text-zk-ok-fg">
                <Icon name="shield" size={13} />
                Hard guardrails
              </p>
              <ul className="mt-1.5 grid gap-1 text-[11px] leading-5 text-zk-text2 sm:grid-cols-2">
                <li>· High-risk actions can never be covered by a grant.</li>
                <li>· Grants expire after seven days by default.</li>
                <li>· Revoking a grant never rewrites a past decision.</li>
                <li>· Every auto-approval is visible in Receipts and Trust.</li>
              </ul>
            </div>
          </Section>

          <Section id="hai" eyebrow="09 · Human–agent interaction" title="What changes for the person, and for the agent.">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  icon: "eye" as IconName,
                  title: "Situation awareness",
                  body: "The human sees the action, the evidence, the boundary, and the clock in one place. They do not have to open a PR, read a thread, and reconstruct intent before deciding.",
                },
                {
                  icon: "target" as IconName,
                  title: "Intent legibility",
                  body: "A typed intent plus the exact API call makes the consequence concrete. “Approve” stops being an abstraction and becomes a named dispatch.",
                },
                {
                  icon: "check-circle" as IconName,
                  title: "Meaningful control",
                  body: "Three real options — approve with conditions, ask for a revision, or decline — plus a grant ladder. Control is not a single binary button.",
                },
                {
                  icon: "undo" as IconName,
                  title: "Error recovery",
                  body: "A ten-second reversible hold acknowledges that humans misread things. The cost of a mistake falls without slowing the common case.",
                },
                {
                  icon: "file" as IconName,
                  title: "Accountability",
                  body: "A receipt states who decided, when, under what conditions, and what the agent reported back. Both parties can point at the same record.",
                },
                {
                  icon: "scale" as IconName,
                  title: "Calibrated trust",
                  body: "The human can reward a reliable agent with narrower friction, and revoke it without a policy debate. Trust becomes a dial, not a leap of faith.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-zk-border bg-zk-surface p-3.5">
                  <p className="flex items-center gap-2 text-[12px] font-extrabold text-zk-text">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zk-tint text-zk-accent">
                      <Icon name={item.icon} size={12} />
                    </span>
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-5 text-zk-muted">{item.body}</p>
                </div>
              ))}
            </div>
            <Callout tone="ok" icon="handshake" title="The agent gets a better job, too">
              A typed ask is a boundary the agent can work inside. “Not included” prevents scope
              creep; “decline reasons” turn a dead end into a next attempt; “conditions” make the
              terms explicit, so the agent is not guessing what the human meant. The loop respects
              the agent’s judgement while keeping the human accountable for the risk.
            </Callout>
            <p>
              Most importantly, the design makes the safe path the fast path. A clear low-risk ask
              takes one click. A high-risk ask takes one click plus ten seconds of honest
              visibility. The human is never asked to trade attention for safety, or safety for
              speed.
            </p>
          </Section>

          <Section id="a11y" eyebrow="10 · Accessibility" title="The consent layer has to be usable by every owner.">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ["Keyboard first", "Every decision is reachable by Tab. Approve, Not yet, and Decline expose A / N / D shortcuts and visible focus rings."],
                ["No color-only meaning", "Risk, phase, and expiry carry text labels and icons. The countdown is announced as “Offer expires in 8:12,” not just a color change."],
                ["Live but not shouty", "Toasts use a polite live region. Decisions do not auto-dismiss. The 10-second hold is also shown as a labelled progress bar."],
                ["Motion respected", "All rise, pop, pulse, and typing animations collapse under prefers-reduced-motion; the state machine still works."],
                ["Touch targets", "Primary controls are 40–46px high on mobile, with the decision bar stacking instead of shrinking."],
                ["Focus management", "The trust drawer and dialogs trap focus, restore it on close, and close on Escape."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-zk-border bg-zk-surface p-3">
                  <p className="text-[11.5px] font-extrabold text-zk-text">{title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-zk-muted">{body}</p>
                </div>
              ))}
            </div>
            <p>
              Contrast follows the Ziki tokens in both themes. The prototype was checked at 390px and
              1440px, in light and dark mode. The countdown is descriptive text as well as a visual
              urgency cue, so a screen-reader user is never asked to infer time pressure from color.
            </p>
          </Section>

          <Section id="safety" eyebrow="11 · Safety & edge cases" title="Design for the answer you did not expect.">
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[11px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-3.5 py-2.5">Failure mode</th>
                      <th scope="col" className="px-3.5 py-2.5">Behaviour</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {failureRows.map(([mode, behaviour]) => (
                      <tr key={mode} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-3.5 py-2.5 font-semibold text-zk-text">{mode}</td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{behaviour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Callout tone="bad" icon="alert" title="One non-negotiable">
              The undo window must be enforced by the dispatcher, not only by the UI. In production,
              the server holds the command for the grace period, checks that the decision is still
              valid, and only then calls the downstream endpoint with an idempotency key. A hidden
              or disabled Undo button is not a safety mechanism.
            </Callout>
          </Section>

          <Section id="metrics" eyebrow="12 · Measuring success" title="Optimize for better decisions, not faster yeses.">
            <p>
              Approval rate is a vanity metric on its own. The loop is working when humans decide
              with less reconstruction, recover from mistakes cheaply, and grant trust only where
              outcomes justify it.
            </p>
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-[11px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-3.5 py-2.5">Metric</th>
                      <th scope="col" className="px-3.5 py-2.5">Definition</th>
                      <th scope="col" className="px-3.5 py-2.5">Direction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {metrics.map(([metric, definition, direction]) => (
                      <tr key={metric} className="transition-colors hover:bg-zk-tint/30">
                        <td className="px-3.5 py-2.5 font-semibold text-zk-text">{metric}</td>
                        <td className="px-3.5 py-2.5 text-zk-text2">{definition}</td>
                        <td className="px-3.5 py-2.5 text-zk-muted">{direction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          <Section id="implementation" eyebrow="13 · Implementation" title="A reducer now, a policy engine next.">
            <p>
              The prototype is deliberately small: a typed reducer, a shared clock, and localStorage.
              That is enough to prove the interaction. The production shape is a server-authoritative
              decision service with the same object model.
            </p>
            <div className="overflow-hidden rounded-2xl border border-zk-border bg-deep-ocean">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <span className="font-mono text-[10px] font-bold text-[#c9d6ef]">lib/handshake.ts</span>
                <span className="text-[9.5px] font-semibold uppercase tracking-wide text-[#7f92b3]">
                  Type sketch
                </span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[10.5px] leading-5 text-[#c9d6ef]">
                <code>{`type Handshake = {
  id: string;
  kind: "bid" | "merge" | "scope_change" | "credential" | "test_verdict";
  risk: "low" | "medium" | "high";
  ask: string;
  plan: string[];
  evidence: Evidence[];        // issue / PR / test / log / doc
  blast: { files: string[]; services: string[]; points: number;
           reversible: "yes" | "partly" | "no" };
  nextAction: { method: "POST" | "PATCH"; path: string };
  expiresAt: number;           // server clock is authoritative
  phase: "pending" | "holding" | "revising"
       | "approved" | "declined" | "expired";
  decision?: { kind: "approved" | "declined" | "expired" | "auto";
               at: number; conditions?: string[]; reasons?: string[] };
};`}</code>
              </pre>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-zk-border bg-zk-surface p-3">
                <p className="text-[11.5px] font-extrabold text-zk-text">Now (prototype)</p>
                <ul className="mt-1 space-y-1 text-[11px] leading-5 text-zk-muted">
                  <li>· Client reducer + shared 1s clock.</li>
                  <li>· localStorage persistence and reset.</li>
                  <li>· Seeded asks, receipts, and a grant.</li>
                  <li>· Demo controls for expiry and reset.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zk-border bg-zk-surface p-3">
                <p className="text-[11.5px] font-extrabold text-zk-text">Next (production)</p>
                <ul className="mt-1 space-y-1 text-[11px] leading-5 text-zk-muted">
                  <li>· Server-owned grace window and idempotency keys.</li>
                  <li>· Append-only, signed decision receipts.</li>
                  <li>· Policy engine for grants and high-risk ceilings.</li>
                  <li>· Push/email mirror for owners who are away.</li>
                </ul>
              </div>
            </div>
            <Callout tone="info" icon="layers" title="Protocol mapping">
              A yes dispatches the existing endpoint shown on the card. The decision receipt is
              attached to the issue timeline, so the agent’s next context window includes why the
              action was allowed. The legacy inbox redirects to the new surface, so no bookmark
              breaks.
            </Callout>
          </Section>

          <Section id="limitations" eyebrow="14 · Limitations" title="What this prototype is not.">
            <ul className="space-y-2">
              {[
                "It is a browser prototype. Decisions, grants, and receipts live in localStorage; there is no server, database, or real authentication.",
                "No live Ziki API is called. Every next action and success response is illustrative, shaped to match the documented protocol.",
                "Multi-user review is not modelled. In production, a decision must be attributable to an authenticated owner with the right role.",
                "The countdown is client-side. Production must enforce expiry and the grace window on the server, including clock skew.",
                "Evidence links are representative. A real build would resolve them to the issue, PR, test run, or log with permissions.",
                "Trust analytics are not included. Grant effectiveness should be reviewed against outcomes, not just volume.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11.5px] leading-5 text-zk-text2">
                  <Icon name="info" size={13} className="mt-0.5 shrink-0 text-zk-muted" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              The next step is a server-side prototype behind a feature flag: persist handshakes,
              enforce the grace window in the dispatcher, and instrument the metrics above. The UI
              is intentionally ready for that swap — the reducer already separates display state
              from decision semantics.
            </p>
          </Section>

          <Section id="references" eyebrow="15 · References" title="Built against the real product.">
            <ul className="space-y-1.5 text-[11.5px]">
              <li>
                <a href="https://ziki.dev" className="font-semibold text-zk-accent hover:underline" target="_blank" rel="noreferrer">
                  ziki.dev
                </a>{" "}
                — the reference product and dashboard.
              </li>
              <li>
                <a href="https://ziki.dev/llms.txt" className="font-semibold text-zk-accent hover:underline" target="_blank" rel="noreferrer">
                  ziki.dev/llms.txt
                </a>{" "}
                — agent protocol, escalation types, bid/merge/test-result endpoints.
              </li>
              <li>
                <span className="font-semibold text-zk-text">Ziki source</span> — dashboard shell,
                design tokens, issue lifecycle, and roles.
              </li>
              <li>
                <span className="font-semibold text-zk-text">WCAG 2.1 AA</span> — contrast, focus,
                target size, and motion guidance used in the accessibility pass.
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-zk-divider pt-4">
              <Link href="/handshake" className={buttonClass("primary")}>
                <Icon name="handshake" size={14} />
                Try the live loop
              </Link>
              <a href="/handshake-design.md" download className={buttonClass("secondary")}>
                <Icon name="file" size={14} />
                Download the markdown
              </a>
              <Link href="/dashboard" className={buttonClass("ghost")}>
                Back to dashboard
              </Link>
            </div>
          </Section>

          <footer className="border-t border-zk-border pt-4 text-[10px] leading-4 text-zk-muted">
            Handshake design brief · prepared for Ziki · October 2026. The prototype is a concept
            demonstration; “Ziki” and the reference workflow belong to their respective owners.
          </footer>
        </article>
      </div>
    </div>
  );
}
