"use client";

import Link from "next/link";
import { useState } from "react";
import { useHandshake, useToast } from "@/components/providers";
import { Icon } from "@/components/icons";
import { issues, agents, workspace, type Issue } from "@/lib/mock";
import { isGrantActive, kindMeta, riskMeta } from "@/lib/handshake";
import { WorkshopAsk } from "@/components/workshop/ask-card";
import { IssueDrawer, IssueNote } from "@/components/workshop/issue-note";
import {
  ArrowDoodle,
  BlobAgent,
  Cloud,
  KeyDoodle,
  Mug,
  PaperPlane,
  Plant,
  Sparkle,
  Star,
  Sun,
  Tape,
  WindowScene,
} from "@/components/workshop/doodles";

type Tab = "needs" | "motion" | "receipts";

const numberWord = (value: number) => {
  const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return words[value] ?? String(value);
};

const tabs: { id: Tab; label: string; empty: string }[] = [
  { id: "needs", label: "Needs a stamp", empty: "The drawer is empty. Go put the kettle on." },
  { id: "motion", label: "Being redrawn", empty: "Nobody is chewing a pencil right now." },
  { id: "receipts", label: "Filed away", empty: "No receipts yet. The first stamp is always the best one." },
];

export function WorkshopClient() {
  const { handshakes, grants, hydrated, simulateGrant, reset, revokeGrant, renewGrant, now } =
    useHandshake();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("needs");
  const [night, setNight] = useState(false);
  const [openIssue, setOpenIssue] = useState<Issue | null>(null);
  const [votes, setVotes] = useState<Record<number, { count: number; voted: boolean }>>({});
  const activeGrants = grants.filter((grant) => isGrantActive(grant, now));

  const needs = handshakes.filter((item) => item.phase === "pending" || item.phase === "holding");
  const motion = handshakes.filter((item) => item.phase === "revising");
  const receipts = handshakes
    .filter((item) => item.phase === "approved" || item.phase === "declined" || item.phase === "expired")
    .sort((a, b) => (b.decision?.at ?? 0) - (a.decision?.at ?? 0));

  const visible = tab === "needs" ? needs : tab === "motion" ? motion : receipts;
  const counts: Record<Tab, number> = {
    needs: needs.length,
    motion: motion.length,
    receipts: receipts.length,
  };

  const vote = (issue: Issue) => {
    const current = votes[issue.number] ?? { count: issue.votes, voted: issue.voted };
    const next = current.voted
      ? { count: current.count - 1, voted: false }
      : { count: current.count + 1, voted: true };
    setVotes((prev) => ({ ...prev, [issue.number]: next }));
    toast(next.voted ? `Cheered #${issue.number}. The note feels seen.` : `Cheer tucked away from #${issue.number}.`, {
      tone: next.voted ? "ok" : "info",
    });
  };

  if (!hydrated) {
    return (
      <div className="workshop w-grain flex min-h-screen items-center justify-center">
        <div className="w-card relative z-10 flex flex-col items-center gap-3 p-8 text-center">
          <BlobAgent tone="teal" size={64} className="w-float" />
          <p className="w-display text-2xl font-bold">Opening the workshop…</p>
          <p className="text-[12px]" style={{ color: "var(--w-ink-soft)" }}>
            Winding the clock and feeding the plant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`workshop ${night ? "workshop-night" : ""} w-grain min-h-screen`}>
      <div className="relative z-10">
        {/* Header */}
        <header
          className="sticky top-0 z-40 border-b-2 backdrop-blur-md"
          style={{ borderColor: "var(--w-ink)", background: "color-mix(in srgb, var(--w-bg) 88%, transparent)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2.5 sm:gap-3 sm:py-3">
            <Link href="/workshop" className="flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center border-2 text-[20px] font-black"
                style={{
                  borderColor: "var(--w-ink)",
                  background: "var(--w-butter)",
                  color: "#2b2118",
                  borderRadius: "14px 18px 12px 16px",
                  boxShadow: "3px 3px 0 var(--w-shadow)",
                  transform: "rotate(-3deg)",
                }}
              >
                Z
              </span>
              <span className="w-display text-[18px] font-bold leading-none tracking-[-0.02em] sm:text-[20px]">
                Ziki <span className="italic">Workshop</span>
              </span>
            </Link>

            <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto text-[11px] font-extrabold sm:order-none sm:ml-4 sm:w-auto">
              {[
                ["#desk", "The Desk"],
                ["#cabinet", "The Cabinet"],
                ["#shelf", "The Shelf"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors hover:bg-[var(--w-bg-2)]"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNight((value) => !value)}
                aria-label={night ? "Switch to daylight" : "Switch to lamplight"}
                aria-pressed={night}
                className="w-sticker h-9 w-9 shrink-0 justify-center p-0"
                style={{ background: night ? "var(--w-lilac-soft)" : "var(--w-butter-soft)" }}
              >
                <Icon name={night ? "moon" : "sun"} size={15} strokeWidth={2.2} />
              </button>
              <Link href="/dashboard" className="w-btn w-btn-paper min-h-9 px-2.5 text-[11px] sm:px-3">
                <span className="sm:hidden">Classic</span>
                <span className="hidden sm:inline">Classic Ziki</span>
                <Icon name="arrow-up-right" size={11} />
              </Link>
            </div>
          </div>
        </header>

        {/* Hero / The Desk */}
        <section id="desk" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-4 pt-8 sm:scroll-mt-24 sm:pt-12">
          <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="w-sticker px-3 py-1.5 text-[10px] uppercase tracking-[0.1em]" style={{ background: "var(--w-butter-soft)" }}>
                <Sun className="h-3.5 w-3.5" />
                Wednesday, 28 October · the kettle is on
              </span>
              <h1 className="w-display mt-4 text-[42px] font-bold leading-[0.96] tracking-[-0.035em] sm:text-[62px]">
                Morning, Arnold.
                <br />
                <span className="w-underline-doodle">The workshop is humming.</span>
              </h1>
              <p className="mt-4 max-w-lg text-[13px] leading-6 sm:text-[14px]" style={{ color: "var(--w-ink-soft)" }}>
                Three little helpers are at the bench.{" "}
                {needs.length === 0
                  ? "No notes are waiting"
                  : `${numberWord(needs.length).charAt(0).toUpperCase()}${numberWord(needs.length).slice(1)} ${needs.length === 1 ? "note is" : "notes are"} waiting`}{" "}
                for your stamp. Nothing leaves the room without one — not a merge, not a secret, not even a
                very confident robot.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <a href="#cabinet" className="w-btn w-btn-coral text-[12px]">
                  <Star width={14} height={14} />
                  Open the cabinet
                </a>
                <a href="#shelf" className="w-btn w-btn-paper text-[12px]">
                  Browse the shelf
                  <Icon name="arrow-right" size={12} />
                </a>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {[
                  {
                    label: "points in the jar",
                    value: workspace.points.toLocaleString("en-US"),
                    bg: "var(--w-butter-soft)",
                    doodle: <Star width={22} height={22} />,
                  },
                  {
                    label: "notes waiting",
                    value: needs.length,
                    bg: "var(--w-coral-soft)",
                    doodle: <Sparkle width={22} height={22} />,
                  },
                  {
                    label: "little helpers",
                    value: agents.length,
                    bg: "var(--w-teal-soft)",
                    doodle: <BlobAgent tone="teal" size={24} />,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="w-card w-card-lift flex items-center gap-2.5 px-3 py-2.5"
                    style={{ background: stat.bg }}
                  >
                    <span className="shrink-0">{stat.doodle}</span>
                    <span>
                      <span className="w-display block text-[20px] font-bold leading-none">{stat.value}</span>
                      <span className="mt-0.5 block text-[9.5px] font-extrabold uppercase tracking-[0.06em]" style={{ color: "var(--w-ink-soft)" }}>
                        {stat.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="w-card relative p-3" style={{ rotate: "1.2deg" }}>
                <Tape className="-top-2.5 left-7 rotate-[-5deg]" />
                <WindowScene className="w-full" />
              </div>
              <div
                className="w-card absolute -left-3 -top-4 hidden max-w-[180px] p-2.5 text-[10.5px] font-bold sm:block"
                style={{ background: "var(--w-butter-soft)", rotate: "-4deg" }}
              >
                <span className="w-pin absolute -top-2 left-3" />
                P.S. coddy left a biscuit by the keyboard. It is not a bribe.
              </div>
              <div
                className="w-card absolute -bottom-5 right-2 flex items-center gap-2 p-2 pr-3 text-[10px] font-extrabold"
                style={{ background: "var(--w-card)", rotate: "-2deg" }}
              >
                <PaperPlane className="h-6 w-8" />
                a gentle breeze of autonomy
              </div>
            </div>
          </div>
        </section>

        {/* A little strip */}
        <div className="mx-auto mt-10 max-w-6xl px-4">
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-dashed px-2 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em]"
            style={{ borderColor: "var(--w-line)", color: "var(--w-ink-soft)" }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--w-teal)" }} />
              the clock is ticking, kindly
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkle width={12} height={12} /> 3 tiny wins since breakfast
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Mug className="h-4 w-4" /> tea is a legitimate project tool
            </span>
          </div>
        </div>

        {/* Cabinet */}
        <section id="cabinet" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-4 pt-14 sm:scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="w-sticker px-3 py-1.5 text-[10px] uppercase tracking-[0.1em]" style={{ background: "var(--w-lilac-soft)" }}>
                The Consent Cabinet
              </span>
              <h2 className="w-display mt-3 text-[34px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[44px]">
                Nothing leaves without a stamp.
              </h2>
              <p className="mt-2 max-w-2xl text-[12.5px] leading-6" style={{ color: "var(--w-ink-soft)" }}>
                Agents tuck a note in the drawer. You read it, maybe add a condition, then stamp.
                The ink takes ten seconds to dry — enough time to change your mind.
              </p>
            </div>
            <div className="w-card hidden items-center gap-2 px-3 py-2 text-[10px] font-extrabold sm:flex" style={{ background: "var(--w-teal-soft)" }}>
              <KeyDoodle className="h-4 w-8" />
              a key only fits one lock
            </div>
          </div>

          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_288px]">
            <div>
              <div className="flex flex-wrap gap-2">
                {tabs.map((item) => {
                  const selected = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      aria-pressed={selected}
                      className="w-btn min-h-10 text-[11px]"
                      style={{
                        background: selected ? "var(--w-ink)" : "var(--w-card)",
                        color: selected ? "var(--w-bg)" : "var(--w-ink)",
                        transform: selected ? "rotate(-1deg)" : "none",
                      }}
                    >
                      {item.label}
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px]"
                        style={{
                          background: selected ? "var(--w-butter)" : "var(--w-bg-2)",
                          color: "var(--w-ink)",
                        }}
                      >
                        {counts[item.id]}
                      </span>
                    </button>
                  );
                })}
                {needs.length === 0 && motion.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="w-btn w-btn-butter min-h-10 text-[11px] sm:ml-auto"
                  >
                    <Sparkle width={12} height={12} />
                    Refill the drawers
                  </button>
                ) : null}
              </div>

              <div className="mt-4 space-y-4">
                {visible.length === 0 ? (
                  <div className="w-card p-8 text-center">
                    <BlobAgent tone="butter" size={62} className="mx-auto w-float" />
                    <p className="w-display mt-2 text-[22px] font-bold">
                      {tabs.find((item) => item.id === tab)?.empty}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <button type="button" onClick={() => setTab("needs")} className="w-btn w-btn-paper text-[11px]">
                        Back to the drawer
                      </button>
                      {tab === "needs" ? (
                        <button type="button" onClick={() => reset()} className="w-btn w-btn-butter text-[11px]">
                          <Sparkle width={12} height={12} />
                          Refill the drawers
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  visible.map((handshake, index) => (
                    <WorkshopAsk key={handshake.id} handshake={handshake} index={index} />
                  ))
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="w-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="w-display text-[19px] font-bold">The keyring</h3>
                  <span className="w-sticker px-2 py-0.5 text-[9px]" style={{ background: "var(--w-butter-soft)" }}>
                    {activeGrants.length} of {grants.length} key{grants.length === 1 ? "" : "s"} live
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] leading-5" style={{ color: "var(--w-ink-soft)" }}>
                  A standing grant is a little key: one agent, one kind of ask, one risk ceiling, seven days.
                </p>
                {grants.length === 0 ? (
                  <p className="mt-2 rounded-lg p-2 text-[10.5px] font-bold" style={{ background: "var(--w-bg-2)" }}>
                    The ring is empty. Stamp a low-risk note with “remember this” to cut a key.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {grants.map((grant) => {
                      const active = isGrantActive(grant, now);
                      return (
                        <li key={grant.id} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "var(--w-bg)" }}>
                          <KeyDoodle className="h-4 w-8 shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[10.5px] font-extrabold">
                              {grant.agentName} · {kindMeta[grant.kind].short}
                            </span>
                            <span className="block text-[9px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
                              up to {riskMeta[grant.maxRisk].label.toLowerCase()} ·{" "}
                              {active
                                ? `ends ${new Date(grant.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                                : "expired, not matching"}
                            </span>
                          </span>
                          {!active ? (
                            <button
                              type="button"
                              onClick={() => renewGrant(grant.id)}
                              className="text-[9px] font-extrabold underline decoration-dotted underline-offset-2"
                              style={{ color: "var(--w-teal)" }}
                            >
                              renew
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => revokeGrant(grant.id)}
                            className="text-[9px] font-extrabold underline decoration-dotted underline-offset-2"
                            style={{ color: "var(--w-coral)" }}
                          >
                            cut
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={() => simulateGrant()}
                  className="w-btn w-btn-teal mt-3 min-h-9 w-full text-[10.5px]"
                >
                  <Sparkle width={12} height={12} />
                  Try a granted ask
                </button>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="mt-2 w-full text-[9.5px] font-extrabold underline decoration-dotted underline-offset-2"
                  style={{ color: "var(--w-ink-soft)" }}
                >
                  Put everything back where it was
                </button>
              </div>

              <div className="w-card p-4" style={{ background: "var(--w-butter-soft)" }}>
                <div className="flex items-center gap-2">
                  <Plant className="h-9 w-7" />
                  <h3 className="w-display text-[18px] font-bold">House rules</h3>
                </div>
                <ul className="mt-2 space-y-1.5 text-[10.5px] leading-5">
                  {[
                    "Silence is not a yes.",
                    "High-risk asks always knock.",
                    "A no comes with a reason.",
                    "The un-stamp is always one tap.",
                  ].map((rule) => (
                    <li key={rule} className="flex gap-1.5">
                      <span className="mt-0.5 shrink-0">
                        <Star width={11} height={11} />
                      </span>
                      <span className="font-semibold">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative hidden px-2 lg:block">
                <ArrowDoodle className="h-12 w-20 opacity-50" />
                <p className="w-display mt-1 text-[13px] font-bold italic" style={{ color: "var(--w-ink-soft)" }}>
                  “The best ideas arrive with crumbs on them.”
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Shelf */}
        <section id="shelf" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-8 pt-14 sm:scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="w-sticker px-3 py-1.5 text-[10px] uppercase tracking-[0.1em]" style={{ background: "var(--w-sky-soft)" }}>
                The Shelf
              </span>
              <h2 className="w-display mt-3 text-[34px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[44px]">
                Little problems, looking for a home.
              </h2>
              <p className="mt-2 max-w-2xl text-[12.5px] leading-6" style={{ color: "var(--w-ink-soft)" }}>
                Pick one up, cheer for it, or open the full file. Every note has a little story in the margin.
              </p>
            </div>
            <Link href="/issues" className="w-btn w-btn-paper text-[11px]">
              All the notes
              <Icon name="arrow-right" size={11} />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {issues.slice(0, 3).map((issue, index) => (
              <IssueNote
                key={issue.id}
                issue={issue}
                index={index}
                votes={votes[issue.number] ?? { count: issue.votes, voted: issue.voted }}
                onVote={() => vote(issue)}
                onOpen={() => setOpenIssue(issue)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-3" style={{ borderColor: "var(--w-line)" }}>
            <p className="flex items-center gap-2 text-[10.5px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
              <Cloud className="h-5 w-8" />
              Three more notes are napping in the full workshop.
            </p>
            <div className="flex items-center gap-2">
              <Link href="/handshake" className="text-[10.5px] font-extrabold underline decoration-dotted underline-offset-4" style={{ color: "var(--w-teal)" }}>
                Visit the classic cabinet
              </Link>
              <span className="text-[10px]" style={{ color: "var(--w-ink-soft)" }}>·</span>
              <Link href="/improvement" className="text-[10.5px] font-extrabold underline decoration-dotted underline-offset-4" style={{ color: "var(--w-teal)" }}>
                Read the design brief
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 px-4 py-7" style={{ borderColor: "var(--w-ink)" }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-black" style={{ borderColor: "var(--w-ink)", background: "var(--w-coral)", color: "var(--w-card)" }}>
                Z
              </span>
              <p className="text-[10.5px] font-bold" style={{ color: "var(--w-ink-soft)" }}>
                Made with paper, glue, and a little autonomy.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-extrabold" style={{ color: "var(--w-ink-soft)" }}>
              <Link href="/workshop" className="underline decoration-dotted underline-offset-4">The workshop</Link>
              <Link href="/dashboard" className="underline decoration-dotted underline-offset-4">Classic Ziki</Link>
              <Link href="/improvement" className="underline decoration-dotted underline-offset-4">The brief</Link>
              <a href="/workshop-design.md" className="underline decoration-dotted underline-offset-4">Workshop notes</a>
              <span>No agents were rushed.</span>
            </div>
          </div>
        </footer>

        {openIssue ? (
          <IssueDrawer
            issue={openIssue}
            votes={votes[openIssue.number] ?? { count: openIssue.votes, voted: openIssue.voted }}
            onVote={() => vote(openIssue)}
            onClose={() => setOpenIssue(null)}
          />
        ) : null}
      </div>
    </div>
  );
}
