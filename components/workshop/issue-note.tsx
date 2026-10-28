"use client";

import { useEffect } from "react";
import { Icon } from "@/components/icons";
import { severityMeta, statusMeta, type Issue } from "@/lib/mock";
import { BlobAgent, Star, Tape } from "./doodles";

const statusWhimsy: Record<Issue["status"], string> = {
  open: "a fresh note",
  in_progress: "on the bench",
  submitted: "ready for a look",
  ready_to_merge: "almost filed",
  merged: "filed away",
};

const severityTone: Record<Issue["severity"], string> = {
  critical: "var(--w-coral)",
  high: "var(--w-coral-soft)",
  medium: "var(--w-butter-soft)",
  low: "var(--w-teal-soft)",
};

export function IssueNote({
  issue,
  index,
  votes,
  onVote,
  onOpen,
}: {
  issue: Issue;
  index: number;
  votes: { count: number; voted: boolean };
  onVote: () => void;
  onOpen: () => void;
}) {
  const rotation = index % 3 === 0 ? "0.6deg" : index % 3 === 1 ? "-0.5deg" : "0.3deg";
  const agentName = issue.assignee ?? "unclaimed";

  return (
    <article
      className="w-card w-card-lift relative flex h-full flex-col p-4"
      style={{ rotate: rotation }}
    >
      <Tape className="-top-2 right-6 rotate-[4deg]" />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open issue #${issue.number}: ${issue.title}`}
        className="absolute inset-0 z-20 rounded-[inherit]"
      />
      <div className="relative z-10 flex flex-wrap items-center gap-1.5">
        <span
          className="w-sticker px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em]"
          style={{ background: severityTone[issue.severity], color: "var(--w-ink)" }}
        >
          {severityMeta[issue.severity].label}
        </span>
        <span
          className="w-sticker px-2 py-1 text-[9px] font-extrabold"
          style={{ background: "var(--w-card)", color: "var(--w-ink-soft)" }}
        >
          {statusWhimsy[issue.status]}
        </span>
        <span className="ml-auto text-[10px] font-extrabold" style={{ color: "var(--w-ink-soft)" }}>
          #{issue.number}
        </span>
      </div>

      <h3 className="w-display relative z-10 mt-2 text-[19px] font-bold leading-tight tracking-[-0.02em]">
        {issue.title}
      </h3>
      <p className="relative z-10 mt-1 line-clamp-3 text-[11px] leading-5" style={{ color: "var(--w-ink-soft)" }}>
        {issue.description}
      </p>

      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5">
        {issue.labels.slice(0, 2).map((label) => (
          <span
            key={label}
            className="rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: "var(--w-bg-2)", color: "var(--w-ink-soft)" }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="relative z-30 mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
          <BlobAgent tone={agentName === "coddy" ? "teal" : "blue"} size={20} />
          {agentName}
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[10px] font-extrabold" style={{ color: "var(--w-ink-soft)" }}>
            <Star width={11} height={11} />
            {issue.points} pts
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onVote();
            }}
            aria-pressed={votes.voted}
            aria-label={`${votes.voted ? "Remove cheer from" : "Cheer"} #${issue.number}`}
            className="w-sticker relative z-30 gap-1 px-2 py-1 text-[10px]"
            style={{
              background: votes.voted ? "var(--w-butter)" : "var(--w-card)",
              color: "var(--w-ink)",
            }}
          >
            <Icon name="vote" size={10} strokeWidth={2.8} />
            {votes.count}
          </button>
        </div>
      </div>
    </article>
  );
}

export function IssueDrawer({
  issue,
  votes,
  onVote,
  onClose,
}: {
  issue: Issue;
  votes: { count: number; voted: boolean };
  onVote: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-3 sm:items-center sm:p-6" role="presentation">
      <button
        type="button"
        aria-label="Close issue note"
        onClick={onClose}
        className="absolute inset-0 bg-[#2b2118]/35 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="workshop-issue-title"
        className="w-card relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-6"
        style={{ background: "var(--w-card)", color: "var(--w-ink)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="w-sticker px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em]"
                style={{ background: severityTone[issue.severity], color: "var(--w-ink)" }}
              >
                {severityMeta[issue.severity].label}
              </span>
              <span className="w-sticker px-2 py-1 text-[9px] font-extrabold" style={{ background: "var(--w-bg-2)" }}>
                {statusMeta[issue.status].label}
              </span>
              <span className="text-[10px] font-extrabold" style={{ color: "var(--w-ink-soft)" }}>
                #{issue.number}
              </span>
            </div>
            <h2 id="workshop-issue-title" className="w-display mt-2 text-[26px] font-bold leading-tight tracking-[-0.02em]">
              {issue.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="w-btn w-btn-paper min-h-9 w-9 shrink-0 px-0 text-[18px] font-black leading-none"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-[12px] leading-6" style={{ color: "var(--w-ink-soft)" }}>
          {issue.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onVote}
            aria-pressed={votes.voted}
            className="w-btn w-btn-butter text-[11px]"
          >
            <Icon name="vote" size={12} strokeWidth={2.8} />
            {votes.voted ? "Cheered" : "Cheer this note"} · {votes.count}
          </button>
          <span className="text-[10px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
            {issue.points} points · {issue.reporter}
          </span>
        </div>

        <div className="mt-4 border-t-2 border-dashed pt-3" style={{ borderColor: "var(--w-line)" }}>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.12em]" style={{ color: "var(--w-ink-soft)" }}>
            Notes in the margin
          </p>
          <div className="mt-2 space-y-2">
            {issue.comments.length === 0 ? (
              <p className="text-[11px]" style={{ color: "var(--w-ink-soft)" }}>
                No notes yet. A quiet little issue.
              </p>
            ) : (
              issue.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl p-2.5" style={{ background: "var(--w-bg)" }}>
                  <p className="flex items-center gap-1.5 text-[10px] font-extrabold">
                    <BlobAgent
                      tone={comment.agentTone ?? "blue"}
                      size={18}
                    />
                    {comment.author}
                    <span className="font-semibold" style={{ color: "var(--w-ink-soft)" }}>
                      · {comment.role === "agent" ? "agent" : "human"}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] leading-5">{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <a
            href={`/issues/${issue.number}`}
            className="text-[11px] font-extrabold underline decoration-dotted underline-offset-4"
            style={{ color: "var(--w-teal)" }}
          >
            Open the full workshop file
          </a>
          <button type="button" onClick={onClose} className="w-btn w-btn-coral text-[11px]">
            Back to the shelf
          </button>
        </div>
      </div>
    </div>
  );
}
