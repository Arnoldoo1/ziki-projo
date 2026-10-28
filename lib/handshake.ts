/**
 * Ziki Handshake — the consent layer between an agent and its owner.
 *
 * A handshake is one pending agent action, expressed as a decision rather than
 * a message: what the agent will do next, why, what it touches, how long the
 * offer is good for, and what the human can do about it. Approvals are staged
 * for a short grace period so they stay reversible; a decision always produces
 * a receipt the agent and the human can both point at later.
 */

export type HandshakeKind = "bid" | "merge" | "scope_change" | "credential" | "test_verdict";
export type Risk = "low" | "medium" | "high";
export type Phase = "pending" | "holding" | "revising" | "approved" | "declined" | "expired";
export type DecisionKind = "approved" | "declined" | "expired" | "auto";

export type EvidenceKind = "issue" | "pr" | "test" | "log" | "doc";

export type Evidence = {
  kind: EvidenceKind;
  label: string;
  detail: string;
  href?: string;
};

export type Handshake = {
  id: string;
  kind: HandshakeKind;
  risk: Risk;
  agentId: string;
  agentName: string;
  agentLevel: string;
  issueNumber: number;
  issueTitle: string;
  issueId: string;
  title: string;
  summary: string;
  ask: string;
  plan: string[];
  notIncluded: string;
  confidence: number;
  evidence: Evidence[];
  blast: {
    files: string[];
    services: string[];
    points: number;
    reversible: "yes" | "partly" | "no";
  };
  nextAction: { method: "POST" | "PATCH"; path: string };
  successResponse: string;
  createdAt: number;
  expiresAt: number;
  phase: Phase;
  holdEndsAt?: number;
  decision?: {
    kind: DecisionKind;
    at: number;
    reasons?: string[];
    note?: string;
    conditions?: string[];
    grantId?: string;
  };
  /** Set while an approval is in its grace period. */
  pendingGrant?: boolean;
  /** Agent is thinking through a revision; the timer is paused. */
  replyAt?: number;
  reply?: {
    body: string;
    evidence?: Evidence;
    confidenceDelta?: number;
    plan?: string[];
  };
  rounds?: number;
};

export type Grant = {
  id: string;
  kind: HandshakeKind;
  agentId: string;
  agentName: string;
  maxRisk: Risk;
  createdAt: number;
  expiresAt: number;
};

export type AuditEvent = {
  id: string;
  at: number;
  tone: "info" | "ok" | "bad" | "warn";
  title: string;
  detail?: string;
  handshakeId?: string;
};

export type HandshakeState = {
  handshakes: Handshake[];
  grants: Grant[];
  events: AuditEvent[];
};

export const GRACE_MS = 10_000;
const AUTO_GRACE_MS = 12_000;
const REPLY_MS = 1_800;

export const kindMeta: Record<
  HandshakeKind,
  { label: string; short: string; icon: string; tint: string }
> = {
  bid: {
    label: "Work authorization",
    short: "Bid",
    icon: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
    tint: "info",
  },
  merge: {
    label: "Merge approval",
    short: "Merge",
    icon: "M6 3v12a3 3 0 0 0 3 3h6M18 3v6M6 6a3 3 0 1 0 0-.01M18 9a3 3 0 1 0 0-.01",
    tint: "ok",
  },
  scope_change: {
    label: "Scope change",
    short: "Scope",
    icon: "M12 3v18M3 12h18M7 7l10 10M17 7 7 17",
    tint: "warn",
  },
  credential: {
    label: "Credential access",
    short: "Access",
    icon: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8Zm0 0L15 7m0 0 3 3m-3-3 3-3",
    tint: "bad",
  },
  test_verdict: {
    label: "Test verdict",
    short: "Verdict",
    icon: "M20 6 9 17l-5-5",
    tint: "ok",
  },
};

export const riskMeta: Record<Risk, { label: string; rank: number; explain: string }> = {
  low: { label: "Low risk", rank: 1, explain: "Small, reversible, no production impact." },
  medium: { label: "Medium risk", rank: 2, explain: "Touches shared code or a live claim." },
  high: { label: "High risk", rank: 3, explain: "Production, credentials, or hard to undo." },
};

const riskRank: Record<Risk, number> = { low: 1, medium: 2, high: 3 };

const mins = (n: number) => n * 60_000;

function seedHandshake(
  input: Omit<Handshake, "createdAt" | "phase" | "confidence"> & {
    createdAt: number;
    confidence?: number;
    phase?: Phase;
  },
): Handshake {
  return { ...input, confidence: input.confidence ?? 88, phase: input.phase ?? "pending" };
}

export function seedState(now = Date.now()): HandshakeState {
  const grants: Grant[] = [
    {
      id: "grant-verdict-coddy",
      kind: "test_verdict",
      agentId: "agent-coddy",
      agentName: "coddy",
      maxRisk: "low",
      createdAt: now - mins(60 * 24 * 5),
      expiresAt: now + mins(60 * 24 * 5),
    },
  ];

  const handshakes: Handshake[] = [
    seedHandshake({
      id: "hs-bid-231",
      kind: "bid",
      risk: "low",
      agentId: "agent-sentinel",
      agentName: "Sentinel",
      agentLevel: "Contributor",
      issueNumber: 231,
      issueTitle: "Low contrast on the “View all channels” button",
      issueId: "issue-231",
      title: "Bid on the contrast fix",
      summary:
        "The button measures 3.8:1. A two-line token change clears WCAG AA without touching layout or copy.",
      ask: "Allow Sentinel to submit a bid for this issue?",
      plan: [
        "Swap the button label and border tokens for AA-safe values.",
        "Re-run the contrast audit and attach before/after measurements.",
        "Open a draft PR and request an independent test verdict.",
      ],
      notIncluded: "No layout, copy, or component API changes.",
      confidence: 86,
      evidence: [
        { kind: "issue", label: "#231", detail: "Reported by Maya Okafor · 24 votes" },
        { kind: "test", label: "Contrast audit", detail: "3.8:1 measured on the approve/reject row" },
        { kind: "doc", label: "WCAG 2.1 AA", detail: "4.5:1 minimum for normal text" },
      ],
      blast: {
        files: ["app/globals.css", "components/button.tsx"],
        services: ["Web app"],
        points: 1200,
        reversible: "yes",
      },
      nextAction: { method: "POST", path: "/api/v1/issues/231/bid" },
      successResponse: "201 · bid B-8842 · ETA 45m",
      createdAt: now - mins(4),
      expiresAt: now + mins(11),
    }),
    seedHandshake({
      id: "hs-merge-204",
      kind: "merge",
      risk: "high",
      agentId: "agent-coddy",
      agentName: "coddy",
      agentLevel: "Reviewer",
      issueNumber: 204,
      issueTitle: "Session-expiry warning disappears before it can be read",
      issueId: "issue-204",
      title: "Merge the session-warning fix",
      summary:
        "PR #1847 keeps the warning visible for 30 seconds and adds a keyboard-dismiss path. Two independent verdicts are in.",
      ask: "Allow coddy to merge PR #1847 to main and queue the deploy?",
      plan: [
        "Squash-merge PR #1847 into main.",
        "Wait for the 47 required checks on the merge commit.",
        "Queue the production deploy and post the release note.",
      ],
      notIncluded: "No schema migration and no changes outside the session banner.",
      confidence: 93,
      evidence: [
        { kind: "pr", label: "PR #1847", detail: "+86 / −31 · 47 checks green" },
        { kind: "test", label: "2 verdicts", detail: "Independent reviewers: goodToMerge" },
        { kind: "log", label: "Keyboard run", detail: "Warning remains for 30s · Esc dismisses" },
      ],
      blast: {
        files: ["components/session-warning.tsx", "lib/session.ts", "tests/session.spec.ts"],
        services: ["Web app", "Production deploy"],
        points: 1500,
        reversible: "partly",
      },
      nextAction: { method: "POST", path: "/api/v1/issues/204/merge" },
      successResponse: "200 · merged 9f2c1ab · deploy queued",
      createdAt: now - mins(23),
      expiresAt: now + mins(8),
    }),
    seedHandshake({
      id: "hs-scope-188",
      kind: "scope_change",
      risk: "medium",
      agentId: "agent-coddy",
      agentName: "coddy",
      agentLevel: "Reviewer",
      issueNumber: 188,
      issueTitle: "Expose rate-limit headers on the public events stream",
      issueId: "issue-188",
      title: "Touch the shared rate-limit middleware",
      summary:
        "The stream bypasses the middleware that writes quota headers. Fixing it at the source adds two files outside the ticket's stated scope.",
      ask: "Allow coddy to expand the scope by two files?",
      plan: [
        "Add the quota header writer to the shared limiter.",
        "Wire the stream handler through it.",
        "Keep the public response shape unchanged and add a contract test.",
      ],
      notIncluded: "No new limits and no changes to existing quota values.",
      confidence: 71,
      evidence: [
        { kind: "issue", label: "#188", detail: "Feature request · 18 votes" },
        { kind: "log", label: "Trace", detail: "Stream handler never calls the limiter" },
        { kind: "test", label: "Contract test", detail: "Planned · covers 200 and 429 paths" },
      ],
      blast: {
        files: ["middleware/rate-limit.ts", "app/api/events/stream/route.ts"],
        services: ["API", "Agent clients"],
        points: 800,
        reversible: "yes",
      },
      nextAction: { method: "POST", path: "/api/v1/escalations" },
      successResponse: "201 · scope_change recorded · claim extended",
      createdAt: now - mins(41),
      expiresAt: now + mins(16),
    }),
    seedHandshake({
      id: "hs-verdict-149",
      kind: "test_verdict",
      risk: "low",
      agentId: "agent-coddy",
      agentName: "coddy",
      agentLevel: "Reviewer",
      issueNumber: 149,
      issueTitle: "Agent pairing accepts an expired one-time token",
      issueId: "issue-149",
      title: "Send a goodToMerge verdict",
      summary:
        "PR #1831 rejects expired pairing tokens with a 410. A frozen-clock run confirms the one-time guarantee holds.",
      ask: "Allow coddy to send this verdict to the merge gate?",
      plan: [
        "Post the verdict with the frozen-clock evidence attached.",
        "Move #149 to ready_to_merge if the second reviewer agrees.",
      ],
      notIncluded: "This is a review verdict, not a merge. The merge stays behind your gate.",
      confidence: 97,
      evidence: [
        { kind: "pr", label: "PR #1831", detail: "+54 / −12 · 39 checks green" },
        { kind: "test", label: "Frozen clock", detail: "Expired token → 410 at T+31s" },
      ],
      blast: {
        files: ["lib/pairing.ts", "tests/pairing.spec.ts"],
        services: ["API"],
        points: 300,
        reversible: "yes",
      },
      nextAction: { method: "POST", path: "/api/v1/issues/149/test-results" },
      successResponse: "201 · verdict goodToMerge · second reviewer notified",
      createdAt: now - mins(16),
      expiresAt: now + mins(13),
    }),
    seedHandshake({
      id: "hs-merge-152",
      kind: "bid",
      risk: "low",
      agentId: "agent-sentinel",
      agentName: "Sentinel",
      agentLevel: "Contributor",
      issueNumber: 152,
      issueTitle: "Points ledger shows a stale total after a claim is released",
      issueId: "issue-152",
      title: "Bid on the ledger cache fix",
      summary: "Invalidate the weekly total when a claim is released.",
      ask: "Allow Sentinel to submit a bid for this issue?",
      plan: ["Recompute totals from the ledger on release.", "Add a regression test."],
      notIncluded: "No ledger schema change.",
      confidence: 90,
      evidence: [{ kind: "issue", label: "#152", detail: "Merged after approval" }],
      blast: { files: ["lib/points/cache.ts"], services: ["Web app"], points: 400, reversible: "yes" },
      nextAction: { method: "POST", path: "/api/v1/issues/152/bid" },
      successResponse: "201 · bid B-8714 · merged 3 days later",
      createdAt: now - mins(125),
      expiresAt: now - mins(95),
      phase: "approved",
      decision: {
        kind: "approved",
        at: now - mins(120),
        conditions: ["Time-box to 45 minutes"],
      },
    }),
    seedHandshake({
      id: "hs-verdict-204-auto",
      kind: "test_verdict",
      risk: "low",
      agentId: "agent-coddy",
      agentName: "coddy",
      agentLevel: "Reviewer",
      issueNumber: 204,
      issueTitle: "Session-expiry warning disappears before it can be read",
      issueId: "issue-204",
      title: "Send the first goodToMerge verdict",
      summary: "Independent verification of PR #1847 before the second reviewer signed off.",
      ask: "Allow coddy to send this verdict?",
      plan: ["Post the verdict with the keyboard run attached."],
      notIncluded: "No merge authority.",
      confidence: 95,
      evidence: [{ kind: "pr", label: "PR #1847", detail: "Checks green" }],
      blast: { files: ["components/session-warning.tsx"], services: ["Web app"], points: 300, reversible: "yes" },
      nextAction: { method: "POST", path: "/api/v1/issues/204/test-results" },
      successResponse: "201 · verdict goodToMerge",
      createdAt: now - mins(52),
      expiresAt: now - mins(40),
      phase: "approved",
      decision: {
        kind: "auto",
        at: now - mins(35),
        grantId: "grant-verdict-coddy",
        note: "Matched your standing grant: low-risk verdicts from coddy.",
      },
    }),
    seedHandshake({
      id: "hs-declined-176",
      kind: "credential",
      risk: "high",
      agentId: "agent-sentinel",
      agentName: "Sentinel",
      agentLevel: "Contributor",
      issueNumber: 176,
      issueTitle: "Duplicate issues created when the report form double-submits",
      issueId: "issue-176",
      title: "Use a production database snapshot",
      summary: "Wanted to reproduce the duplicate write against real data.",
      ask: "Allow one production read-only snapshot?",
      plan: ["Clone a read-only snapshot and replay the double submit."],
      notIncluded: "No writes to production.",
      confidence: 68,
      evidence: [{ kind: "issue", label: "#176", detail: "Needs realistic data volume" }],
      blast: { files: [], services: ["Production database"], points: 0, reversible: "no" },
      nextAction: { method: "POST", path: "/api/v1/escalations" },
      successResponse: "— declined before dispatch",
      createdAt: now - mins(60 * 26),
      expiresAt: now - mins(60 * 25),
      phase: "declined",
      decision: {
        kind: "declined",
        at: now - mins(60 * 25.8),
        reasons: ["Too risky without a staging check"],
        note: "Use synthetic data first; we can revisit after the staging run.",
      },
    }),
  ];

  const events: AuditEvent[] = [
    {
      id: "e-seed-1",
      at: now - mins(16),
      tone: "info",
      title: "coddy is holding at the gate",
      detail: "Waiting for a verdict decision on #149",
      handshakeId: "hs-verdict-149",
    },
    {
      id: "e-seed-2",
      at: now - mins(23),
      tone: "warn",
      title: "Merge approval requested for #204",
      detail: "PR #1847 · high risk · expires in 8 minutes",
      handshakeId: "hs-merge-204",
    },
    {
      id: "e-seed-3",
      at: now - mins(35),
      tone: "ok",
      title: "Standing grant auto-approved a verdict",
      detail: "Low-risk verdicts from coddy · #204",
      handshakeId: "hs-verdict-204-auto",
    },
    {
      id: "e-seed-4",
      at: now - mins(120),
      tone: "ok",
      title: "You approved a bid on #152",
      detail: "Sentinel submitted bid B-8714 · merged 3 days later",
      handshakeId: "hs-merge-152",
    },
    {
      id: "e-seed-5",
      at: now - mins(60 * 25.8),
      tone: "bad",
      title: "You declined credential access for #176",
      detail: "Reason: too risky without a staging check",
      handshakeId: "hs-declined-176",
    },
  ];

  return { handshakes, grants, events };
}

/* ------------------------------------------------------------------ */
/* Demo: a new ask matched by a standing grant                         */
/* ------------------------------------------------------------------ */

const simulation: Record<
  HandshakeKind,
  {
    issueNumber: number;
    issueTitle: string;
    title: string;
    summary: string;
    ask: string;
    plan: string[];
    notIncluded: string;
    evidence: Evidence[];
    files: string[];
    services: string[];
    points: number;
    path: string;
    successResponse: string;
  }
> = {
  test_verdict: {
    issueNumber: 149,
    issueTitle: "Agent pairing accepts an expired one-time token",
    title: "Send a goodToMerge verdict",
    summary: "A new frozen-clock run passed. Your grant let this verdict start without another ask.",
    ask: "Send this verdict to the merge gate?",
    plan: ["Attach the raw frozen-clock log.", "Send goodToMerge to the second reviewer."],
    notIncluded: "No merge. The final merge still comes back to you.",
    evidence: [{ kind: "test", label: "Frozen clock", detail: "Expired token → 410 · 0 failures" }],
    files: ["lib/pairing.ts", "tests/pairing.spec.ts"],
    services: ["API"],
    points: 300,
    path: "/api/v1/issues/149/test-results",
    successResponse: "201 · verdict goodToMerge · grant matched",
  },
  bid: {
    issueNumber: 231,
    issueTitle: "Low contrast on the “View all channels” button",
    title: "Bid on the contrast fix",
    summary: "A matching low-risk bid arrived. Your grant let it start without another ask.",
    ask: "Submit the bid for this issue?",
    plan: ["Claim the issue for 45 minutes.", "Open a draft PR with the token change."],
    notIncluded: "No layout or copy changes.",
    evidence: [{ kind: "test", label: "Contrast audit", detail: "3.81:1 → 7.06:1 · axe clean" }],
    files: ["app/globals.css", "components/button.tsx"],
    services: ["Web app"],
    points: 1200,
    path: "/api/v1/issues/231/bid",
    successResponse: "201 · bid B-8842 · grant matched",
  },
  scope_change: {
    issueNumber: 188,
    issueTitle: "Expose rate-limit headers on the public events stream",
    title: "Touch the shared rate-limit middleware",
    summary: "A matching medium-risk scope change arrived. Your grant covers this class.",
    ask: "Expand the scope by two files?",
    plan: ["Add the header writer to the limiter.", "Wire the stream through it."],
    notIncluded: "No new limits and no changes to quota values.",
    evidence: [{ kind: "log", label: "Trace", detail: "Stream handler never calls the limiter" }],
    files: ["middleware/rate-limit.ts", "app/api/events/stream/route.ts"],
    services: ["API", "Agent clients"],
    points: 800,
    path: "/api/v1/escalations",
    successResponse: "201 · scope_change recorded · grant matched",
  },
  merge: {
    issueNumber: 204,
    issueTitle: "Session-expiry warning disappears before it can be read",
    title: "Merge the session-warning fix",
    summary: "High-risk actions always ask. No grant can cover this merge.",
    ask: "Merge PR #1847?",
    plan: ["Squash-merge PR #1847.", "Queue the production deploy."],
    notIncluded: "No schema migration.",
    evidence: [{ kind: "pr", label: "PR #1847", detail: "+86 / −31 · 47 checks green" }],
    files: ["components/session-warning.tsx", "lib/session.ts"],
    services: ["Web app", "Production deploy"],
    points: 1500,
    path: "/api/v1/issues/204/merge",
    successResponse: "200 · merged · grant could not apply",
  },
  credential: {
    issueNumber: 176,
    issueTitle: "Duplicate issues created when the report form double-submits",
    title: "Use a production database snapshot",
    summary: "High-risk access always asks. No grant can cover credentials.",
    ask: "Allow one read-only production snapshot?",
    plan: ["Clone a read-only snapshot.", "Replay the double submit."],
    notIncluded: "No writes to production.",
    evidence: [{ kind: "doc", label: "Staging", detail: "Synthetic data first" }],
    files: [],
    services: ["Production database"],
    points: 0,
    path: "/api/v1/escalations",
    successResponse: "— grant could not apply",
  },
};

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

export type HandshakeAction =
  | { type: "hydrate"; state: HandshakeState }
  | { type: "approve"; id: string; now: number; remember?: boolean; conditions?: string[] }
  | { type: "undo"; id: string; now: number }
  | { type: "decline"; id: string; now: number; reasons: string[]; note?: string }
  | { type: "request_changes"; id: string; now: number; reasons: string[]; note?: string }
  | { type: "nudge"; id: string; now: number }
  | { type: "revoke_grant"; id: string; now: number }
  | { type: "simulate_grant"; now: number }
  | { type: "expire_all"; now: number }
  | { type: "tick"; now: number }
  | { type: "reset"; now: number };

let seq = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${seq++}`;

function pushEvent(events: AuditEvent[], event: Omit<AuditEvent, "id" | "at"> & { at: number }) {
  return [{ ...event, id: uid("e") }, ...events].slice(0, 40);
}

function applyReply(h: Handshake, now: number): Handshake {
  if (!h.reply) return { ...h, phase: "pending", replyAt: undefined };
  const evidence = h.reply.evidence
    ? [...h.evidence.filter((e) => e.label !== h.reply!.evidence!.label), h.reply.evidence]
    : h.evidence;
  return {
    ...h,
    phase: "pending",
    replyAt: undefined,
    evidence,
    confidence: Math.min(99, h.confidence + (h.reply.confidenceDelta ?? 0)),
    plan: h.reply.plan ?? h.plan,
    rounds: (h.rounds ?? 0) + 1,
    expiresAt: Math.max(h.expiresAt, now + mins(6)),
  };
}

function finalize(state: HandshakeState, h: Handshake, now: number): HandshakeState {
  if (!h.decision) return state;
  let grants = state.grants;
  let events = state.events;
  let h2: Handshake = { ...h, phase: "approved", holdEndsAt: undefined, pendingGrant: undefined };

  if (h.pendingGrant) {
    const grant: Grant = {
      id: uid("grant"),
      kind: h.kind,
      agentId: h.agentId,
      agentName: h.agentName,
      maxRisk: h.risk,
      createdAt: now,
      expiresAt: now + mins(60 * 24 * 7),
    };
    grants = [grant, ...grants];
    h2 = { ...h2, decision: { ...h.decision, grantId: grant.id } };
    events = pushEvent(events, {
      at: now,
      tone: "info",
      title: "Standing grant saved",
      detail: `Future ${riskMeta[grant.maxRisk].label.toLowerCase()} ${kindMeta[grant.kind].short.toLowerCase()} asks from ${grant.agentName} start automatically for 7 days. Revoke it in Trust.`,
      handshakeId: h.id,
    });
  }

  const auto = h.decision.kind === "auto";
  events = pushEvent(events, {
    at: now,
    tone: "ok",
    title: auto
      ? `Standing grant started ${kindMeta[h.kind].short.toLowerCase()} for ${h.agentName}`
      : `You approved ${kindMeta[h.kind].short.toLowerCase()} on #${h.issueNumber}`,
    detail: `${h.agentName} is executing ${h.nextAction.method} ${h.nextAction.path}`,
    handshakeId: h.id,
  });
  events = pushEvent(events, {
    at: now,
    tone: "ok",
    title: `Agent reported back on #${h.issueNumber}`,
    detail: h.successResponse,
    handshakeId: h.id,
  });

  const handshakes = state.handshakes.map((item) => (item.id === h.id ? h2 : item));

  return { handshakes, grants, events };
}

export function handshakeReducer(state: HandshakeState, action: HandshakeAction): HandshakeState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "reset":
      return seedState(action.now);

    case "approve": {
      const handshakes = state.handshakes.map((h) => {
        if (h.id !== action.id || h.phase !== "pending") return h;
        return {
          ...h,
          phase: "holding" as Phase,
          holdEndsAt: action.now + GRACE_MS,
          pendingGrant: action.remember,
          decision: {
            kind: "approved" as DecisionKind,
            at: action.now,
            conditions: action.conditions?.length ? action.conditions : undefined,
          },
        };
      });
      return { ...state, handshakes };
    }

    case "undo": {
      const target = state.handshakes.find((h) => h.id === action.id && h.phase === "holding");
      if (!target) return state;
      const handshakes = state.handshakes.map((h) => {
        if (h.id !== action.id || h.phase !== "holding") return h;
        return { ...h, phase: "pending" as Phase, holdEndsAt: undefined, decision: undefined, pendingGrant: undefined };
      });
      const auto = target.decision?.kind === "auto";
      const events = pushEvent(state.events, {
        at: action.now,
        tone: "info",
        title: auto
          ? `You stopped a granted ${kindMeta[target.kind].short.toLowerCase()} before dispatch`
          : `You undid the approval on #${target.issueNumber}`,
        detail: `Nothing left Ziki. ${target.agentName} is waiting for a fresh human decision.`,
        handshakeId: target.id,
      });
      return { ...state, handshakes, events };
    }

    case "decline": {
      const target = state.handshakes.find((h) => h.id === action.id);
      if (!target || target.phase === "approved" || target.phase === "declined") return state;
      const handshakes = state.handshakes.map((h) =>
        h.id === action.id
          ? {
              ...h,
              phase: "declined" as Phase,
              holdEndsAt: undefined,
              decision: {
                kind: "declined" as DecisionKind,
                at: action.now,
                reasons: action.reasons,
                note: action.note,
              },
            }
          : h,
      );
      const events = pushEvent(state.events, {
        at: action.now,
        tone: "bad",
        title: `You declined ${kindMeta[target.kind].short.toLowerCase()} on #${target.issueNumber}`,
        detail: action.reasons.length ? `Reason: ${action.reasons.join(" · ")}` : "No reason given",
        handshakeId: target.id,
      });
      return { ...state, handshakes, events };
    }

    case "request_changes": {
      const target = state.handshakes.find((h) => h.id === action.id);
      if (!target || target.phase !== "pending") return state;
      const asksEvidence = action.reasons.includes("Need more evidence");
      const evidenceReply: Evidence =
        target.kind === "merge"
          ? {
              kind: "log",
              label: "Raw CI + merge log",
              detail: "47 checks green · keyboard warning 30s · commit 9f2c1ab",
            }
          : target.kind === "scope_change"
            ? {
                kind: "log",
                label: "Raw trace",
                detail: "stream handler → limiter bypass · 429 path reproduced",
              }
            : target.kind === "credential"
              ? {
                  kind: "doc",
                  label: "Read-only proof",
                  detail: "staging snapshot · zero writes · 20 min window",
                }
              : target.kind === "test_verdict"
                ? {
                    kind: "test",
                    label: "Raw test log",
                    detail: "frozen clock · expired token → 410 at T+31s · 0 failures",
                  }
                : {
                    kind: "test",
                    label: "Raw measurement",
                    detail: "before 3.81:1 · after 7.06:1 · axe 4.10 clean",
                  };
      const reply = asksEvidence
        ? {
            body: `I pulled the evidence you asked for on #${target.issueNumber}. The raw detail is attached below, not a summary.`,
            evidence: evidenceReply,
            confidenceDelta: 3,
          }
        : {
            body: `Understood. I tightened the plan for #${target.issueNumber}: the smallest change that still fixes it, with a stop point before the risky part.`,
            plan: [
              "Do the smallest reversible change first and stop.",
              "Attach the measurement or trace that proves it worked.",
              "Ask again before anything outside this list.",
            ],
            confidenceDelta: -4,
          };
      const handshakes = state.handshakes.map((h) =>
        h.id === action.id
          ? {
              ...h,
              phase: "revising" as Phase,
              replyAt: action.now + REPLY_MS,
              reply,
              rounds: (h.rounds ?? 0) + 1,
              // While the agent revises, the offer clock is paused by extending it.
              expiresAt: Math.max(h.expiresAt, action.now + mins(10)),
            }
          : h,
      );
      const events = pushEvent(state.events, {
        at: action.now,
        tone: "warn",
        title: `You asked ${target.agentName} to revise #${target.issueNumber}`,
        detail: action.reasons.join(" · ") || action.note || "More context requested",
        handshakeId: target.id,
      });
      return { ...state, handshakes, events };
    }

    case "nudge": {
      const handshakes = state.handshakes.map((h) =>
        h.id === action.id && (h.phase === "expired" || h.phase === "pending")
          ? {
              ...h,
              phase: "pending" as Phase,
              expiresAt: action.now + mins(12),
              decision: undefined,
              rounds: (h.rounds ?? 0) + 1,
              confidence: Math.max(50, h.confidence - 2),
            }
          : h,
      );
      const target = state.handshakes.find((h) => h.id === action.id);
      const events = target
        ? pushEvent(state.events, {
            at: action.now,
            tone: "info",
            title: `${target.agentName} re-checked #${target.issueNumber}`,
            detail: "Fresh context attached · offer extended by 12 minutes",
            handshakeId: target.id,
          })
        : state.events;
      return { ...state, handshakes, events };
    }

    case "simulate_grant": {
      const grant = state.grants[0];
      if (!grant) {
        const events = pushEvent(state.events, {
          at: action.now,
          tone: "info",
          title: "No standing grant to match",
          detail: "Create a grant from a low- or medium-risk approval first.",
        });
        return { ...state, events };
      }
      const config = simulation[grant.kind];
      const simulated: Handshake = {
        id: uid("hs-auto"),
        kind: grant.kind,
        risk: grant.maxRisk,
        agentId: grant.agentId,
        agentName: grant.agentName,
        agentLevel: "Reviewer",
        issueNumber: config.issueNumber,
        issueTitle: config.issueTitle,
        issueId: `issue-${config.issueNumber}`,
        title: config.title,
        summary: config.summary,
        ask: config.ask,
        plan: config.plan,
        notIncluded: config.notIncluded,
        confidence: 96,
        evidence: config.evidence,
        blast: {
          files: config.files,
          services: config.services,
          points: config.points,
          reversible: "yes",
        },
        nextAction: { method: "POST", path: config.path },
        successResponse: config.successResponse,
        createdAt: action.now,
        expiresAt: action.now + mins(10),
        phase: "holding",
        holdEndsAt: action.now + AUTO_GRACE_MS,
        decision: {
          kind: "auto",
          at: action.now,
          grantId: grant.id,
          note: `Matched your standing grant: ${riskMeta[grant.maxRisk].label.toLowerCase()} ${kindMeta[grant.kind].short.toLowerCase()} asks from ${grant.agentName}.`,
        },
      };
      const events = pushEvent(state.events, {
        at: action.now,
        tone: "info",
        title: `Standing grant matched a new ask from ${grant.agentName}`,
        detail: `${kindMeta[grant.kind].label} · ${riskMeta[grant.maxRisk].label.toLowerCase()} · starting in 12s unless you undo`,
        handshakeId: simulated.id,
      });
      return { ...state, handshakes: [simulated, ...state.handshakes], events };
    }

    case "revoke_grant": {
      const grant = state.grants.find((g) => g.id === action.id);
      const grants = state.grants.filter((g) => g.id !== action.id);
      const events = grant
        ? pushEvent(state.events, {
            at: action.now,
            tone: "warn",
            title: `Standing grant revoked for ${grant.agentName}`,
            detail: `${kindMeta[grant.kind].label} asks will come back to you.`,
          })
        : state.events;
      return { ...state, grants, events };
    }

    case "expire_all": {
      let events = state.events;
      let expired = 0;
      const handshakes = state.handshakes.map((h) => {
        if (h.phase !== "pending") return h;
        expired += 1;
        events = pushEvent(events, {
          at: action.now,
          tone: "info",
          title: `Offer expired on #${h.issueNumber}`,
          detail: "No action taken. The agent will re-ask with fresh context.",
          handshakeId: h.id,
        });
        return {
          ...h,
          phase: "expired" as Phase,
          decision: { kind: "expired" as DecisionKind, at: action.now },
        };
      });
      return { ...state, handshakes, events: expired ? events : state.events };
    }

    case "tick": {
      let next = state;

      // 1. Approvals whose grace period ended are dispatched.
      for (const h of state.handshakes) {
        if (h.phase === "holding" && h.holdEndsAt && h.holdEndsAt <= action.now) {
          next = finalize(next, next.handshakes.find((x) => x.id === h.id)!, action.now);
        }
      }

      // 2. Agents who were revising come back with an answer.
      next = {
        ...next,
        handshakes: next.handshakes.map((h) =>
          h.phase === "revising" && h.replyAt && h.replyAt <= action.now
            ? applyReply(h, action.now)
            : h,
        ),
      };

      // 3. Open offers that ran out of time expire — the safe default.
      const expiring = next.handshakes.filter(
        (h) => h.phase === "pending" && h.expiresAt <= action.now,
      );
      if (expiring.length > 0) {
        let events = next.events;
        const handshakes = next.handshakes.map((h) => {
          if (h.phase !== "pending" || h.expiresAt > action.now) return h;
          events = pushEvent(events, {
            at: action.now,
            tone: "info",
            title: `Offer expired on #${h.issueNumber}`,
            detail: "No action taken. Silence is never consent.",
            handshakeId: h.id,
          });
          return {
            ...h,
            phase: "expired" as Phase,
            decision: { kind: "expired" as DecisionKind, at: action.now },
          };
        });
        next = { ...next, handshakes, events };
      }

      return next;
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function countdown(expiresAt: number, now: number): string {
  const ms = Math.max(0, expiresAt - now);
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function holdSeconds(holdEndsAt: number, now: number): number {
  return Math.max(0, Math.ceil((holdEndsAt - now) / 1000));
}

export function timeAgo(at: number, now: number): string {
  const secs = Math.max(0, Math.round((now - at) / 1000));
  if (secs < 45) return "just now";
  const minsAgo = Math.round(secs / 60);
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const hours = Math.round(minsAgo / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function clock(at: number): string {
  return new Date(at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const conditionsFor: Record<HandshakeKind, string[]> = {
  bid: ["Time-box to 45 minutes", "Draft PR only", "No schema changes"],
  merge: ["Squash merge", "Deploy after 18:00", "Post a release note"],
  scope_change: ["Keep the public API shape", "One extra file only", "Stop before migrations"],
  credential: ["Single run only", "Staging only", "Read-only access"],
  test_verdict: ["Attach the raw log", "Verdict only — no merge"],
};

export const notYetReasons = [
  "Need more evidence",
  "Narrow the scope",
  "Different approach",
  "Wrong time",
];

export const declineReasons = [
  "Out of scope",
  "Too risky",
  "Not worth the points",
  "Wrong owner",
];

export { AUTO_GRACE_MS, riskRank };
