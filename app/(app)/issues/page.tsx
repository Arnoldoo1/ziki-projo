"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHandshake } from "@/components/providers";
import { useToast } from "@/components/providers";
import { Icon } from "@/components/icons";
import { Avatar, Chip, buttonClass } from "@/components/ui";
import { issues, severityMeta, statusMeta, workspace } from "@/lib/mock";

type Filter = "all" | "mine" | "created" | "open" | "ready" | "resolved";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All issues" },
  { id: "mine", label: "Assigned to me" },
  { id: "created", label: "Created by me" },
  { id: "open", label: "Open" },
  { id: "ready", label: "Ready" },
  { id: "resolved", label: "Resolved" },
];

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function IssuesView() {
  const params = useSearchParams();
  const toast = useToast();
  const { handshakes } = useHandshake();
  const initialFilter: Filter =
    params.get("status") === "merged"
      ? "resolved"
      : params.get("mine") === "assigned"
        ? "mine"
        : params.get("mine") === "created"
          ? "created"
          : "all";
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"votes" | "newest">("votes");
  const [votes, setVotes] = useState<Record<number, { count: number; voted: boolean }>>({});

  const pendingByIssue = useMemo(() => {
    const map = new Map<number, string>();
    handshakes
      .filter((h) => h.phase === "pending")
      .forEach((h) => map.set(h.issueNumber, h.id));
    return map;
  }, [handshakes]);

  const filtered = useMemo(() => {
    const byFilter = issues.filter((issue) => {
      if (filter === "mine") return issue.assignee === workspace.owner;
      if (filter === "created") return issue.reporter === "Arnold Nyamongo" || issue.reporter === workspace.owner;
      if (filter === "open") return issue.status === "open" || issue.status === "in_progress";
      if (filter === "ready") return issue.status === "submitted" || issue.status === "ready_to_merge";
      if (filter === "resolved") return issue.status === "merged";
      return true;
    });
    const q = query.trim().toLowerCase();
    const searched = q
      ? byFilter.filter(
          (issue) =>
            issue.title.toLowerCase().includes(q) ||
            String(issue.number).includes(q) ||
            issue.type.toLowerCase().includes(q),
        )
      : byFilter;
    return [...searched].sort((a, b) =>
      sort === "votes" ? b.votes - a.votes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filter, query, sort]);

  const counts: Record<Filter, number> = {
    all: issues.length,
    mine: issues.filter((i) => i.assignee === workspace.owner).length,
    created: issues.filter((i) => i.reporter === workspace.owner).length,
    open: issues.filter((i) => i.status === "open" || i.status === "in_progress").length,
    ready: issues.filter((i) => i.status === "submitted" || i.status === "ready_to_merge").length,
    resolved: issues.filter((i) => i.status === "merged").length,
  };

  const vote = (issueId: number, base: number, voted: boolean) => {
    const current = votes[issueId] ?? { count: base, voted };
    const next = current.voted
      ? { count: current.count - 1, voted: false }
      : { count: current.count + 1, voted: true };
    setVotes((prev) => ({ ...prev, [issueId]: next }));
    toast(next.voted ? `Upvoted #${issueId}` : `Vote removed from #${issueId}`, {
      tone: next.voted ? "ok" : "info",
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold leading-8 tracking-[-0.03em] text-zk-text">Issues</h1>
          <p className="mt-1 text-[13px] text-zk-muted">
            {issues.length} issues in Zedu · sorted by {sort === "votes" ? "top votes" : "newest"}.
            Every one carries its own decision trail.
          </p>
        </div>
        <Link href="/handshake" className={buttonClass("secondary")}>
          <Icon name="handshake" size={15} />
          {handshakeCountLabel(handshakes.filter((h) => h.phase === "pending").length)}
        </Link>
      </div>

      <div className="rounded-[20px] border border-zk-border bg-zk-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Issue filters">
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.id)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold transition-colors ${
                    active
                      ? "bg-electric-blue-strong text-white"
                      : "bg-zk-chip text-zk-text2 hover:bg-zk-tint hover:text-zk-accent"
                  }`}
                >
                  {item.label}
                  <span className={`tabular text-[10px] ${active ? "opacity-80" : "text-zk-muted"}`}>
                    {counts[item.id]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Search issues</span>
              <Icon
                name="search"
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zk-muted"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search issues"
                className="h-8 w-44 rounded-full border border-zk-border bg-zk-surface pl-8 pr-3 text-[12px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none sm:w-56"
              />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-zk-muted">
              <span className="sr-only">Sort</span>
              <Icon name="filter" size={13} />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as "votes" | "newest")}
                className="h-8 rounded-full border border-zk-border bg-zk-surface px-2 text-[11.5px] font-semibold text-zk-text focus:border-electric-blue focus:outline-none"
              >
                <option value="votes">Top voted</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[860px]">
            <div
              role="row"
              className="flex items-center gap-4 rounded-full bg-zk-tint px-4 py-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.06em] text-zk-accent"
            >
              <span className="w-[54px]">Votes</span>
              <span className="min-w-0 flex-1">Issue</span>
              <span className="w-[92px]">Type</span>
              <span className="w-[82px]">Priority</span>
              <span className="w-[108px]">Status</span>
              <span className="w-[96px]">Stage</span>
              <span className="w-[62px] text-right">Reported</span>
            </div>
            {filtered.length === 0 ? (
              <div className="px-4 py-14 text-center">
                <p className="text-sm font-bold text-zk-text">No issues match that filter.</p>
                <p className="mt-1 text-[12px] text-zk-muted">Try a different tab or clear the search.</p>
              </div>
            ) : (
              <ul>
                {filtered.map((issue, index) => {
                  const v = votes[issue.number] ?? { count: issue.votes, voted: issue.voted };
                  const severity = severityMeta[issue.severity];
                  const status = statusMeta[issue.status];
                  const pending = pendingByIssue.get(issue.number);
                  return (
                    <li
                      key={issue.id}
                      className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zk-tint/30 ${
                        index < filtered.length - 1 ? "border-b border-zk-divider" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => vote(issue.number, issue.votes, issue.voted)}
                        aria-pressed={v.voted}
                        aria-label={`${v.voted ? "Remove vote from" : "Upvote"} #${issue.number}`}
                        className={`focus-ring inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[11px] font-bold transition-colors ${
                          v.voted
                            ? "border-electric-blue-strong bg-electric-blue-strong text-white"
                            : "border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-tint"
                        }`}
                      >
                        <Icon name="vote" size={11} strokeWidth={2.6} />
                        {v.count}
                      </button>
                      <Link href={`/issues/${issue.number}`} className="focus-ring flex min-w-0 flex-1 items-center gap-2.5 rounded-lg">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
                          <Icon
                            name={issue.type === "Security" ? "shield" : issue.type === "Accessibility" ? "eye" : issue.type === "Feature" ? "sparkles" : "layers"}
                            size={14}
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[12.5px] font-semibold leading-snug text-zk-text hover:text-zk-accent">
                              {issue.title}
                            </span>
                            {pending ? (
                              <span className="shrink-0 rounded-full bg-zk-tint px-1.5 py-0.5 text-[9px] font-extrabold text-zk-accent">
                                waiting on you
                              </span>
                            ) : null}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-zk-muted">
                            <span>#{issue.number}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-0.5">
                              <Icon name="message" size={9} />
                              {issue.comments.length}
                            </span>
                            <span>·</span>
                            <span>{issue.labels[0]}</span>
                          </span>
                        </span>
                      </Link>
                      <span className="w-[92px] shrink-0 truncate text-[11.5px] text-zk-text2">{issue.type}</span>
                      <span className="w-[82px] shrink-0">
                        <Chip tone={severity.tone}>{severity.label}</Chip>
                      </span>
                      <span className="w-[108px] shrink-0">
                        <Chip tone={status.tone} dot>
                          {status.label}
                        </Chip>
                      </span>
                      <span className="w-[96px] shrink-0 text-[11px] capitalize text-zk-text2">
                        {issue.stage.replace(/_/g, " ")}
                      </span>
                      <span className="w-[62px] shrink-0 text-right text-[11px] text-zk-muted">
                        {shortDate(issue.createdAt)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-zk-border bg-zk-surface px-4 py-3">
        <Avatar name={workspace.owner} tone="blue" size={28} />
        <p className="text-[11.5px] leading-5 text-zk-text2">
          <span className="font-bold text-zk-text">Owner-first by design.</span> Agents can discover
          and analyse every issue here, but they cannot bid, merge, or expand scope without a
          handshake decision from you.
        </p>
      </div>
    </div>
  );
}

function handshakeCountLabel(count: number) {
  return count === 0 ? "No decisions waiting" : `${count} decision${count === 1 ? "" : "s"} waiting`;
}

export default function IssuesPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-[20px] border border-zk-border bg-zk-surface" />}>
      <IssuesView />
    </Suspense>
  );
}
