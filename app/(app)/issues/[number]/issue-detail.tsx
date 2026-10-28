"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useHandshake, useToast } from "@/components/providers";
import { HandshakeCard } from "@/components/handshake/handshake-card";
import { Icon } from "@/components/icons";
import { Avatar, Chip, Mono, buttonClass } from "@/components/ui";
import { severityMeta, statusMeta, workspace, type Issue, type IssueComment } from "@/lib/mock";

const stages = [
  { id: "reported", label: "Reported", hint: "A human describes the problem" },
  { id: "confirmed", label: "Confirmed", hint: "A second reviewer reproduces it" },
  { id: "ready", label: "Ready", hint: "Open for agent bids" },
  { id: "in_progress", label: "In progress", hint: "A claim is active" },
  { id: "submitted", label: "Submitted", hint: "Work is delivered for proof" },
  { id: "merged", label: "Merged", hint: "Verified and shipped" },
] as const;

const stageOrder = stages.map((stage) => stage.id);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function typeIcon(type: string) {
  if (type === "Security") return "shield" as const;
  if (type === "Accessibility") return "eye" as const;
  if (type === "Feature") return "sparkles" as const;
  return "layers" as const;
}

function CommentRow({ comment }: { comment: IssueComment }) {
  const tone =
    comment.role === "human"
      ? "rose"
      : comment.agentTone === "teal"
        ? "teal"
        : comment.agentTone === "violet"
          ? "violet"
          : "blue";
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-zk-divider last:hidden" />
      <Avatar name={comment.author} tone={tone} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[12.5px] font-bold text-zk-text">{comment.author}</span>
          {comment.role === "agent" ? (
            <Chip tone="info">
              <Icon name="bot" size={10} />
              Agent
            </Chip>
          ) : (
            <Chip tone="muted">Human</Chip>
          )}
          {comment.kind === "decision" ? <Chip tone="ok">Decision</Chip> : null}
          <span className="text-[10.5px] text-zk-muted">{formatDate(comment.at)}</span>
        </div>
        <p className="mt-1.5 whitespace-pre-line rounded-xl rounded-tl-sm border border-zk-border bg-zk-surface px-3 py-2.5 text-[12.5px] leading-5 text-zk-text2">
          {comment.body}
        </p>
      </div>
    </li>
  );
}

export function IssueDetail({ issue }: { issue: Issue }) {
  const toast = useToast();
  const { handshakes, now } = useHandshake();
  const [vote, setVote] = useState({ count: issue.votes, voted: issue.voted });
  const [watching, setWatching] = useState(false);
  const [assignee, setAssignee] = useState(issue.assignee);
  const [draft, setDraft] = useState("");
  const [comments, setComments] = useState<IssueComment[]>(issue.comments);

  const related = useMemo(
    () =>
      handshakes
        .filter((handshake) => handshake.issueId === issue.id)
        .sort((a, b) => {
          const rank = (phase: string) => (phase === "pending" ? 0 : phase === "holding" ? 1 : phase === "revising" ? 2 : 3);
          return rank(a.phase) - rank(b.phase) || b.createdAt - a.createdAt;
        }),
    [handshakes, issue.id],
  );

  const pending = related.filter((handshake) => handshake.phase === "pending").length;
  const stageIndex = Math.max(0, stageOrder.indexOf(issue.stage));
  const severity = severityMeta[issue.severity];
  const status = statusMeta[issue.status];
  const isOwner = assignee === workspace.owner;

  const toggleVote = () => {
    setVote((current) =>
      current.voted
        ? { count: current.count - 1, voted: false }
        : { count: current.count + 1, voted: true },
    );
    toast(vote.voted ? `Vote removed from #${issue.number}` : `Upvoted #${issue.number}`, {
      tone: vote.voted ? "info" : "ok",
    });
  };

  const claim = () => {
    setAssignee(workspace.owner);
    toast(`#${issue.number} is yours — agents can now bid against your claim`, { tone: "ok" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied", { tone: "ok" });
    } catch {
      toast(`/issues/${issue.number}`, { tone: "info" });
    }
  };

  const postComment = () => {
    const body = draft.trim();
    if (!body) return;
    setComments((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        author: workspace.owner,
        role: "human",
        at: new Date().toISOString(),
        body,
      },
    ]);
    setDraft("");
    toast("Comment added to the issue thread", { tone: "ok" });
  };

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11.5px] text-zk-muted">
        <Link href="/issues" className="focus-ring rounded font-semibold hover:text-zk-text">
          Issues
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="font-semibold text-zk-text2">#{issue.number}</span>
      </nav>

      <header className="overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface">
        <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Mono tone="tint">#{issue.number}</Mono>
              <Chip tone="muted">
                <Icon name={typeIcon(issue.type)} size={11} />
                {issue.type}
              </Chip>
              <Chip tone={severity.tone}>{severity.label}</Chip>
              <Chip tone={status.tone} dot>
                {status.label}
              </Chip>
              {pending > 0 ? (
                <Chip tone="accent">
                  <Icon name="handshake" size={11} />
                  {pending} gate{pending === 1 ? "" : "s"} open
                </Chip>
              ) : null}
            </div>
            <h1 className="mt-2 max-w-3xl text-[26px] font-extrabold leading-8 tracking-[-0.03em] text-zk-text sm:text-[30px] sm:leading-9">
              {issue.title}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-zk-muted">
              <span>
                Reported by <span className="font-semibold text-zk-text2">{issue.reporter}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(issue.createdAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Icon name="message" size={10} />
                {comments.length} comments
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleVote}
              aria-pressed={vote.voted}
              className={`focus-ring inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-bold transition-colors ${
                vote.voted
                  ? "border-electric-blue-strong bg-electric-blue-strong text-white"
                  : "border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-tint"
              }`}
            >
              <Icon name="vote" size={14} strokeWidth={2.6} />
              <span className="tabular">{vote.count}</span>
              <span className="hidden sm:inline">{vote.voted ? "voted" : "vote"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setWatching((value) => !value);
                toast(watching ? "Stopped watching this issue" : "Watching — you’ll see every gate", {
                  tone: "info",
                });
              }}
              aria-pressed={watching}
              className={buttonClass("secondary", "md")}
            >
              <Icon name="eye" size={14} />
              {watching ? "Watching" : "Watch"}
            </button>
            <button type="button" onClick={copyLink} aria-label="Copy issue link" className={buttonClass("ghost", "md")}>
              <Icon name="link" size={14} />
              <span className="hidden sm:inline">Copy link</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-zk-divider bg-zk-bg/50 px-4 py-2.5 sm:px-5">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
            Stage
          </span>
          {stages.map((stage, index) => {
            const done = index < stageIndex;
            const current = index === stageIndex;
            return (
              <span key={stage.id} className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                    current
                      ? "bg-electric-blue-strong text-white"
                      : done
                        ? "bg-zk-ok-bg text-zk-ok-fg"
                        : "bg-zk-chip text-zk-muted"
                  }`}
                >
                  {done ? <Icon name="check" size={9} strokeWidth={3} /> : null}
                  {stage.label}
                </span>
                {index < stages.length - 1 ? (
                  <span aria-hidden="true" className={`h-px w-2 sm:w-4 ${done ? "bg-zk-ok-fg/40" : "bg-zk-border"}`} />
                ) : null}
              </span>
            );
          })}
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {related.length > 0 ? (
            <section aria-labelledby="gates-heading" className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="gates-heading" className="flex items-center gap-2 text-base font-bold text-zk-text">
                  <Icon name="handshake" size={16} className="text-zk-accent" />
                  Agent gates on this issue
                </h2>
                <Link href="/handshake" className="text-[11px] font-bold text-zk-accent hover:underline">
                  Open Handshake
                </Link>
              </div>
              {related.map((handshake) => (
                <HandshakeCard key={handshake.id} handshake={handshake} />
              ))}
            </section>
          ) : (
            <section className="flex flex-wrap items-center gap-3 rounded-[20px] border border-zk-border bg-zk-surface px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zk-ok-bg text-zk-ok-fg">
                <Icon name="shield" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-zk-text">No gate is open right now.</p>
                <p className="text-[11px] text-zk-muted">
                  Agents can read and analyse this issue, but any bid, merge, or scope change will
                  arrive here as a handshake before it runs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast("An agent will prepare a plan — it will ask before acting", { tone: "info" })}
                className={buttonClass("secondary", "sm")}
              >
                <Icon name="sparkles" size={12} />
                Request a plan
              </button>
            </section>
          )}

          <section aria-labelledby="problem-heading" className="rounded-[20px] border border-zk-border bg-zk-surface p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 id="problem-heading" className="text-base font-bold text-zk-text">
                Reported problem
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-zk-muted">
                Source of truth
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-zk-text2">{issue.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {issue.labels.map((label) => (
                <Chip key={label} tone="muted">
                  {label}
                </Chip>
              ))}
            </div>
            {issue.pr ? (
              <div className="mt-4 rounded-xl border border-zk-border bg-zk-bg/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-[12px] font-bold text-zk-text">
                    <Icon name="pr" size={14} className="text-zk-accent" />
                    PR #{issue.pr.number} · {issue.pr.title}
                  </p>
                  <Chip tone="ok">
                    <Icon name="check" size={10} strokeWidth={3} />
                    {issue.pr.checks} checks
                  </Chip>
                </div>
                <p className="mt-1 font-mono text-[10.5px] text-zk-muted">
                  +{issue.pr.additions} / −{issue.pr.deletions} · all reviewer agents signed
                </p>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="activity-heading" className="rounded-[20px] border border-zk-border bg-zk-surface p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 id="activity-heading" className="text-base font-bold text-zk-text">
                Activity
              </h2>
              <span className="text-[10.5px] text-zk-muted">{comments.length} entries</span>
            </div>

            <ol className="mt-4">
              {comments.length === 0 ? (
                <li className="rounded-xl border border-dashed border-zk-border px-4 py-8 text-center text-[12px] text-zk-muted">
                  No comments yet. Add the reproduction detail an agent would need.
                </li>
              ) : (
                comments.map((comment) => <CommentRow key={comment.id} comment={comment} />)
              )}
            </ol>

            <div className="mt-1 flex gap-3 border-t border-zk-divider pt-4">
              <Avatar name={workspace.owner} tone="rose" size={32} />
              <div className="min-w-0 flex-1">
                <label htmlFor="issue-comment" className="sr-only">
                  Add a comment
                </label>
                <textarea
                  id="issue-comment"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                  placeholder="Add context, a constraint, or a decision note…"
                  className="w-full resize-none rounded-xl border border-zk-border bg-zk-surface px-3 py-2 text-[12.5px] leading-5 text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] text-zk-muted">
                    Comments are visible to humans and agents. Decisions belong in Handshake.
                  </p>
                  <button
                    type="button"
                    onClick={postComment}
                    disabled={!draft.trim()}
                    className={buttonClass("primary", "sm")}
                  >
                    <Icon name="message" size={12} />
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[84px]">
          <section className="rounded-[20px] border border-zk-border bg-zk-surface p-4">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
              Properties
            </h2>
            <dl className="mt-3 space-y-2.5 text-[12px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Assignee</dt>
                <dd className="flex items-center gap-1.5 font-semibold text-zk-text">
                  {assignee ? (
                    <>
                      <Avatar name={assignee} tone={isOwner ? "blue" : "violet"} size={20} />
                      {isOwner ? "You" : assignee.split(" ")[0]}
                    </>
                  ) : (
                    <span className="text-zk-muted">Unassigned</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Reporter</dt>
                <dd className="font-semibold text-zk-text">{issue.reporter}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Priority</dt>
                <dd>
                  <Chip tone={severity.tone}>{severity.label}</Chip>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Type</dt>
                <dd className="font-semibold text-zk-text">{issue.type}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Points</dt>
                <dd className="tabular font-bold text-zk-text">{issue.points.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zk-muted">Updated</dt>
                <dd className="text-zk-text2">{formatDate(issue.updatedAt)}</dd>
              </div>
            </dl>

            {!isOwner ? (
              <button type="button" onClick={claim} className={buttonClass("primary", "sm", "mt-3 w-full")}>
                <Icon name="user" size={12} />
                Claim for myself
              </button>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-zk-tint/60 px-2.5 py-2 text-[10.5px] font-semibold text-zk-accent">
                <Icon name="check-circle" size={12} />
                You own the current claim.
              </p>
            )}
          </section>

          <section aria-labelledby="lifecycle-heading" className="rounded-[20px] border border-zk-border bg-zk-surface p-4">
            <h2 id="lifecycle-heading" className="text-sm font-bold text-zk-text">
              Lifecycle
            </h2>
            <p className="mt-0.5 text-[10.5px] text-zk-muted">
              A human stays in the loop at every gate.
            </p>
            <ol className="mt-3 space-y-0.5">
              {stages.map((stage, index) => {
                const done = index < stageIndex;
                const current = index === stageIndex;
                return (
                  <li key={stage.id} className="flex gap-2.5">
                    <span className="flex flex-col items-center">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-extrabold ${
                          current
                            ? "border-electric-blue-strong bg-electric-blue-strong text-white"
                            : done
                              ? "border-zk-ok-fg/30 bg-zk-ok-bg text-zk-ok-fg"
                              : "border-zk-border bg-zk-surface text-zk-muted"
                        }`}
                      >
                        {done ? <Icon name="check" size={9} strokeWidth={3} /> : index + 1}
                      </span>
                      {index < stages.length - 1 ? (
                        <span className={`h-4 w-px ${done ? "bg-zk-ok-fg/30" : "bg-zk-border"}`} />
                      ) : null}
                    </span>
                    <span className="pb-1">
                      <span
                        className={`block text-[11.5px] font-bold ${
                          current ? "text-zk-text" : done ? "text-zk-text2" : "text-zk-muted"
                        }`}
                      >
                        {stage.label}
                      </span>
                      <span className="block text-[10px] leading-4 text-zk-muted">{stage.hint}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-[20px] border border-zk-border bg-deep-ocean p-4 text-white">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-sky-tint">
              <Icon name="shield" size={13} />
              Human control
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[#C9D6EF]">
              Agents can read this issue and prepare work. A bid, merge, scope change, or credential
              request always waits for your decision — and expires if you never make one.
            </p>
            <Link
              href="/improvement"
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-sky-tint hover:underline"
            >
              How consent works
              <Icon name="arrow-right" size={11} />
            </Link>
          </section>

          {related.length > 0 ? (
            <p className="px-1 text-[10px] leading-4 text-zk-muted">
              Timers are live. Last checked{" "}
              {new Date(now).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
