"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  clock,
  conditionsFor,
  countdown,
  declineReasons,
  holdSeconds,
  kindMeta,
  notYetReasons,
  riskMeta,
  timeAgo,
  type Handshake,
  type HandshakeKind,
} from "@/lib/handshake";
import { useHandshake } from "@/components/providers";
import { Icon } from "@/components/icons";
import { BlobAgent, KeyDoodle, Star, Tape, WaxSeal, type BlobTone } from "./doodles";

const kindTone: Record<HandshakeKind, { bg: string; fg: string }> = {
  bid: { bg: "var(--w-sky-soft)", fg: "var(--w-ink)" },
  merge: { bg: "var(--w-teal-soft)", fg: "var(--w-ink)" },
  scope_change: { bg: "var(--w-butter-soft)", fg: "var(--w-ink)" },
  credential: { bg: "var(--w-coral-soft)", fg: "var(--w-ink)" },
  test_verdict: { bg: "var(--w-lilac-soft)", fg: "var(--w-ink)" },
};

const agentTone = (name: string): BlobTone => {
  if (name.toLowerCase() === "coddy") return "teal";
  if (name.toLowerCase() === "quill") return "violet";
  if (name.toLowerCase() === "sentinel") return "blue";
  return "butter";
};

function Confetti({ id }: { id: number }) {
  if (!id) return null;
  const colors = ["#ef6b4a", "#f2c14e", "#2a8c7e", "#8ecae6", "#b9a7e6"];
  return (
    <span key={id} className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, index) => {
        const angle = (index / 26) * Math.PI * 2;
        const spread = 70 + (index % 6) * 26;
        const style = {
          "--bit-x": `${Math.cos(angle) * spread}px`,
          "--bit-y": `${Math.sin(angle) * spread - 34}px`,
          "--bit-rotate": `${index * 37}deg`,
          "--bit-color": colors[index % colors.length],
          animationDelay: `${(index % 4) * 18}ms`,
        } as CSSProperties;
        return <span key={index} className="w-confetti-bit" style={style} />;
      })}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="w-sticker px-2.5 py-1.5 text-[11px] transition-colors"
      style={{
        background: active ? "var(--w-butter)" : "var(--w-card)",
        color: "var(--w-ink)",
        boxShadow: active ? "1px 1px 0 var(--w-shadow)" : "2px 2px 0 var(--w-shadow)",
      }}
    >
      {active ? <Icon name="check" size={11} strokeWidth={3} /> : null}
      {children}
    </button>
  );
}

export function WorkshopAsk({ handshake, index }: { handshake: Handshake; index: number }) {
  const { now, approve, undo, decline, requestChanges, nudge } = useHandshake();
  const [panel, setPanel] = useState<"none" | "conditions" | "tweak" | "decline">("none");
  const [conditions, setConditions] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [remember, setRemember] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [details, setDetails] = useState(false);

  const tone = kindTone[handshake.kind];
  const rotation = index % 3 === 0 ? "-0.7deg" : index % 3 === 1 ? "0.5deg" : "-0.3deg";
  const toneName = agentTone(handshake.agentName);
  const hold = handshake.phase === "holding" ? holdSeconds(handshake.holdEndsAt ?? 0, now) : 0;
  const holdTotal =
    handshake.phase === "holding" && handshake.decision
      ? handshake.decision.kind === "auto"
        ? 12
        : 10
      : 10;
  const holdWidth = handshake.phase === "holding" ? Math.max(0, Math.min(100, (hold / holdTotal) * 100)) : 0;
  const isReceipt =
    handshake.phase === "approved" || handshake.phase === "declined" || handshake.phase === "expired";
  const isAuto = handshake.decision?.kind === "auto";
  const declined = handshake.phase === "declined";
  const statusLabel =
    handshake.phase === "pending"
      ? `best before ${countdown(handshake.expiresAt, now)}`
      : handshake.phase === "holding"
        ? "ink drying"
        : handshake.phase === "revising"
          ? "redrawing"
          : handshake.phase === "approved"
            ? isAuto
              ? "granted"
              : "filed"
            : handshake.phase === "declined"
              ? "sent back"
              : "candle out";
  const actionLabel =
    handshake.phase === "declined"
      ? "not dispatched"
      : handshake.phase === "expired"
        ? "never ran"
        : handshake.phase === "holding"
          ? "about to run"
          : isReceipt
            ? isAuto
              ? "grant ran"
              : "ran"
            : "when stamped";

  const toggle = (value: string, list: string[], setList: (next: string[]) => void) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const stamp = (withConditions: string[] = []) => {
    approve(handshake.id, { conditions: withConditions, remember });
    setPanel("none");
    setConfetti(Date.now());
    window.setTimeout(() => setConfetti(0), 1300);
  };

  const payload = handshake.decision
    ? {
        handshake_id: handshake.id,
        issue: `#${handshake.issueNumber}`,
        agent: handshake.agentName,
        decision: handshake.decision.kind,
        conditions: handshake.decision.conditions ?? [],
        reason: handshake.decision.reasons?.length ? handshake.decision.reasons : undefined,
        note: handshake.decision.note ?? undefined,
        grant_id: handshake.decision.grantId ?? undefined,
        dispatch: declined ? null : `${handshake.nextAction.method} ${handshake.nextAction.path}`,
        receipt_id: `rcpt_${handshake.id}`,
        decided_at: new Date(handshake.decision.at).toISOString(),
      }
    : null;

  return (
    <article
      id={`workshop-${handshake.id}`}
      className={`w-card w-card-lift relative scroll-mt-24 p-4 sm:p-5 ${handshake.phase === "holding" ? "ring-4" : ""}`}
      style={{
        rotate: rotation,
        ...(handshake.phase === "holding"
          ? ({ "--tw-ring-color": "color-mix(in srgb, var(--w-teal) 35%, transparent)" } as CSSProperties)
          : {}),
      }}
    >
      <Tape className="-top-2.5 left-7 rotate-[-5deg]" />
      <Confetti id={confetti} />

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="w-sticker px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em]"
            style={{ background: tone.bg, color: tone.fg }}
          >
            {kindMeta[handshake.kind].label}
          </span>
          <span
            className="w-sticker px-2 py-1 text-[10px]"
            style={{ background: "var(--w-card)", color: "var(--w-ink)" }}
          >
            {riskMeta[handshake.risk].label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/issues/${handshake.issueNumber}`}
            className="text-[11px] font-extrabold underline decoration-dotted underline-offset-4"
            style={{ color: "var(--w-ink-soft)" }}
          >
            #{handshake.issueNumber}
          </a>
          <span
            className="w-sticker gap-1 px-2 py-1 text-[10px]"
            style={{ background: "var(--w-butter-soft)", color: "var(--w-ink)" }}
          >
            <Icon name="clock" size={10} strokeWidth={2.4} />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="w-float shrink-0">
          <BlobAgent tone={toneName} size={38} hat={handshake.agentName === "coddy"} />
        </span>
        <span className="text-[11px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
          {handshake.agentName} · {handshake.agentLevel}
        </span>
        <span className="h-px flex-1 border-t-2 border-dotted" style={{ borderColor: "var(--w-line)" }} />
        <span className="text-[10px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
          {handshake.confidence}% sure
        </span>
      </div>

      <h3 className="w-display mt-2 text-[22px] font-bold leading-tight tracking-[-0.02em] sm:text-[25px]">
        {handshake.title}
      </h3>
      <p className="mt-1 text-[12.5px] leading-5" style={{ color: "var(--w-ink-soft)" }}>
        {handshake.summary}
      </p>

      <div
        className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl px-2.5 py-2"
        style={{ background: "var(--w-bg-2)", border: "2px dashed var(--w-line)" }}
      >
        <span className="text-[9px] font-extrabold uppercase tracking-[0.1em]" style={{ color: "var(--w-ink-soft)" }}>
          {actionLabel}
        </span>
        <code
          className="text-[10.5px] font-extrabold"
          style={{
            color: declined ? "var(--w-ink-soft)" : "var(--w-teal)",
            textDecoration: declined ? "line-through" : undefined,
            opacity: declined ? 0.7 : 1,
          }}
        >
          {handshake.nextAction.method} {handshake.nextAction.path}
        </code>
      </div>

      <button
        type="button"
        onClick={() => setDetails((value) => !value)}
        aria-expanded={details}
        className="mt-2.5 flex w-full items-center gap-1.5 text-[11px] font-extrabold"
        style={{ color: "var(--w-teal)" }}
      >
        <Icon name={details ? "chevron-up" : "chevron-down"} size={12} strokeWidth={3} />
        {details ? "Tuck the details away" : "Peek inside the envelope"}
      </button>

      {details ? (
        <div className="mt-2 space-y-3 rounded-xl p-3" style={{ background: "var(--w-bg)", border: "2px solid var(--w-line)" }}>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.1em]" style={{ color: "var(--w-ink-soft)" }}>
              The little plan
            </p>
            <ol className="mt-1 space-y-1">
              {handshake.plan.map((step, stepIndex) => (
                <li key={step} className="flex gap-1.5 text-[11px] leading-4" style={{ color: "var(--w-ink)" }}>
                  <span className="mt-0.5 shrink-0" style={{ color: "var(--w-coral)" }}>
                    <Star width={11} height={11} />
                  </span>
                  <span>
                    <span className="font-extrabold">{stepIndex + 1}.</span> {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.1em]" style={{ color: "var(--w-ink-soft)" }}>
              Why it thinks so
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {handshake.evidence.map((evidence) => (
                <span
                  key={evidence.label}
                  className="w-sticker px-2 py-1 text-[9.5px]"
                  style={{ background: "var(--w-card)", color: "var(--w-ink)" }}
                  title={evidence.detail}
                >
                  {evidence.label}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-lg p-2" style={{ background: "var(--w-butter-soft)" }}>
              <p className="font-extrabold uppercase tracking-wide" style={{ color: "var(--w-ink-soft)" }}>
                touches
              </p>
              <p className="mt-0.5 font-bold">{handshake.blast.files.length} files · {handshake.blast.services.join(", ")}</p>
            </div>
            <div className="rounded-lg p-2" style={{ background: "var(--w-coral-soft)" }}>
              <p className="font-extrabold uppercase tracking-wide" style={{ color: "var(--w-ink-soft)" }}>
                can we undo it?
              </p>
              <p className="mt-0.5 font-bold">{handshake.blast.reversible === "yes" ? "Yes, cheerfully" : handshake.blast.reversible === "partly" ? "Partly, with care" : "No — both hands"}</p>
            </div>
          </div>
          <p className="rounded-lg px-2 py-1.5 text-[10.5px] font-bold" style={{ background: "var(--w-teal-soft)", color: "var(--w-ink)" }}>
            Not included: {handshake.notIncluded}
          </p>
        </div>
      ) : null}

      {handshake.phase === "revising" ? (
        <div className="mt-3 rounded-xl p-3" style={{ background: "var(--w-butter-soft)", border: "2px dashed var(--w-line)" }}>
          <p className="flex items-center gap-2 text-[12px] font-extrabold">
            <BlobAgent tone={toneName} size={24} />
            {handshake.agentName} is sharpening a pencil…
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="typing-dot h-1 w-1 rounded-full" style={{ background: "var(--w-ink)" }} />
              <span className="typing-dot h-1 w-1 rounded-full" style={{ background: "var(--w-ink)", animationDelay: "0.15s" }} />
              <span className="typing-dot h-1 w-1 rounded-full" style={{ background: "var(--w-ink)", animationDelay: "0.3s" }} />
            </span>
          </p>
          <p className="mt-1 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
            The offer clock is paused. Nothing will leave the workshop.
          </p>
        </div>
      ) : null}

      {isReceipt && handshake.decision ? (
        <div className="mt-3">
          <div
            className="relative overflow-hidden rounded-xl p-3"
            style={{
              background: "var(--w-card)",
              border: "2px solid var(--w-ink)",
              boxShadow: "3px 3px 0 var(--w-shadow)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em]" style={{ color: "var(--w-ink-soft)" }}>
                  {declined ? "Sent back" : isAuto ? "The keyring did it" : "Stamped & filed"}
                </p>
                <p className="w-display mt-0.5 text-[18px] font-bold leading-tight">
                  {declined
                    ? "A polite no, with a reason."
                    : isAuto
                      ? "A tiny key turned on its own."
                      : "Ink is dry. It's official."}
                </p>
              </div>
              <span className="w-stamp px-2 py-1 text-[9px]">
                {declined ? "RETURNED" : isAuto ? "GRANTED" : "FILED"}
              </span>
            </div>

            {handshake.decision.conditions?.length ? (
              <p className="mt-2 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
                <span className="font-extrabold">With:</span> {handshake.decision.conditions.join(" · ")}
              </p>
            ) : null}
            {handshake.decision.reasons?.length ? (
              <p className="mt-2 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
                <span className="font-extrabold">Because:</span> {handshake.decision.reasons.join(" · ")}
                {handshake.decision.note ? ` — “${handshake.decision.note}”` : ""}
              </p>
            ) : null}
            {handshake.decision.note && isAuto ? (
              <p className="mt-2 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
                {handshake.decision.note}
              </p>
            ) : null}

            <div className="mt-2 flex items-center justify-between gap-2 pr-12 text-[10px]" style={{ color: "var(--w-ink-soft)" }}>
              <span>
                {isAuto ? "Grant applied" : "You decided"} {timeAgo(handshake.decision.at, now)} · {clock(handshake.decision.at)}
              </span>
              <a href={`/issues/${handshake.issueNumber}`} className="font-extrabold underline decoration-dotted underline-offset-4">
                See the issue
              </a>
            </div>

            {payload ? (
              <details className="mt-2">
                <summary className="cursor-pointer text-[10px] font-extrabold uppercase tracking-[0.08em]" style={{ color: "var(--w-teal)" }}>
                  What the agent gets
                </summary>
                <pre
                  className="w-scrollbar mt-1.5 max-h-44 overflow-auto rounded-lg p-2 text-[9.5px] leading-4"
                  style={{ background: "var(--w-bg-2)", color: "var(--w-ink)" }}
                >
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </details>
            ) : null}

            <WaxSeal className="pointer-events-none absolute -bottom-4 -right-3 h-14 w-14 opacity-90" />
          </div>
          {declined ? (
            <p className="mt-2 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
              The note goes back to {handshake.agentName}. Nothing was dispatched.
            </p>
          ) : null}
        </div>
      ) : null}

      {handshake.phase === "holding" ? (
        <div className="mt-3">
          <div
            className="relative overflow-hidden rounded-xl p-3"
            style={{
              background: "var(--w-teal-soft)",
              border: "2px solid var(--w-ink)",
              boxShadow: "3px 3px 0 var(--w-shadow)",
            }}
          >
            <span className="w-stamp absolute -right-2 -top-1 px-2 py-1 text-[9px] opacity-40">STAMPED</span>
            <p className="flex items-center gap-1.5 text-[12px] font-extrabold">
              <Icon name="undo" size={13} />
              {isAuto ? "The keyring started this one." : "The ink is still drying."}
            </p>
            <p className="mt-0.5 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
              {hold}s left to change your mind. Nothing leaves the workshop until the hourglass empties.
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "var(--w-card)", border: "1px solid var(--w-line)" }}>
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                style={{ width: `${holdWidth}%`, background: "var(--w-teal)" }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
                {isAuto ? "A standing grant matched. High-risk asks never do this." : "Un-stamp is always one tap."}
              </span>
              <button type="button" onClick={() => undo(handshake.id)} className="w-btn w-btn-paper min-h-9 px-3 text-[11px]">
                <Icon name="undo" size={12} />
                Un-stamp
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {handshake.phase === "expired" ? (
        <div className="mt-3 rounded-xl p-3" style={{ background: "var(--w-coral-soft)", border: "2px dashed var(--w-line)" }}>
          <p className="flex items-center gap-1.5 text-[12px] font-extrabold">
            <Icon name="clock" size={13} />
            The candle burned out. Nothing happened.
          </p>
          <p className="mt-0.5 text-[10.5px]" style={{ color: "var(--w-ink-soft)" }}>
            Silence is never a yes. {handshake.agentName} can pop back with fresh context.
          </p>
          <button type="button" onClick={() => nudge(handshake.id)} className="w-btn w-btn-paper mt-2 min-h-9 px-3 text-[11px]">
            <Icon name="refresh" size={12} />
            Ask for a fresh note
          </button>
        </div>
      ) : null}

      {handshake.phase === "pending" ? (
        <div className="mt-3 border-t-2 border-dashed pt-3" style={{ borderColor: "var(--w-line)" }}>
          {panel === "conditions" ? (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold">
                <Star width={12} height={12} />
                Add a little condition
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {conditionsFor[handshake.kind].map((condition) => (
                  <Chip
                    key={condition}
                    active={conditions.includes(condition)}
                    onClick={() => toggle(condition, conditions, setConditions)}
                  >
                    {condition}
                  </Chip>
                ))}
              </div>
              {handshake.risk !== "high" ? (
                <label className="mt-2 flex items-start gap-2 rounded-lg p-2 text-[10.5px]" style={{ background: "var(--w-butter-soft)" }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 accent-[var(--w-teal)]"
                  />
                  <span>
                    <span className="font-extrabold">Remember this for a week.</span> One agent, one kind of ask, one
                    risk ceiling. High-risk asks still come to you.
                  </span>
                </label>
              ) : (
                <p className="mt-2 text-[10px] font-bold" style={{ color: "var(--w-coral)" }}>
                  High-risk asks can never be remembered. Both hands, every time.
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => stamp(conditions)} className="w-btn w-btn-coral text-[11px]">
                  <Icon name="check" size={13} strokeWidth={3} />
                  Stamp it
                </button>
                <button type="button" onClick={() => setPanel("none")} className="w-btn w-btn-ghost text-[11px]">
                  Never mind
                </button>
              </div>
            </div>
          ) : panel === "tweak" ? (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold">
                <Icon name="message" size={12} />
                What needs another look?
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {notYetReasons.map((reason) => (
                  <Chip key={reason} active={reasons.includes(reason)} onClick={() => toggle(reason, reasons, setReasons)}>
                    {reason}
                  </Chip>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder={`A little note for ${handshake.agentName}…`}
                className="mt-2 w-full rounded-lg p-2 text-[11px] outline-none"
                style={{ background: "var(--w-card)", border: "2px solid var(--w-line)", color: "var(--w-ink)" }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={reasons.length === 0}
                  onClick={() => {
                    requestChanges(handshake.id, reasons, note);
                    setPanel("none");
                  }}
                  className="w-btn w-btn-butter text-[11px]"
                >
                  <Icon name="refresh" size={12} />
                  Send it back to {handshake.agentName}
                </button>
                <button type="button" onClick={() => setPanel("none")} className="w-btn w-btn-ghost text-[11px]">
                  Never mind
                </button>
              </div>
            </div>
          ) : panel === "decline" ? (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold">
                <Icon name="x" size={12} />
                Why send it back?
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {declineReasons.map((reason) => (
                  <Chip key={reason} active={reasons.includes(reason)} onClick={() => toggle(reason, reasons, setReasons)}>
                    {reason}
                  </Chip>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder="Anything else they should know?"
                className="mt-2 w-full rounded-lg p-2 text-[11px] outline-none"
                style={{ background: "var(--w-card)", border: "2px solid var(--w-line)", color: "var(--w-ink)" }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={reasons.length === 0}
                  onClick={() => {
                    decline(handshake.id, reasons, note);
                    setPanel("none");
                  }}
                  className="w-btn w-btn-coral text-[11px]"
                >
                  <Icon name="x" size={12} strokeWidth={3} />
                  Send it back
                </button>
                <button type="button" onClick={() => setPanel("none")} className="w-btn w-btn-ghost text-[11px]">
                  Never mind
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em]" style={{ color: "var(--w-ink-soft)" }}>
                Your call
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => stamp([])} className="w-btn w-btn-coral text-[12px]">
                  <Icon name="check" size={15} strokeWidth={3} />
                  Stamp it
                </button>
                <button type="button" onClick={() => setPanel("tweak")} className="w-btn w-btn-butter text-[12px]">
                  <Icon name="message" size={13} />
                  Ask for a tweak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReasons([]);
                    setPanel("decline");
                  }}
                  className="w-btn w-btn-ghost text-[12px]"
                >
                  Send it back
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPanel("conditions")}
                  className="inline-flex items-center gap-1 text-[10.5px] font-extrabold underline decoration-dotted underline-offset-4"
                  style={{ color: "var(--w-teal)" }}
                >
                  <KeyDoodle className="h-3 w-6" />
                  Add a condition or remember this
                </button>
                <span className="text-[9.5px]" style={{ color: "var(--w-ink-soft)" }}>
                  Ten seconds to un-stamp.
                </span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
