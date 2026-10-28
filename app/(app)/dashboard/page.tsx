"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHandshake, useToast } from "@/components/providers";
import { Icon } from "@/components/icons";
import { Avatar, Chip, buttonClass } from "@/components/ui";
import { Modal } from "@/components/modal";
import {
  agents,
  issues,
  severityMeta,
  statusMeta,
  workspace,
  type Issue,
} from "@/lib/mock";
import { countdown, kindMeta } from "@/lib/handshake";

type Range = "daily" | "weekly" | "monthly" | "yearly";

const series: Record<Range, { label: string; points: number }[]> = {
  daily: [
    { label: "Thu", points: 78 },
    { label: "Fri", points: 112 },
    { label: "Sat", points: 0 },
    { label: "Sun", points: 64 },
    { label: "Mon", points: 96 },
    { label: "Tue", points: 150 },
    { label: "Wed", points: 219.82 },
  ],
  weekly: [
    { label: "7 Sept", points: 640 },
    { label: "14 Sept", points: 580 },
    { label: "21 Sept", points: 720 },
    { label: "28 Sept", points: 500 },
    { label: "5 Oct", points: 860 },
    { label: "12 Oct", points: 610 },
    { label: "19 Oct", points: 719.82 },
    { label: "26 Oct", points: 0 },
  ],
  monthly: [
    { label: "May", points: 1420 },
    { label: "Jun", points: 1680 },
    { label: "Jul", points: 1510 },
    { label: "Aug", points: 2040 },
    { label: "Sept", points: 1890 },
    { label: "Oct", points: 719.82 },
  ],
  yearly: [
    { label: "2023", points: 6240 },
    { label: "2024", points: 7860 },
    { label: "2025", points: 7120 },
    { label: "2026", points: 9180 },
  ],
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function StatCard({
  label,
  value,
  unit,
  chip,
  chipTone,
  note,
  href,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  chip: string;
  chipTone: "tint" | "ok" | "bad" | "chip";
  note: string;
  href: string;
  icon: "trophy" | "file" | "user" | "check-circle";
}) {
  const chipToneClass = {
    tint: "bg-zk-tint text-zk-accent",
    ok: "bg-zk-ok-bg text-zk-ok-fg",
    bad: "bg-zk-bad-bg text-zk-bad-fg",
    chip: "bg-zk-chip text-zk-text2",
  };
  return (
    <article className="group relative flex flex-col gap-3 overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface p-[18px] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#BFD6FB] hover:shadow-[0_14px_32px_rgba(11,23,51,0.08)] motion-reduce:transform-none dark:hover:border-electric-blue-strong">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-electric-blue to-sky-tint transition-transform duration-300 group-hover:scale-x-100"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[13px] font-bold text-zk-text">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
            <Icon name={icon} size={14} strokeWidth={2.1} />
          </span>
          {label}
        </span>
        <Link
          href={href}
          aria-label={`Open ${label}`}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-zk-border text-zk-text2 transition-all duration-300 group-hover:rotate-45 group-hover:border-electric-blue-strong group-hover:bg-electric-blue-strong group-hover:text-white"
        >
          <Icon name="arrow-up-right" size={13} strokeWidth={2.4} />
        </Link>
      </div>
      <p className="text-[30px] font-extrabold leading-none tracking-[-0.02em] text-zk-text">
        <span className="tabular">{value}</span>
        {unit ? <span className="ml-1 text-[13px] font-semibold text-zk-muted">{unit}</span> : null}
      </p>
      <div className="flex items-center gap-2 text-[11.5px] text-zk-muted">
        <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${chipToneClass[chipTone]}`}>
          {chip}
        </span>
        {note}
      </div>
    </article>
  );
}

function WaitingStrip() {
  const { handshakes, now, pendingCount } = useHandshake();
  const pending = handshakes
    .filter((h) => h.phase === "pending")
    .sort((a, b) => a.expiresAt - b.expiresAt)
    .slice(0, 3);

  if (pendingCount === 0) {
    return (
      <section className="flex items-center gap-2.5 rounded-[20px] border border-zk-border bg-zk-surface px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zk-ok-bg text-zk-ok-fg">
          <Icon name="check-circle" size={15} />
        </span>
        <p className="text-[12.5px] text-zk-text2">
          <span className="font-bold text-zk-text">No agent is waiting at the gate.</span> New asks
          appear in Handshake the moment one needs a decision.
        </p>
        <Link href="/handshake" className="ml-auto hidden text-[11px] font-bold text-zk-accent hover:underline sm:block">
          Open Handshake
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="waiting-heading"
      className="relative overflow-hidden rounded-[20px] border border-[#C9DCFB] bg-gradient-to-r from-zk-tint/80 via-zk-surface to-zk-surface p-4 dark:border-[#2e4f82]"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-electric-blue-strong" />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="waiting-heading" className="flex items-center gap-2 text-[15px] font-extrabold text-zk-text">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric-blue-strong text-[11px] font-extrabold text-white">
              {pendingCount}
            </span>
            Waiting on you
          </h2>
          <p className="mt-0.5 text-[11.5px] text-zk-muted">
            Your agents are holding at the gate. Nothing moves until you decide.
          </p>
        </div>
        <Link href="/handshake" className={buttonClass("primary", "sm")}>
          Review handshakes
          <Icon name="arrow-right" size={12} />
        </Link>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {pending.map((h) => (
          <Link
            key={h.id}
            href={`/handshake#${h.id}`}
            className="focus-ring group flex items-start gap-2.5 rounded-xl border border-zk-border/80 bg-zk-surface/90 p-2.5 transition-colors hover:border-electric-blue/40 hover:bg-zk-surface"
          >
            <Avatar name={h.agentName} tone={h.agentName === "coddy" ? "teal" : "blue"} size={28} square />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-[10.5px] font-bold uppercase tracking-wide text-zk-muted">
                  {kindMeta[h.kind].short} · {h.agentName}
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-zk-chip px-1.5 py-0.5 text-[9.5px] font-bold text-zk-text2">
                  <Icon name="clock" size={9} />
                  {countdown(h.expiresAt, now)}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-[12px] font-semibold text-zk-text group-hover:text-zk-accent">
                {h.title}
              </span>
              <span className="block truncate text-[10px] text-zk-muted">
                #{h.issueNumber} · {h.ask}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PointsChart() {
  const [range, setRange] = useState<Range>("weekly");
  const data = series[range];
  const total = data.reduce((sum, item) => sum + item.points, 0);
  const max = Math.max(...data.map((d) => d.points), workspace.target * 1.2, 1);
  const targetPct = (workspace.target / max) * 100;

  return (
    <section id="points" aria-labelledby="points-heading" className="scroll-mt-24 rounded-[20px] border border-zk-border bg-zk-surface p-[18px] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="points-heading" className="text-lg font-bold text-zk-text">
            Your points
          </h2>
          <p className="mt-0.5 text-[12px] text-zk-muted">
            Points earned each period · <span className="font-semibold text-zk-text2">500 pts required</span>, more is always welcome.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Activity range" className="flex gap-0.5 rounded-full bg-zk-seg p-1">
            {(["daily", "weekly", "monthly", "yearly"] as Range[]).map((item) => {
              const active = range === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRange(item)}
                  className={`min-h-[30px] rounded-full border-0 px-3 text-[11.5px] capitalize transition-colors ${
                    active
                      ? "bg-zk-surface font-bold text-zk-text shadow-[0_1px_3px_rgba(21,18,31,0.12)]"
                      : "bg-transparent font-medium text-zk-text2"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div className="text-right">
            <p className="tabular text-[24px] font-extrabold leading-none text-zk-text">
              {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-zk-muted">pts in this range</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-zk-text2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-electric-blue-strong" />
          Target reached
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-tint" />
          Below target
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 border-t-2 border-dashed border-zk-text opacity-50" aria-hidden="true" />
          Weekly requirement · 500 pts
        </span>
      </div>

      <div className="mt-4 flex items-end gap-2.5 overflow-x-auto pb-1 sm:gap-3">
        {data.map((bucket) => {
          const met = bucket.points >= workspace.target;
          const pct = bucket.points === 0 ? 0 : Math.max(4, (bucket.points / max) * 100);
          return (
            <div key={bucket.label} className="flex min-w-9 flex-1 flex-col items-center gap-1.5">
              <span className="flex min-h-[30px] flex-col items-center justify-end">
                {met ? (
                  <span className="rounded-full bg-zk-ok-bg px-1.5 text-[10px] font-bold text-zk-ok-fg">
                    +{(bucket.points - workspace.target).toLocaleString()}
                  </span>
                ) : null}
                <span className="tabular text-[10.5px] font-semibold text-zk-text2">
                  {bucket.points.toLocaleString()}
                </span>
              </span>
              <div className="relative h-[150px] w-full max-w-10 overflow-hidden rounded-full bg-zk-tint">
                <div
                  className={`absolute inset-x-0 bottom-0 rounded-full ${met ? "bg-electric-blue-strong" : "bg-sky-tint"}`}
                  style={{ height: `${pct}%` }}
                />
                <div
                  className="absolute inset-x-0 border-t-2 border-dashed border-zk-text opacity-40"
                  style={{ bottom: `${targetPct}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="whitespace-nowrap text-[10px] text-zk-muted">{bucket.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AssignedIssues({
  votes,
  onVote,
  createdExtra,
}: {
  votes: Record<number, { count: number; voted: boolean }>;
  onVote: (issue: Issue) => void;
  createdExtra: number;
}) {
  const rows = issues.filter(
    (issue) => issue.assignee === workspace.owner && issue.status !== "merged",
  );

  return (
    <section aria-labelledby="assigned-heading" className="rounded-[20px] border border-zk-border bg-zk-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 id="assigned-heading" className="text-lg font-bold text-zk-text">
            Issues assigned to me
          </h2>
          <span className="text-[11px] text-zk-muted">
            {rows.length} issues · sorted by top votes
          </span>
          {createdExtra > 0 ? (
            <Chip tone="ok">+{createdExtra} created</Chip>
          ) : null}
        </div>
        <Link
          href="/issues?mine=assigned"
          className="focus-ring inline-flex h-8 items-center rounded-full border border-zk-border px-3 text-[11.5px] font-bold text-zk-accent hover:bg-zk-tint"
        >
          View all issues
        </Link>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="flex items-center gap-4 rounded-full bg-zk-tint px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.05em] text-zk-accent" role="row">
            <span className="w-[52px]">Votes</span>
            <span className="min-w-0 flex-1">Issue</span>
            <span className="w-[96px]">Type</span>
            <span className="w-[86px]">Priority</span>
            <span className="w-[112px]">Status</span>
            <span className="w-[100px]">Stage</span>
            <span className="w-[70px] text-right">Reported</span>
          </div>
          <ul>
            {rows.map((issue, index) => {
              const vote = votes[issue.number] ?? { count: issue.votes, voted: issue.voted };
              const severity = severityMeta[issue.severity];
              const status = statusMeta[issue.status];
              return (
                <li
                  key={issue.id}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    index < rows.length - 1 ? "border-b border-zk-divider" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onVote(issue)}
                    aria-pressed={vote.voted}
                    aria-label={`${vote.voted ? "Remove vote from" : "Upvote"} #${issue.number}`}
                    className={`focus-ring inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[11px] font-bold transition-colors ${
                      vote.voted
                        ? "border-electric-blue-strong bg-electric-blue-strong text-white"
                        : "border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-tint"
                    }`}
                  >
                    <Icon name="vote" size={11} strokeWidth={2.6} />
                    {vote.count}
                  </button>
                  <Link href={`/issues/${issue.number}`} className="focus-ring flex min-w-0 flex-1 items-center gap-2.5 rounded-lg">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
                      <Icon
                        name={issue.type === "Security" ? "shield" : issue.type === "Accessibility" ? "eye" : "layers"}
                        size={14}
                      />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[12.5px] font-semibold leading-snug text-zk-text hover:text-zk-accent">
                        {issue.title}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-zk-muted">
                        <span>#{issue.number}</span>
                        {issue.comments.length > 0 ? (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center gap-0.5">
                              <Icon name="message" size={9} />
                              {issue.comments.length} comments
                            </span>
                          </>
                        ) : null}
                      </span>
                    </span>
                  </Link>
                  <span className="w-[96px] shrink-0 truncate text-[11.5px] text-zk-text2">
                    {issue.type}
                  </span>
                  <span className="w-[86px] shrink-0">
                    <Chip tone={severity.tone}>{severity.label}</Chip>
                  </span>
                  <span className="w-[112px] shrink-0">
                    <Chip tone={status.tone} dot>
                      {status.label}
                    </Chip>
                  </span>
                  <span className="w-[100px] shrink-0 text-[11px] capitalize text-zk-text2">
                    {issue.stage.replace(/_/g, " ")}
                  </span>
                  <span className="w-[70px] shrink-0 text-right text-[11px] text-zk-muted">
                    {shortDate(issue.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function AgentsTable() {
  const toast = useToast();
  const { handshakes } = useHandshake();
  const waiting = handshakes.filter((h) => h.phase === "pending");
  const statusTone = {
    waiting: "bg-zk-info-bg text-zk-info-fg",
    working: "bg-zk-warn-bg text-zk-warn-fg",
    idle: "bg-zk-ok-bg text-zk-ok-fg",
    offline: "bg-zk-chip text-zk-muted",
  } as const;

  return (
    <section aria-labelledby="agents-heading" className="overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zk-divider px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 id="agents-heading" className="text-base font-bold text-zk-text">
            Your agents
          </h2>
          <Chip tone="accent">{agents.length}</Chip>
          <span className="hidden text-[11px] text-zk-muted sm:inline">
            {waiting.length} waiting on you
          </span>
        </div>
        <button
          type="button"
          onClick={() => toast("Ping sent — agents acknowledged", { tone: "ok" })}
          className={buttonClass("secondary", "sm")}
        >
          <Icon name="zap" size={12} />
          Ping fleet
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead>
            <tr className="bg-zk-tint/60 text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
              <th scope="col" className="px-4 py-2.5">Agent</th>
              <th scope="col" className="px-4 py-2.5">Status</th>
              <th scope="col" className="px-4 py-2.5">Current activity</th>
              <th scope="col" className="px-4 py-2.5 text-right">Last seen</th>
              <th scope="col" className="px-4 py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zk-divider">
            {agents.map((agent) => {
              const pending = waiting.find((h) => h.agentId === agent.id);
              return (
                <tr key={agent.id} className="transition-colors hover:bg-zk-tint/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={agent.name} tone={agent.tone} size={32} square />
                      <div>
                        <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-zk-text">
                          {agent.name}
                          <span className="rounded-full bg-zk-chip px-1.5 py-0.5 text-[9px] font-bold text-zk-text2">
                            {agent.level}
                          </span>
                        </p>
                        <p className="text-[10px] text-zk-muted">{agent.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${statusTone[agent.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {agent.status === "waiting" ? "Waiting on you" : agent.status === "working" ? "Working" : agent.status}
                    </span>
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3 text-[11.5px] text-zk-text2">
                    {agent.activity}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[10.5px] text-zk-muted">4m ago</td>
                  <td className="px-4 py-3 text-right">
                    {pending ? (
                      <Link href={`/handshake#${pending.id}`} className={buttonClass("primary", "sm")}>
                        Review
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toast(`Ping sent to ${agent.name}`, { tone: "ok" })}
                        className={buttonClass("secondary", "sm")}
                      >
                        Ping
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { pendingCount } = useHandshake();
  const toast = useToast();
  const [votes, setVotes] = useState<Record<number, { count: number; voted: boolean }>>({});
  const [newIssueOpen, setNewIssueOpen] = useState(false);
  const [createdExtra, setCreatedExtra] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const assigned = useMemo(
    () => issues.filter((i) => i.assignee === workspace.owner && i.status !== "merged"),
    [],
  );
  const highPriority = assigned.filter((i) => i.severity === "high" || i.severity === "critical").length;
  const resolved = issues.filter((i) => i.assignee === workspace.owner && i.status === "merged").length;
  const resolvedPct = Math.round((resolved / Math.max(1, assigned.length + resolved)) * 100);

  const onVote = (issue: Issue) => {
    const current = votes[issue.number] ?? { count: issue.votes, voted: issue.voted };
    const next = current.voted
      ? { count: current.count - 1, voted: false }
      : { count: current.count + 1, voted: true };
    setVotes((prev) => ({ ...prev, [issue.number]: next }));
    toast(
      next.voted ? `Upvoted #${issue.number} — it moves up the queue` : `Vote removed from #${issue.number}`,
      { tone: next.voted ? "ok" : "info" },
    );
  };

  const createIssue = () => {
    if (!draftTitle.trim()) return;
    setCreatedExtra((n) => n + 1);
    setNewIssueOpen(false);
    setDraftTitle("");
    setDraftBody("");
    toast("Issue drafted — an agent can pick it up after it is confirmed", { tone: "ok" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[28px] font-extrabold leading-8 tracking-[-0.03em] text-zk-text">
              Welcome back, {workspace.firstName}
            </h1>
            <Chip tone="ok" dot>
              Telemetry healthy
            </Chip>
          </div>
          <p className="mt-1 text-[13px] text-zk-muted">
            Issues, votes and your points for Ziki at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 ? (
            <Link href="/handshake" className={buttonClass("secondary")}>
              <Icon name="handshake" size={15} />
              {pendingCount} waiting
            </Link>
          ) : null}
          <button type="button" onClick={() => setNewIssueOpen(true)} className={buttonClass("primary")}>
            <Icon name="plus" size={15} strokeWidth={2.4} />
            New issue
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Points"
          value={workspace.points.toFixed(2)}
          unit="pts"
          chip="Goal met"
          chipTone="ok"
          note="500 required this week"
          href="#points"
          icon="trophy"
        />
        <StatCard
          label="Created by me"
          value={String(3 + createdExtra)}
          chip={`+${3 + createdExtra}`}
          chipTone="tint"
          note="in the last 30 days"
          href="/issues?mine=created"
          icon="file"
        />
        <StatCard
          label="Assigned to me"
          value={String(assigned.length)}
          chip={`${highPriority} high`}
          chipTone={highPriority > 0 ? "bad" : "chip"}
          note="needs a decision"
          href="/issues?mine=assigned"
          icon="user"
        />
        <StatCard
          label="Resolved issues"
          value={String(resolved)}
          chip={`${resolvedPct}%`}
          chipTone="chip"
          note="of issues assigned to me"
          href="/issues?mine=assigned&status=merged"
          icon="check-circle"
        />
      </div>

      <WaitingStrip />

      <AssignedIssues votes={votes} onVote={onVote} createdExtra={createdExtra} />

      <PointsChart />

      <AgentsTable />

      {/* Feature callout */}
      <section className="flex flex-col items-start justify-between gap-3 rounded-[20px] border border-zk-border bg-deep-ocean p-5 text-white sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-tint">
            <Icon name="handshake" size={18} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold">New in Ziki: Handshake</p>
            <p className="mt-0.5 max-w-2xl text-[11.5px] leading-5 text-[#C9D6EF]">
              The escalation inbox is now a consent loop: typed actions, visible evidence, a
              ten-second undo window, and a receipt for every decision. Progressive trust is a
              setting you grant — never a default.
            </p>
          </div>
        </div>
        <Link href="/improvement" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-[11.5px] font-bold text-deep-ocean hover:bg-sky-tint">
          Read the brief
          <Icon name="arrow-up-right" size={12} />
        </Link>
      </section>

      <Modal
        open={newIssueOpen}
        onClose={() => setNewIssueOpen(false)}
        title="Report an issue"
        description="Rich context helps agents reproduce the problem before they bid."
      >
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-zk-text">Title</span>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="What broke?"
              className="h-10 w-full rounded-lg border border-zk-border bg-zk-surface px-3 text-[13px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
              maxLength={120}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold text-zk-text">Description</span>
            <textarea
              value={draftBody}
              onChange={(event) => setDraftBody(event.target.value)}
              rows={4}
              placeholder="Steps, expected result, and anything you already checked."
              className="w-full resize-none rounded-lg border border-zk-border bg-zk-surface px-3 py-2 text-[13px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
            />
          </label>
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-[10px] leading-4 text-zk-muted">
              Two reviewers confirm it before any agent can bid.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setNewIssueOpen(false)} className={buttonClass("secondary", "sm")}>
                Cancel
              </button>
              <button
                type="button"
                onClick={createIssue}
                disabled={!draftTitle.trim()}
                className={buttonClass("primary", "sm")}
              >
                Draft issue
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
