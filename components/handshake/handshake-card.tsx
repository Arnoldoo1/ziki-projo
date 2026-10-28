"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  conditionsFor,
  countdown,
  declineReasons,
  holdSeconds,
  kindMeta,
  notYetReasons,
  riskMeta,
  timeAgo,
  clock,
  type Handshake,
  type HandshakeKind,
} from "@/lib/handshake";
import { useHandshake } from "@/components/providers";
import { Icon, type IconName } from "@/components/icons";
import { Avatar, Chip, Mono, buttonClass, type Tone } from "@/components/ui";

const kindTone: Record<HandshakeKind, Tone> = {
  bid: "info",
  merge: "ok",
  scope_change: "warn",
  credential: "bad",
  test_verdict: "ok",
};

const kindIcon: Record<HandshakeKind, IconName> = {
  bid: "zap",
  merge: "merge",
  scope_change: "scale",
  credential: "key",
  test_verdict: "test",
};

export function KindBadge({ handshake }: { handshake: Handshake }) {
  const meta = kindMeta[handshake.kind];
  return (
    <Chip tone={kindTone[handshake.kind]}>
      <Icon name={kindIcon[handshake.kind]} size={12} strokeWidth={2.2} />
      {meta.label}
    </Chip>
  );
}

export function RiskChip({ risk }: { risk: Handshake["risk"] }) {
  const tone: Tone = risk === "high" ? "bad" : risk === "medium" ? "warn" : "muted";
  return (
    <Chip tone={tone}>
      <Icon name="shield" size={11} strokeWidth={2.2} />
      {riskMeta[risk].label}
    </Chip>
  );
}

function Countdown({
  expiresAt,
  now,
  phase,
}: {
  expiresAt: number;
  now: number;
  phase: Handshake["phase"];
}) {
  if (phase !== "pending") return null;
  const ms = Math.max(0, expiresAt - now);
  const urgent = ms < 2 * 60_000;
  const soon = ms < 5 * 60_000;
  const label = countdown(expiresAt, now);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        urgent
          ? "bg-zk-bad-bg text-zk-bad-fg"
          : soon
            ? "bg-zk-warn-bg text-zk-warn-fg"
            : "bg-zk-chip text-zk-text2"
      }`}
      aria-label={`Offer expires in ${label}`}
    >
      <Icon name="clock" size={12} strokeWidth={2.2} className={urgent ? "pulse-dot rounded-full" : ""} />
      <span className="tabular">{label}</span>
    </span>
  );
}

function DetailPanel({ handshake }: { handshake: Handshake }) {
  return (
    <div className="animate-fade grid gap-4 rounded-xl border border-zk-border bg-zk-bg/60 p-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">Plan</p>
        <ol className="mt-2 space-y-1.5">
          {handshake.plan.map((step, index) => (
            <li key={step} className="flex gap-2.5 text-[12.5px] leading-5 text-zk-text2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zk-tint text-[9px] font-extrabold text-zk-accent">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
          Evidence
        </p>
        <ul className="mt-2 space-y-2">
          {handshake.evidence.map((item) => (
            <li key={item.label} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zk-chip text-zk-text2">
                <Icon
                  name={
                    item.kind === "pr"
                      ? "pr"
                      : item.kind === "test"
                        ? "test"
                        : item.kind === "log"
                          ? "terminal"
                          : item.kind === "doc"
                            ? "file"
                            : "issues"
                  }
                  size={11}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold leading-4 text-zk-text">
                  {item.label}
                </span>
                <span className="block text-[11px] leading-4 text-zk-muted">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
          If it goes wrong
        </p>
        <dl className="mt-2 space-y-1.5 text-[11.5px]">
          <div className="flex justify-between gap-2">
            <dt className="text-zk-muted">Files</dt>
            <dd className="text-right font-semibold text-zk-text">
              {handshake.blast.files.length === 0 ? "None" : handshake.blast.files.length}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-zk-muted">Services</dt>
            <dd className="text-right font-semibold text-zk-text">
              {handshake.blast.services.join(", ")}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-zk-muted">Points at stake</dt>
            <dd className="tabular text-right font-semibold text-zk-text">
              {handshake.blast.points.toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-zk-muted">Reversible</dt>
            <dd
              className={`text-right font-bold ${
                handshake.blast.reversible === "yes"
                  ? "text-zk-ok-fg"
                  : handshake.blast.reversible === "partly"
                    ? "text-zk-warn-fg"
                    : "text-zk-bad-fg"
              }`}
            >
              {handshake.blast.reversible === "yes"
                ? "Yes, cleanly"
                : handshake.blast.reversible === "partly"
                  ? "Partly"
                  : "No"}
            </dd>
          </div>
        </dl>
        <div className="mt-3 border-t border-zk-divider pt-2">
          <p className="flex gap-1.5 text-[11px] leading-4 text-zk-muted">
            <Icon name="lock" size={11} className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold text-zk-text2">Not included:</span>{" "}
              {handshake.notIncluded}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ConditionPicker({ handshake }: { handshake: Handshake }) {
  const { approve } = useHandshake();
  const [selected, setSelected] = useState<string[]>([]);
  const [remember, setRemember] = useState(false);
  const groupId = useId();
  const options = conditionsFor[handshake.kind];
  const canRemember = handshake.risk !== "high";

  const toggle = (value: string) =>
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  return (
    <div className="animate-fade rounded-xl border border-zk-border bg-zk-bg/70 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
        Attach conditions
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">
          Conditions for this approval
        </span>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option)}
              className={`focus-ring inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "border-electric-blue-strong bg-zk-tint text-zk-accent"
                  : "border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-chip"
              }`}
            >
              {active ? <Icon name="check" size={11} strokeWidth={2.5} /> : null}
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-zk-divider pt-2.5">
        {canRemember ? (
          <label className="flex cursor-pointer items-start gap-2 text-[11.5px] leading-4 text-zk-text2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-zk-border accent-[#2e6fef]"
            />
            <span>
              <span className="font-bold text-zk-text">
                Remember this for {handshake.agentName}
              </span>
              <span className="block text-[10.5px] text-zk-muted">
                {riskMeta[handshake.risk].label} {kindMeta[handshake.kind].short.toLowerCase()}{" "}
                asks start automatically for 7 days. Revoke any time in Trust. High-risk actions
                still come back to you.
              </span>
            </span>
          </label>
        ) : (
          <p className="flex items-center gap-1.5 text-[10.5px] font-medium text-zk-muted">
            <Icon name="lock" size={11} />
            High-risk actions always come back to you. Standing grants cannot cover them.
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => approve(handshake.id, { conditions: selected, remember })}
          className={buttonClass("primary", "sm")}
        >
          <Icon name="check" size={13} strokeWidth={2.5} />
          Approve with {selected.length > 0 ? `${selected.length} condition${selected.length > 1 ? "s" : ""}` : "terms"}
        </button>
        <span className="text-[10px] text-zk-muted">Still reversible for 10 seconds.</span>
      </div>
    </div>
  );
}

function NotYetPanel({ handshake }: { handshake: Handshake }) {
  const { requestChanges } = useHandshake();
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const id = useId();

  const submit = () => {
    if (reasons.length === 0 && note.trim().length === 0) return;
    requestChanges(handshake.id, reasons, note.trim() || undefined);
  };

  return (
    <div className="animate-fade rounded-xl border border-zk-border bg-zk-bg/70 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
        What would make this a yes?
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {notYetReasons.map((reason) => {
          const active = reasons.includes(reason);
          return (
            <button
              key={reason}
              type="button"
              aria-pressed={active}
              onClick={() =>
                setReasons((prev) =>
                  prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
                )
              }
              className={`focus-ring inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "border-electric-blue-strong bg-zk-tint text-zk-accent"
                  : "border-zk-border bg-zk-surface text-zk-text2 hover:bg-zk-chip"
              }`}
            >
              {active ? <Icon name="check" size={11} strokeWidth={2.5} /> : null}
              {reason}
            </button>
          );
        })}
      </div>
      <label htmlFor={`${id}-note`} className="sr-only">
        Note to the agent
      </label>
      <textarea
        id={`${id}-note`}
        rows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional: tell the agent what to prove or change."
        className="mt-2 w-full resize-none rounded-lg border border-zk-border bg-zk-surface px-2.5 py-2 text-[12px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={reasons.length === 0 && note.trim().length === 0}
          className={buttonClass("primary", "sm")}
        >
          Send to agent
        </button>
        <span className="text-[10px] text-zk-muted">
          The offer clock pauses while the agent revises.
        </span>
      </div>
    </div>
  );
}

function DeclinePanel({ handshake }: { handshake: Handshake }) {
  const { decline } = useHandshake();
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const id = useId();

  return (
    <div className="animate-fade rounded-xl border border-zk-bad-bd bg-zk-bad-bg/40 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-bad-fg">
        Decline · nothing will run
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {declineReasons.map((reason) => {
          const active = reasons.includes(reason);
          return (
            <button
              key={reason}
              type="button"
              aria-pressed={active}
              onClick={() => setReasons([reason])}
              className={`focus-ring inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "border-zk-bad-fg bg-zk-bad-fg text-white"
                  : "border-zk-bad-bd bg-zk-surface text-zk-bad-fg hover:bg-zk-bad-bg"
              }`}
            >
              {reason}
            </button>
          );
        })}
      </div>
      <label htmlFor={`${id}-note`} className="sr-only">
        Note to the agent
      </label>
      <textarea
        id={`${id}-note`}
        rows={2}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional: what should the agent do instead?"
        className="mt-2 w-full resize-none rounded-lg border border-zk-border bg-zk-surface px-2.5 py-2 text-[12px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={reasons.length === 0}
          onClick={() => decline(handshake.id, reasons, note.trim() || undefined)}
          className={buttonClass("danger", "sm")}
        >
          Decline &amp; tell {handshake.agentName}
        </button>
        <span className="text-[10px] text-zk-muted">Reason is shared with the agent.</span>
      </div>
    </div>
  );
}

function DecisionBar({ handshake }: { handshake: Handshake }) {
  const [panel, setPanel] = useState<"none" | "conditions" | "notyet" | "decline">("none");
  const { approve } = useHandshake();
  const panelId = useId();

  if (panel === "conditions")
    return (
      <div id={panelId}>
        <ConditionPicker handshake={handshake} />
        <button
          type="button"
          onClick={() => setPanel("none")}
          className="mt-1.5 text-[10.5px] font-semibold text-zk-muted hover:text-zk-text"
        >
          Cancel conditions
        </button>
      </div>
    );
  if (panel === "notyet")
    return (
      <div id={panelId}>
        <NotYetPanel handshake={handshake} />
        <button
          type="button"
          onClick={() => setPanel("none")}
          className="mt-1.5 text-[10.5px] font-semibold text-zk-muted hover:text-zk-text"
        >
          Back to decision
        </button>
      </div>
    );
  if (panel === "decline")
    return (
      <div id={panelId}>
        <DeclinePanel handshake={handshake} />
        <button
          type="button"
          onClick={() => setPanel("none")}
          className="mt-1.5 text-[10.5px] font-semibold text-zk-muted hover:text-zk-text"
        >
          Back to decision
        </button>
      </div>
    );

  return (
    <div id={panelId}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => approve(handshake.id)}
          className={buttonClass("primary")}
          aria-keyshortcuts="a"
          title="Approve (A)"
        >
          <Icon name="check" size={15} strokeWidth={2.6} />
          Approve
        </button>
        <button
          type="button"
          onClick={() => setPanel("notyet")}
          className={buttonClass("secondary")}
          aria-keyshortcuts="n"
          title="Not yet (N)"
        >
          <Icon name="message" size={14} />
          Not yet
        </button>
        <button
          type="button"
          onClick={() => setPanel("decline")}
          className={buttonClass("ghost", "md", "text-zk-muted hover:text-zk-bad-fg")}
          aria-keyshortcuts="d"
          title="Decline (D)"
        >
          Decline
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setPanel("conditions")}
          className="focus-ring inline-flex items-center gap-1 rounded text-[10.5px] font-semibold text-zk-accent hover:underline"
        >
          <Icon name="settings" size={11} />
          Add conditions{handshake.risk !== "high" ? " or remember this" : ""}
        </button>
        <span className="text-[10px] text-zk-muted">
          Nothing is sent for {Math.round(10)}s. Undo is always one tap.
        </span>
      </div>
    </div>
  );
}

function HoldingBar({ handshake, now }: { handshake: Handshake; now: number }) {
  const { undo } = useHandshake();
  const auto = handshake.decision?.kind === "auto";
  const total = auto ? 12_000 : 10_000;
  const left = handshake.holdEndsAt ? Math.max(0, handshake.holdEndsAt - now) : 0;
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  const seconds = holdSeconds(handshake.holdEndsAt ?? now, now);

  return (
    <div
      className={`rounded-xl border p-3 ${
        auto ? "border-electric-blue/30 bg-zk-tint/70" : "border-zk-ok-fg/25 bg-zk-ok-bg/60"
      }`}
      role="status"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[12px] font-bold text-zk-text">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-blue-strong" />
          </span>
          {auto ? "Your standing grant is starting this" : "Approval held at the gate"}
          <span className="tabular text-zk-accent">{seconds}s</span>
        </p>
        <button type="button" onClick={() => undo(handshake.id)} className={buttonClass("secondary", "sm")}>
          <Icon name="undo" size={13} />
          Undo
        </button>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-zk-chip"
        role="progressbar"
        aria-label="Time until the agent starts"
        aria-valuemin={0}
        aria-valuemax={total / 1000}
        aria-valuenow={Math.ceil(left / 1000)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            auto ? "bg-electric-blue-strong" : "bg-zk-ok-fg"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10.5px] text-zk-muted">
        {handshake.nextAction.method} {handshake.nextAction.path} dispatches when this reaches
        zero. Undo stops it before anything leaves Ziki.
      </p>
    </div>
  );
}

function Receipt({ handshake, now }: { handshake: Handshake; now: number }) {
  const { nudge } = useHandshake();
  const [payloadOpen, setPayloadOpen] = useState(false);
  const decision = handshake.decision;
  if (!decision) return null;

  if (handshake.phase === "expired") {
    return (
      <div className="rounded-xl border border-zk-warn-bd bg-zk-warn-bg/50 p-3">
        <p className="flex items-center gap-2 text-[12px] font-bold text-zk-warn-fg">
          <Icon name="clock" size={14} />
          Offer expired · no action taken
        </p>
        <p className="mt-1 text-[11px] leading-4 text-zk-text2">
          Silence is never consent. {handshake.agentName} has to come back with fresh context.
        </p>
        <button
          type="button"
          onClick={() => nudge(handshake.id)}
          className={buttonClass("secondary", "sm", "mt-2")}
        >
          <Icon name="refresh" size={12} />
          Ask {handshake.agentName} to re-check
        </button>
      </div>
    );
  }

  const declined = decision.kind === "declined";
  const auto = decision.kind === "auto";
  const payload = {
    handshake_id: handshake.id,
    issue: `#${handshake.issueNumber}`,
    agent: handshake.agentName,
    decision: decision.kind,
    conditions: decision.conditions ?? [],
    reason: decision.reasons?.length ? decision.reasons : undefined,
    note: decision.note ?? undefined,
    grant_id: decision.grantId ?? undefined,
    dispatch: declined ? null : `${handshake.nextAction.method} ${handshake.nextAction.path}`,
    receipt_id: `rcpt_${handshake.id}`,
    decided_at: new Date(decision.at).toISOString(),
  };
  return (
    <div
      className={`rounded-xl border p-3 ${
        declined ? "border-zk-bad-bd bg-zk-bad-bg/40" : "border-zk-ok-fg/25 bg-zk-ok-bg/45"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className={`flex items-center gap-2 text-[12px] font-bold ${
            declined ? "text-zk-bad-fg" : "text-zk-ok-fg"
          }`}
        >
          <Icon name={declined ? "x" : auto ? "shield" : "check-circle"} size={14} />
          {declined
            ? "Declined by you"
            : auto
              ? "Auto-approved by your standing grant"
              : "Approved by you"}
          <span className="font-medium text-zk-muted">· {clock(decision.at)}</span>
        </p>
        <button
          type="button"
          onClick={() => setPayloadOpen((v) => !v)}
          aria-expanded={payloadOpen}
          className="focus-ring inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-zk-muted transition-colors hover:bg-zk-surface hover:text-zk-text"
        >
          <Icon name="file" size={10} />
          Agent payload
        </button>
      </div>

      {decision.conditions?.length ? (
        <p className="mt-1.5 text-[11px] text-zk-text2">
          <span className="font-semibold">Conditions:</span> {decision.conditions.join(" · ")}
        </p>
      ) : null}
      {decision.reasons?.length ? (
        <p className="mt-1.5 text-[11px] text-zk-text2">
          <span className="font-semibold">Reason:</span> {decision.reasons.join(" · ")}
          {decision.note ? ` — “${decision.note}”` : ""}
        </p>
      ) : null}
      {decision.note && auto ? (
        <p className="mt-1.5 text-[11px] text-zk-text2">{decision.note}</p>
      ) : null}

      <div className="mt-2 rounded-lg bg-zk-surface/80 p-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
          {declined ? "Agent response" : "Agent reported back"}
        </p>
        <p className="mt-1 font-mono text-[10.5px] leading-4 text-zk-text2">
          {declined
            ? `${handshake.agentName} withdrew the request · no API call made`
            : `${handshake.nextAction.method} ${handshake.nextAction.path} → ${handshake.successResponse}`}
        </p>
      </div>

      {payloadOpen ? (
        <div className="mt-2 rounded-lg border border-zk-border bg-zk-bg/70 p-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
              What the agent receives
            </p>
            <span className="text-[9px] text-zk-muted">structured · idempotent</span>
          </div>
          <pre className="mt-1.5 max-h-52 overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-4 text-zk-text2">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zk-muted">
        <span>
          {auto ? "Grant applied" : "You decided"} {timeAgo(decision.at, now)} · audit trail kept
        </span>
        <Link
          href={`/issues/${handshake.issueNumber}`}
          className="font-bold text-zk-accent hover:underline"
        >
          View #{handshake.issueNumber}
        </Link>
      </div>
    </div>
  );
}

export function HandshakeCard({
  handshake,
  compact = false,
}: {
  handshake: Handshake;
  compact?: boolean;
}) {
  const { now } = useHandshake();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isReceipt = handshake.phase !== "pending" && handshake.phase !== "holding" && handshake.phase !== "revising";

  return (
    <article
      id={handshake.id}
      aria-labelledby={`${handshake.id}-title`}
      className={`scroll-mt-24 overflow-hidden rounded-[20px] border bg-zk-surface transition-shadow ${
        handshake.phase === "pending"
          ? "border-zk-border shadow-[0_1px_2px_rgba(11,23,51,0.04)] hover:shadow-[0_10px_30px_rgba(11,23,51,0.07)]"
          : "border-zk-border/80"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zk-divider px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <KindBadge handshake={handshake} />
          <RiskChip risk={handshake.risk} />
          <span className="hidden h-3 w-px bg-zk-border sm:block" />
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-zk-text2">
            <Avatar name={handshake.agentName} tone={handshake.agentName === "coddy" ? "teal" : "blue"} size={18} />
            <span className="truncate">{handshake.agentName}</span>
            <span className="hidden text-zk-muted sm:inline">· {handshake.agentLevel}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/issues/${handshake.issueNumber}`}
            className="focus-ring rounded text-[11px] font-bold text-zk-accent hover:underline"
          >
            #{handshake.issueNumber}
          </Link>
          <Countdown expiresAt={handshake.expiresAt} now={now} phase={handshake.phase} />
        </div>
      </div>

      <div className="p-4">
        <h3
          id={`${handshake.id}-title`}
          className="text-[17px] font-extrabold leading-snug tracking-[-0.01em] text-zk-text"
        >
          {handshake.title}
        </h3>
        <p className="mt-1 text-[12.5px] leading-5 text-zk-text2">{handshake.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-zk-border bg-zk-bg/60 px-2.5 py-2">
          <span className="text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
            Next action
          </span>
          <Mono tone="light">
            <span className="text-zk-ok-fg">{handshake.nextAction.method}</span>
            <span className="truncate">{handshake.nextAction.path}</span>
          </Mono>
          <span className="text-[10.5px] text-zk-muted">
            {handshake.phase === "approved" ? handshake.successResponse : "only after you say yes"}
          </span>
        </div>

        <button
          type="button"
          aria-expanded={detailsOpen}
          aria-controls={`${handshake.id}-details`}
          onClick={() => setDetailsOpen((v) => !v)}
          className="focus-ring mt-3 flex w-full items-center justify-between gap-2 rounded-lg px-0.5 py-1 text-left text-[11px] font-bold text-zk-accent hover:text-zk-text"
        >
          <span className="flex items-center gap-1.5">
            <Icon name={detailsOpen ? "chevron-up" : "chevron-down"} size={13} strokeWidth={2.4} />
            {detailsOpen ? "Hide the plan" : "Plan, evidence & impact"}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-zk-muted">
            confidence
            <span className="tabular font-bold text-zk-text2">{handshake.confidence}%</span>
            <span className="h-1.5 w-14 overflow-hidden rounded-full bg-zk-chip" aria-hidden="true">
              <span
                className={`block h-full rounded-full ${
                  handshake.confidence >= 85
                    ? "bg-zk-ok-fg"
                    : handshake.confidence >= 70
                      ? "bg-zk-warn-fg"
                      : "bg-zk-bad-fg"
                }`}
                style={{ width: `${handshake.confidence}%` }}
              />
            </span>
          </span>
        </button>
        {detailsOpen ? (
          <div id={`${handshake.id}-details`} className="mt-2">
            <DetailPanel handshake={handshake} />
          </div>
        ) : null}

        {handshake.rounds ? (
          <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-zk-tint/60 px-2 py-1.5 text-[10.5px] font-medium text-zk-accent">
            <Icon name="refresh" size={11} />
            Revised after your feedback · round {handshake.rounds}
          </p>
        ) : null}

        {handshake.phase === "revising" ? (
          <div className="mt-3 rounded-xl border border-zk-border bg-zk-bg/60 p-3">
            <p className="flex items-center gap-2 text-[12px] font-semibold text-zk-text2">
              <Avatar name={handshake.agentName} tone={handshake.agentName === "coddy" ? "teal" : "blue"} size={18} />
              {handshake.agentName} is revising
              <span className="flex gap-0.5" aria-hidden="true">
                <span className="typing-dot h-1 w-1 rounded-full bg-zk-muted" />
                <span className="typing-dot h-1 w-1 rounded-full bg-zk-muted" style={{ animationDelay: "0.15s" }} />
                <span className="typing-dot h-1 w-1 rounded-full bg-zk-muted" style={{ animationDelay: "0.3s" }} />
              </span>
            </p>
            <p className="mt-1 text-[10.5px] text-zk-muted">
              Offer clock paused · nothing will be dispatched.
            </p>
          </div>
        ) : null}

        {isReceipt ? (
          <div className="mt-3">
            <Receipt handshake={handshake} now={now} />
          </div>
        ) : handshake.phase === "holding" ? (
          <div className="mt-3">
            <HoldingBar handshake={handshake} now={now} />
          </div>
        ) : handshake.phase === "pending" && !compact ? (
          <div className="mt-3 border-t border-zk-divider pt-3" data-tour="choices">
            <div className="mb-2.5 rounded-xl bg-zk-tint/50 px-3 py-2">
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.09em] text-zk-accent">
                Your call
              </p>
              <p className="mt-0.5 text-[12.5px] font-medium text-zk-text">{handshake.ask}</p>
            </div>
            <DecisionBar handshake={handshake} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
