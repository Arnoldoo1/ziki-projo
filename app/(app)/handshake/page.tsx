"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHandshake } from "@/components/providers";
import { HandshakeCard } from "@/components/handshake/handshake-card";
import { TrustDrawer } from "@/components/handshake/trust-drawer";
import { Tour, type TourStep } from "@/components/handshake/tour";
import { Icon } from "@/components/icons";
import { Chip, EmptyState, buttonClass } from "@/components/ui";
import {
  clock,
  kindMeta,
  riskMeta,
  timeAgo,
  type Handshake,
  type HandshakeKind,
} from "@/lib/handshake";

type Tab = "needs" | "motion" | "receipts";

const tabs: { id: Tab; label: string }[] = [
  { id: "needs", label: "Needs you" },
  { id: "motion", label: "In motion" },
  { id: "receipts", label: "Receipts" },
];

const kindOrder: HandshakeKind[] = ["bid", "merge", "scope_change", "credential", "test_verdict"];

function phaseTab(phase: Handshake["phase"]): Tab {
  if (phase === "pending" || phase === "holding") return "needs";
  if (phase === "revising") return "motion";
  return "receipts";
}

function SummaryStat({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  tone: "blue" | "green" | "amber" | "slate";
  icon: "clock" | "check-circle" | "shield" | "alert" | "refresh";
}) {
  const tones = {
    blue: "bg-zk-tint text-zk-accent",
    green: "bg-zk-ok-bg text-zk-ok-fg",
    amber: "bg-zk-warn-bg text-zk-warn-fg",
    slate: "bg-zk-chip text-zk-text2",
  };
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-zk-border bg-zk-surface px-3 py-2.5">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${tones[tone]}`}>
        <Icon name={icon} size={15} strokeWidth={2.1} />
      </span>
      <span className="min-w-0">
        <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-zk-muted">
          {label}
        </span>
        <span className="flex items-baseline gap-1">
          <span className="tabular text-lg font-extrabold leading-5 text-zk-text">{value}</span>
          <span className="truncate text-[10px] text-zk-muted">{hint}</span>
        </span>
      </span>
    </div>
  );
}

export default function HandshakePage() {
  const store = useHandshake();
  const { handshakes, grants, events, now, hydrated } = store;
  const [tab, setTab] = useState<Tab>("needs");
  const [filter, setFilter] = useState<HandshakeKind | "all">("all");
  const [trustOpen, setTrustOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ needs: null, motion: null, receipts: null });

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!demoRef.current?.contains(event.target as Node)) setDemoOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  // Deep links from the bell, dashboard, and issue pages land on the right tab.
  useEffect(() => {
    if (!hydrated) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const target = handshakes.find((h) => h.id === hash);
    if (!target) return;
    const timer = window.setTimeout(() => {
      setTab(phaseTab(target.phase));
      document.getElementById(hash)?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
    // Only run once, when the store hydrates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // A shared presentation link can open the guide directly.
  useEffect(() => {
    if (!hydrated) return;
    if (new URLSearchParams(window.location.search).get("tour") !== "1") return;
    const timer = window.setTimeout(() => {
      setFilter("all");
      setTab("needs");
      setTourOpen(true);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const needs = useMemo(
    () => handshakes.filter((h) => h.phase === "pending" || h.phase === "holding"),
    [handshakes],
  );
  const motion = useMemo(() => handshakes.filter((h) => h.phase === "revising"), [handshakes]);
  const receipts = useMemo(
    () =>
      handshakes
        .filter((h) => h.phase === "approved" || h.phase === "declined" || h.phase === "expired")
        .sort((a, b) => (b.decision?.at ?? 0) - (a.decision?.at ?? 0)),
    [handshakes],
  );

  const autoCount = handshakes.filter(
    (h) => h.decision?.kind === "auto" && h.phase === "approved",
  ).length;
  const expiredCount = handshakes.filter((h) => h.phase === "expired").length;
  const decided = handshakes.filter(
    (h) => h.decision && h.decision.kind !== "expired",
  ).length;

  const active = tab === "needs" ? needs : tab === "motion" ? motion : receipts;
  const visible = filter === "all" ? active : active.filter((h) => h.kind === filter);

  const counts: Record<Tab, number> = {
    needs: needs.length,
    motion: motion.length,
    receipts: receipts.length,
  };

  const tourSteps = useMemo<TourStep[]>(
    () => [
      {
        title: "A queue of decisions, not messages",
        body: "This replaces Ziki’s free-text escalation inbox. “Needs you” holds every open ask and anything inside its undo window. “In motion” means an agent is revising. “Receipts” is the permanent record.",
        target: "summary",
      },
      {
        title: "Every ask is a small contract",
        body: "Typed intent, the exact next API call, a plan, evidence, blast radius, and what is explicitly not included. The human never has to reconstruct intent from prose before saying yes.",
        target: "ask",
      },
      {
        title: "Three real choices",
        body: "Approve with conditions, ask for a revision, or decline with a reason. “Not yet” is a first-class answer, so the agent can come back with better evidence instead of failing silently.",
        target: "choices",
      },
      {
        title: "A receipt both sides can use",
        body: "Every decision writes a receipt. Open “Agent payload” to see what the agent receives: a structured decision, conditions, dispatch, and an immutable receipt id — not a paragraph it has to interpret.",
        target: "receipt",
        onEnter: () => {
          setFilter("all");
          setTab("receipts");
        },
      },
      {
        title: "Trust is a dial, not a leap",
        body: "A standing grant covers one agent, one action type, one risk ceiling, for seven days. High-risk merges and credentials always ask. Revoking a grant never rewrites a past decision.",
        target: "trust",
        onEnter: () => {
          setFilter("all");
          setTab("needs");
        },
      },
      {
        title: "The acceptance case",
        body: "Handshake is additive: it uses Ziki’s existing escalation, bid, verdict, and merge endpoints behind a feature flag. The pilot asks for two weeks, one workspace, and four success gates.",
        link: { href: "/improvement#pilot", label: "Read the pilot" },
      },
    ],
    [setTab],
  );

  const onTabKey = (event: React.KeyboardEvent, current: Tab) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = tabs.findIndex((t) => t.id === current);
    const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-56 animate-pulse rounded-full bg-zk-chip" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-zk-chip" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[62px] animate-pulse rounded-2xl bg-zk-chip" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_318px]">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-[20px] border border-zk-border bg-zk-surface" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-[20px] border border-zk-border bg-zk-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[28px] font-extrabold leading-8 tracking-[-0.03em] text-zk-text">
              Handshake
            </h1>
            <Chip tone="accent">
              <Icon name="sparkles" size={11} />
              Proposed interaction
            </Chip>
            <Chip tone="muted">Prototype</Chip>
          </div>
          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-zk-muted">
            Your agents do the work. Nothing moves without you. Every ask shows the exact next
            call, the evidence behind it, and a way back out.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setTab("needs");
              setTourOpen(true);
            }}
            aria-label="Start the presenter tour"
            title="Guided 60-second walkthrough"
            className={buttonClass("secondary")}
          >
            <Icon name="play" size={13} />
            <span className="hidden sm:inline">Present</span>
            <span className="sm:hidden">Tour</span>
          </button>
          <button
            type="button"
            onClick={() => setTrustOpen(true)}
            data-tour="trust"
            className={buttonClass("secondary")}
          >
            <Icon name="shield" size={15} />
            Trust
            {grants.length > 0 ? (
              <span className="rounded-full bg-zk-tint px-1.5 text-[10px] font-extrabold text-zk-accent">
                {grants.length}
              </span>
            ) : null}
          </button>
          <div ref={demoRef} className="relative">
            <button
              type="button"
              onClick={() => setDemoOpen((v) => !v)}
              aria-expanded={demoOpen}
              aria-haspopup="menu"
              className={buttonClass("secondary")}
            >
              <Icon name="play" size={13} />
              Demo
              <Icon name="chevron-down" size={12} />
            </button>
            {demoOpen ? (
              <div
                role="menu"
                aria-label="Demo controls"
                className="animate-pop absolute right-0 top-11 z-30 w-72 rounded-2xl border border-zk-border bg-zk-surface p-2 shadow-[0_20px_48px_rgba(11,23,51,0.18)]"
              >
                <p className="px-2 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
                  Demo controls
                </p>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    store.simulateGrant();
                    setDemoOpen(false);
                  }}
                  className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left hover:bg-zk-chip"
                >
                  <Icon name="shield" size={15} className="mt-0.5 text-zk-ok-fg" />
                  <span>
                    <span className="block text-[12px] font-bold text-zk-text">
                      Simulate a granted ask
                    </span>
                    <span className="block text-[10.5px] leading-4 text-zk-muted">
                      A matching ask starts in 12 seconds unless you undo. Needs a standing grant.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    store.expireAll();
                    setDemoOpen(false);
                  }}
                  className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left hover:bg-zk-chip"
                >
                  <Icon name="clock" size={15} className="mt-0.5 text-zk-warn-fg" />
                  <span>
                    <span className="block text-[12px] font-bold text-zk-text">
                      Fast-forward open offers
                    </span>
                    <span className="block text-[10.5px] leading-4 text-zk-muted">
                      Prove the safe default: every pending ask expires without acting.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    store.reset();
                    setDemoOpen(false);
                  }}
                  className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left hover:bg-zk-chip"
                >
                  <Icon name="refresh" size={15} className="mt-0.5 text-zk-muted" />
                  <span>
                    <span className="block text-[12px] font-bold text-zk-text">Reset demo</span>
                    <span className="block text-[10.5px] leading-4 text-zk-muted">
                      Restore the seeded asks, receipts, and grant.
                    </span>
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* What changed */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-zk-border bg-zk-surface px-3.5 py-2.5">
        <p className="flex items-start gap-2 text-[11.5px] leading-5 text-zk-text2">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-zk-accent" />
          <span>
            <span className="font-bold text-zk-text">Handshake replaces the free-text escalation inbox.</span>{" "}
            Each ask is typed, time-boxed, attributable, and reversible for ten seconds.
          </span>
        </p>
        <Link
          href="/improvement"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold text-zk-accent hover:bg-zk-tint"
        >
          Read the design brief
          <Icon name="arrow-right" size={12} />
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4" data-tour="summary">
        <SummaryStat label="Needs you" value={needs.length} hint="open or held" tone="blue" icon="clock" />
        <SummaryStat
          label="In motion"
          value={motion.length}
          hint="agent revising"
          tone="amber"
          icon="refresh"
        />
        <SummaryStat
          label="Auto-approved"
          value={autoCount}
          hint="by your grants"
          tone="green"
          icon="shield"
        />
        <SummaryStat
          label="Expired"
          value={expiredCount}
          hint="no action taken"
          tone="slate"
          icon="check-circle"
        />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_318px]">
        <div className="min-w-0 space-y-3.5">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zk-border pb-0">
            <div role="tablist" aria-label="Handshake states" className="flex items-end gap-1">
              {tabs.map((item) => {
                const selected = tab === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[item.id] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${item.id}`}
                    tabIndex={selected ? 0 : -1}
                    onKeyDown={(event) => onTabKey(event, item.id)}
                    onClick={() => setTab(item.id)}
                    className={`focus-ring relative -mb-px inline-flex h-10 items-center gap-1.5 rounded-t-lg px-3 text-[13px] transition-colors ${
                      selected
                        ? "border-b-2 border-electric-blue-strong font-bold text-zk-text"
                        : "border-b-2 border-transparent font-medium text-zk-muted hover:text-zk-text"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-extrabold ${
                        selected ? "bg-zk-tint text-zk-accent" : "bg-zk-chip text-zk-muted"
                      }`}
                    >
                      {counts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="hidden items-center gap-1.5 pb-2 text-[10px] font-medium text-zk-muted sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-zk-ok-fg pulse-dot" />
              clock is live
            </span>
          </div>

          {/* Kind filter */}
          {tab !== "receipts" ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
                className={`h-7 rounded-full px-2.5 text-[11px] font-semibold transition-colors ${
                  filter === "all"
                    ? "bg-deep-ocean text-white"
                    : "bg-zk-chip text-zk-text2 hover:bg-zk-tint hover:text-zk-accent"
                }`}
              >
                All actions
              </button>
              {kindOrder.map((kind) => {
                const count = active.filter((h) => h.kind === kind).length;
                if (count === 0) return null;
                return (
                  <button
                    key={kind}
                    type="button"
                    aria-pressed={filter === kind}
                    onClick={() => setFilter(filter === kind ? "all" : kind)}
                    className={`inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors ${
                      filter === kind
                        ? "bg-deep-ocean text-white"
                        : "bg-zk-chip text-zk-text2 hover:bg-zk-tint hover:text-zk-accent"
                    }`}
                  >
                    {kindMeta[kind].short}
                    <span className="tabular opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="space-y-3.5"
          >
            {visible.length === 0 ? (
              tab === "needs" ? (
                <EmptyState
                  icon="check-circle"
                  title="You’re all caught up"
                  body="No agent is waiting on a decision. New asks appear here the moment an agent reaches a gate — never in your DMs, never buried in a thread."
                  action={
                    receipts.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setTab("receipts")}
                        className={buttonClass("secondary", "sm")}
                      >
                        See recent receipts
                      </button>
                    ) : null
                  }
                />
              ) : tab === "motion" ? (
                <EmptyState
                  icon="clock"
                  title="No agent is revising"
                  body="When you ask for more evidence or a narrower plan, the ask appears here while the agent works on it. The offer clock is paused — nothing will be dispatched."
                />
              ) : (
                <EmptyState
                  icon="file"
                  title="No receipts yet"
                  body="Every decision writes a receipt: who decided, what conditions applied, and exactly what the agent did next."
                />
              )
            ) : tab === "receipts" ? (
              <div className="grid gap-3.5 lg:grid-cols-2">
                {visible.map((handshake, index) => (
                  <div key={handshake.id} data-tour={index === 0 ? "receipt" : undefined}>
                    <HandshakeCard handshake={handshake} />
                  </div>
                ))}
              </div>
            ) : (
              visible.map((handshake, index) => (
                <div key={handshake.id} data-tour={index === 0 ? "ask" : undefined}>
                  <HandshakeCard handshake={handshake} />
                </div>
              ))
            )}
          </div>

          {tab === "receipts" && receipts.length > 0 ? (
            <section className="mt-2 overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface">
              <div className="flex items-center justify-between border-b border-zk-divider px-4 py-3">
                <h2 className="text-sm font-bold text-zk-text">Decision log</h2>
                <span className="text-[10.5px] text-zk-muted">append-only · who, what, when</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[11.5px]">
                  <thead>
                    <tr className="bg-zk-tint/60 text-[9.5px] font-extrabold uppercase tracking-[0.07em] text-zk-accent">
                      <th scope="col" className="px-4 py-2.5">Time</th>
                      <th scope="col" className="px-4 py-2.5">Event</th>
                      <th scope="col" className="px-4 py-2.5">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zk-divider">
                    {events.slice(0, 12).map((event) => (
                      <tr key={event.id} className="transition-colors hover:bg-zk-tint/30">
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[10.5px] text-zk-muted">
                          {clock(event.at)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-zk-text">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                event.tone === "ok"
                                  ? "bg-zk-ok-fg"
                                  : event.tone === "bad"
                                    ? "bg-zk-bad-fg"
                                    : event.tone === "warn"
                                      ? "bg-zk-warn-fg"
                                      : "bg-electric-blue"
                              }`}
                            />
                            {event.title}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-zk-text2">{event.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>

        {/* Rail */}
        <aside className="space-y-3.5 xl:sticky xl:top-[84px]">
          <section className="rounded-[20px] border border-zk-border bg-zk-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zk-text">The loop</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zk-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-zk-ok-fg pulse-dot" />
                live
              </span>
            </div>
            <ol className="mt-3 space-y-3">
              {[
                {
                  icon: "sparkles" as const,
                  title: "Agent proposes",
                  body: "A typed intent, the exact API call, evidence, and an expiry.",
                },
                {
                  icon: "user" as const,
                  title: "You decide",
                  body: "Approve, ask for changes, or decline with a reason. Silence never acts.",
                },
                {
                  icon: "undo" as const,
                  title: "Ziki holds 10s",
                  body: "Anything you approve waits at the gate, visible and undoable.",
                },
                {
                  icon: "file" as const,
                  title: "Receipt",
                  body: "The agent reports what it did; the decision stays attributable.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-2.5">
                  <span className="relative flex flex-col items-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
                      <Icon name={step.icon} size={13} />
                    </span>
                    {index < 3 ? <span className="mt-1 h-full w-px bg-zk-border" /> : null}
                  </span>
                  <span className="pb-0.5">
                    <span className="block text-[12px] font-bold text-zk-text">{step.title}</span>
                    <span className="block text-[10.5px] leading-4 text-zk-muted">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="overflow-hidden rounded-[20px] border border-zk-border bg-zk-surface">
            <div className="flex items-center justify-between border-b border-zk-divider px-4 py-3">
              <h2 className="text-sm font-bold text-zk-text">Agent loop</h2>
              <span className="text-[10px] font-semibold text-zk-muted">
                {decided} decisions
              </span>
            </div>
            <ul className="max-h-[340px] overflow-y-auto">
              {events.slice(0, 7).map((event) => (
                <li key={event.id} className="border-b border-zk-divider px-4 py-2.5 last:border-0">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        event.tone === "ok"
                          ? "bg-zk-ok-fg"
                          : event.tone === "bad"
                            ? "bg-zk-bad-fg"
                            : event.tone === "warn"
                              ? "bg-zk-warn-fg"
                              : "bg-electric-blue"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-semibold leading-4 text-zk-text">
                        {event.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-zk-muted">
                        {event.detail}
                      </p>
                      <p className="mt-0.5 text-[9.5px] text-zk-muted">
                        {timeAgo(event.at, now)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[20px] border border-zk-border bg-zk-surface p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zk-text">Standing grants</h2>
              <Chip tone={grants.length ? "accent" : "muted"}>{grants.length}</Chip>
            </div>
            {grants.length === 0 ? (
              <p className="mt-2 text-[11px] leading-4 text-zk-muted">
                Nothing is automatic. Every ask will keep coming to you.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {grants.map((grant) => (
                  <li key={grant.id} className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zk-tint text-zk-accent">
                      <Icon name="shield" size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold text-zk-text">
                        {grant.agentName} · {kindMeta[grant.kind].short}
                      </span>
                      <span className="block text-[10px] text-zk-muted">
                        up to {riskMeta[grant.maxRisk].label.toLowerCase()} ·{" "}
                        {new Date(grant.expiresAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setTrustOpen(true)}
              className={buttonClass("secondary", "sm", "mt-3 w-full")}
            >
              <Icon name="settings" size={12} />
              Manage trust
            </button>
          </section>

          <p className="flex items-start gap-1.5 px-1 text-[10px] leading-4 text-zk-muted">
            <Icon name="lock" size={11} className="mt-0.5 shrink-0" />
            Prototype: decisions are simulated in this browser. The protocol mirrors Ziki’s
            escalations and bid endpoints.
          </p>
        </aside>
      </div>

      <TrustDrawer open={trustOpen} onClose={() => setTrustOpen(false)} />
      <Tour
        key={tourOpen ? "tour-open" : "tour-closed"}
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={tourSteps}
      />
    </div>
  );
}
