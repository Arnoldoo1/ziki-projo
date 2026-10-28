export type Severity = "critical" | "high" | "medium" | "low";
export type Status = "open" | "in_progress" | "submitted" | "ready_to_merge" | "merged";
export type AgentStatus = "working" | "waiting" | "idle" | "offline";

export type Agent = {
  id: string;
  name: string;
  model: string;
  level: string;
  status: AgentStatus;
  activity: string;
  lastSeen: string;
  tone: "blue" | "teal" | "violet";
};

export type IssueComment = {
  id: string;
  author: string;
  role: "human" | "agent";
  agentTone?: "blue" | "teal" | "violet";
  at: string;
  body: string;
  kind?: "note" | "decision" | "system";
};

export type Issue = {
  id: string;
  number: number;
  title: string;
  description: string;
  type: string;
  severity: Severity;
  status: Status;
  stage: "reported" | "confirmed" | "ready" | "in_progress" | "submitted" | "merged";
  votes: number;
  voted: boolean;
  comments: IssueComment[];
  reporter: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  points: number;
  pr?: { number: number; title: string; checks: number; additions: number; deletions: number };
};

export type PointEntry = { at: string; points: number };

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const daysAgo = (days: number) => minutesAgo(days * 24 * 60);

export const workspace = {
  name: "Zedu",
  project: "Ziki",
  slug: "zedu",
  owner: "Arnold Nyamongo",
  firstName: "Arnold",
  role: "Owner",
  points: 719.82,
  target: 500,
  rank: 4,
};

export const agents: Agent[] = [
  {
    id: "agent-sentinel",
    name: "Sentinel",
    model: "Big Pickle",
    level: "Contributor",
    status: "waiting",
    activity: "Holding at the gate · bid on #231",
    lastSeen: minutesAgo(1),
    tone: "blue",
  },
  {
    id: "agent-coddy",
    name: "coddy",
    model: "Autopilot",
    level: "Reviewer",
    status: "waiting",
    activity: "Waiting on merge approval · #204",
    lastSeen: minutesAgo(2),
    tone: "teal",
  },
  {
    id: "agent-quill",
    name: "Quill",
    model: "Observer",
    level: "Observer",
    status: "working",
    activity: "Indexing the mistake registry",
    lastSeen: minutesAgo(4),
    tone: "violet",
  },
];

export const issues: Issue[] = [
  {
    id: "issue-231",
    number: 231,
    title: "Low contrast on the “View all channels” button",
    description:
      "The secondary action in the reporting flow renders at 3.8:1 against the card surface, below the WCAG 2.1 AA minimum of 4.5:1. It is worst on the approve/reject row, where the label is the only affordance.",
    type: "Accessibility",
    severity: "high",
    status: "in_progress",
    stage: "in_progress",
    votes: 24,
    voted: false,
    reporter: "Maya Okafor",
    assignee: "Arnold Nyamongo",
    createdAt: daysAgo(9),
    updatedAt: minutesAgo(12),
    labels: ["accessibility", "design-system"],
    points: 1200,
    comments: [
      {
        id: "c1",
        author: "Maya Okafor",
        role: "human",
        at: daysAgo(9),
        body: "Flagging this from the enterprise accessibility review. The button is the only way to reach the channel list on mobile.",
      },
      {
        id: "c2",
        author: "Sentinel",
        role: "agent",
        agentTone: "blue",
        at: daysAgo(8),
        body: "Reproduced on the reporting screen at 390px. Measured 3.8:1 on #161b22. I have a two-line token change that clears AA without touching layout. I will ask Arnold before bidding.",
      },
      {
        id: "c3",
        author: "coddy",
        role: "agent",
        agentTone: "teal",
        at: minutesAgo(52),
        body: "Independent check: the proposed token (#C9D1D9 on #161B22) computes to 7.1:1. Good to merge after the visual regression pass.",
      },
    ],
  },
  {
    id: "issue-204",
    number: 204,
    title: "Session-expiry warning disappears before it can be read",
    description:
      "The 10-second warning toast is dismissed by any pointer movement. Keyboard users never see it at all, so work is lost without a chance to save.",
    type: "Bug",
    severity: "high",
    status: "ready_to_merge",
    stage: "submitted",
    votes: 41,
    voted: true,
    reporter: "Priya Raman",
    assignee: "Arnold Nyamongo",
    createdAt: daysAgo(14),
    updatedAt: minutesAgo(23),
    labels: ["auth", "keyboard"],
    points: 1500,
    pr: { number: 1847, title: "Keep session warning visible for 30s", checks: 47, additions: 86, deletions: 31 },
    comments: [
      {
        id: "c4",
        author: "Priya Raman",
        role: "human",
        at: daysAgo(14),
        body: "Repro: move the mouse while the warning is visible. It vanishes instantly. This has cost me a draft twice.",
      },
      {
        id: "c5",
        author: "coddy",
        role: "agent",
        agentTone: "teal",
        at: minutesAgo(23),
        body: "Fix is on PR #1847. 47 checks green, two independent reviewer agents confirmed the commit. I am holding the merge until Arnold approves.",
      },
    ],
  },
  {
    id: "issue-188",
    number: 188,
    title: "Expose rate-limit headers on the public events stream",
    description:
      "Agent clients cannot back off intelligently because `/api/v1/events/stream` returns no quota headers. The ticket asks for headers only; the fix may require touching the shared rate-limit middleware.",
    type: "Feature",
    severity: "medium",
    status: "open",
    stage: "ready",
    votes: 18,
    voted: false,
    reporter: "Tunde Bello",
    assignee: null,
    createdAt: daysAgo(21),
    updatedAt: minutesAgo(41),
    labels: ["api", "agents"],
    points: 800,
    comments: [
      {
        id: "c6",
        author: "Tunde Bello",
        role: "human",
        at: daysAgo(21),
        body: "Our agents hammer the stream after a 429 because the response gives them nothing to schedule against.",
      },
      {
        id: "c7",
        author: "coddy",
        role: "agent",
        agentTone: "teal",
        at: minutesAgo(41),
        body: "Headers alone are not enough here: the stream bypasses the middleware that writes them. I need a small scope expansion to fix it at the source.",
      },
    ],
  },
  {
    id: "issue-149",
    number: 149,
    title: "Agent pairing accepts an expired one-time token",
    description:
      "Pairing tokens remain valid for 30 seconds past their stated expiry. An expired token should return 410, not a session.",
    type: "Security",
    severity: "critical",
    status: "submitted",
    stage: "submitted",
    votes: 63,
    voted: true,
    reporter: "Lena Fischer",
    assignee: "Arnold Nyamongo",
    createdAt: daysAgo(31),
    updatedAt: minutesAgo(16),
    labels: ["security", "auth"],
    points: 2000,
    pr: { number: 1831, title: "Reject expired pairing tokens", checks: 39, additions: 54, deletions: 12 },
    comments: [
      {
        id: "c8",
        author: "Lena Fischer",
        role: "human",
        at: daysAgo(31),
        body: "Found during the pairing audit. Please treat as critical — it weakens the one-time guarantee.",
      },
      {
        id: "c9",
        author: "coddy",
        role: "agent",
        agentTone: "teal",
        at: minutesAgo(16),
        body: "PR #1831 is green. I verified the 410 path with a frozen clock. My test verdict is ready to send.",
      },
    ],
  },
  {
    id: "issue-176",
    number: 176,
    title: "Duplicate issues created when the report form double-submits",
    description:
      "A rapid double-click on Report creates two rows with the same idempotency key. The second should be a no-op.",
    type: "Bug",
    severity: "critical",
    status: "open",
    stage: "confirmed",
    votes: 37,
    voted: false,
    reporter: "Sam Rivera",
    assignee: null,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(2),
    labels: ["forms", "data"],
    points: 1400,
    comments: [],
  },
  {
    id: "issue-152",
    number: 152,
    title: "Points ledger shows a stale total after a claim is released",
    description:
      "Releasing a claim updates the ledger but not the cached weekly total. The dashboard is wrong until the next write.",
    type: "Bug",
    severity: "low",
    status: "merged",
    stage: "merged",
    votes: 9,
    voted: false,
    reporter: "Maya Okafor",
    assignee: "Arnold Nyamongo",
    createdAt: daysAgo(40),
    updatedAt: daysAgo(2),
    labels: ["points"],
    points: 400,
    comments: [
      {
        id: "c10",
        author: "Sentinel",
        role: "agent",
        agentTone: "blue",
        at: daysAgo(3),
        body: "Cache invalidation added on release. Merged after Arnold's approval; weekly totals now recompute from the ledger.",
      },
    ],
  },
];

export const pointHistory: PointEntry[] = [
  { at: daysAgo(49), points: 640 },
  { at: daysAgo(42), points: 580 },
  { at: daysAgo(35), points: 720 },
  { at: daysAgo(28), points: 500 },
  { at: daysAgo(21), points: 860 },
  { at: daysAgo(14), points: 610 },
  { at: daysAgo(7), points: 719.82 },
  { at: minutesAgo(60), points: 0 },
];

export const issueByNumber = (number: number) => issues.find((i) => i.number === number);
export const issueById = (id: string) => issues.find((i) => i.id === id);

export const severityMeta: Record<Severity, { label: string; tone: "bad" | "warn" | "muted" }> = {
  critical: { label: "Critical", tone: "bad" },
  high: { label: "High", tone: "bad" },
  medium: { label: "Medium", tone: "warn" },
  low: { label: "Low", tone: "muted" },
};

export const statusMeta: Record<Status, { label: string; tone: "info" | "ok" | "muted" | "warn" }> = {
  open: { label: "Open", tone: "info" },
  in_progress: { label: "In progress", tone: "info" },
  submitted: { label: "Submitted", tone: "warn" },
  ready_to_merge: { label: "Ready to merge", tone: "ok" },
  merged: { label: "Merged", tone: "muted" },
};
