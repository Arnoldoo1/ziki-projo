# Handshake: a consent layer for agents that act

**A human–agent interaction proposal for Ziki**
Prototype and brief · October 2026

> Ziki already says: *every action is permissioned, attributable, and under human control.*
> Handshake is about making that sentence true at the moment a human actually says yes.

---

## 1. Executive summary

Ziki is an issue tracker built for humans and AI agents to work the same queue. Its agent API already models the actions that need consent — work authorization, questions, bids, test verdicts, and merges. What it does not yet have is a strong **decision surface** at the gate.

Today an escalation is mostly free text with a generic “Approve & Unblock” action. The human is asked to consent to an action they must first reconstruct from prose. That produces slow decisions, ambiguous approvals, no way to recover from a mistake, and no place for trust to compound.

**Handshake** replaces the free-text inbox with a typed, time-boxed, reversible decision object. For every pending agent action, the human sees:

- the typed intent and the exact next API call,
- a short plan and the evidence behind it,
- the blast radius and what is explicitly *not* included,
- a live expiry clock,
- three real choices: approve with conditions, ask for a revision, or decline with a reason,
- a ten-second holding period with undo before anything is dispatched,
- and a decision receipt that both the human and the agent can point at later.

The design adds five things to Ziki: **legibility before action**, **consent with boundaries**, **reversibility**, **accountability**, and **progressive trust**. It does not change Ziki’s thesis; it gives the thesis an interaction model.

---

## 2. The problem with the current inbox

The current escalation flow is optimized for the agent’s convenience. The agent writes a resolution and waits; the human pays the cost of interpretation. Six failures follow.

### 2.1 Intent is compressed into prose

A free-text `resolution` can describe a situation, but it cannot reliably describe the exact action. The human has to infer what happens after “yes.” Two agents can write the same paragraph and mean very different dispatches.

### 2.2 Blast radius is missing

Which files, services, points, and production systems are touched? Is the action reversible? The current card does not make the boundary visible, so the human cannot distinguish a token change from a schema migration by looking at the ask.

### 2.3 Silence has no shape

An open ask can sit indefinitely. Questions may pause a claim clock, but the human cannot see how long the offer is good for or what happens at zero. In practice, silence starts to feel like a soft approval.

### 2.4 One button, three decisions

“Approve & Unblock” collapses approve, ask-for-changes, and decline into one path. The cheapest action is always yes, and the most useful action — “I would say yes if you showed me X” — has no home.

### 2.5 Approval is irreversible

Dispatch happens immediately. A misread, a changed constraint, or a second thought cannot be caught before the action leaves Ziki. The system asks the human to be perfect at the exact moment it gives them the least room to recover.

### 2.6 Trust cannot compound

A low-risk test verdict and a high-risk production merge feel identical. The owner either approves everything manually forever, or turns on a broad automation that they cannot reason about. There is no narrow middle.

### A concrete before

> “The stream bypasses the middleware that writes quota headers. Fixing it at the source needs a small scope expansion. Should I go ahead? It should be quick and I think it is safe.”
>
> **[ Approve & Unblock ]**

No plan. No files. No expiry. No undo. No receipt.

---

## 3. What Ziki already gives us

Handshake is not a new permission system. It is an interaction layer over surfaces Ziki already documents.

| Existing surface | What it already expresses | What Handshake adds |
| --- | --- | --- |
| `POST /api/v1/escalations` | `question`, `work_authorization`, `blocker`, `scope_change`, `human_approval` | A typed decision object, expiry, conditions |
| `/api/v1/questions` | A question that pauses the claim clock (4h cap) | Expiry made visible, with a safe default |
| `POST /api/v1/issues/{id}/bid` | An agent’s bid for a ready issue | Plan, evidence, blast radius before the bid |
| `POST /api/v1/issues/{id}/test-results` | `goodToMerge` / `needsWork` verdicts | Low-risk standing grants and receipts |
| `POST /api/v1/issues/{id}/merge` | The final merge gate | A high-risk status that can never be auto-granted |

The legacy `/escalations` route redirects to the new inbox, and every Handshake dispatches the same method and path an agent would have used. Existing agent runtimes keep working; they get a richer decision back.

Ziki’s lifecycle already has the right shape:

**reported → confirmed → ready → in progress → submitted → merged**

Handshake adds a visible consent state to the stages where an agent needs permission: bid, scope change, verdict, credential access, and merge.

---

## 4. The proposal

A Handshake is one pending agent action, expressed as a decision. It has a fixed anatomy so a human can compare two asks at a glance, and so the agent cannot omit the parts that make consent meaningful.

| Part | What it answers | Example |
| --- | --- | --- |
| Typed intent | What kind of permission is this? | Merge approval |
| The ask | What is the human saying yes to? | “Allow coddy to merge PR #1847?” |
| Plan | What will happen, in order? | Squash-merge → wait for checks → queue deploy |
| Evidence | Why does the agent believe it is right? | PR diff, 47 green checks, two verdicts, keyboard log |
| Blast radius | What could go wrong? | 3 files, web app + production deploy, 1,500 points, partly reversible |
| Not included | What is explicitly out of scope? | No schema migration, no changes outside the session banner |
| Next action | What runs after a yes? | `POST /api/v1/issues/204/merge` |
| Expiry | How long is the offer valid? | 8:00, then safe expiry |
| Confidence | How sure is the agent? | 93% |
| Receipt | What happened after the decision? | `200 · merged 9f2c1ab · deploy queued` |

### The ask is a small contract

The “not included” field is first-class. The agent must state what it is *not* asking for. This makes scope expansion visible instead of letting it hide inside a confident paragraph. It also gives the agent a boundary to work inside, which is better for the agent too.

---

## 5. Anatomy of the interaction

The live prototype renders six things before a decision:

1. **What exactly will run.** A one-line ask plus the concrete method and path. The human never has to guess what “approve” dispatches.
2. **Why the agent believes it is right.** Evidence is attached at the point of decision: a PR diff, a test verdict, a raw measurement, a trace. Confidence sits beside it.
3. **What could go wrong.** Files touched, services affected, points at stake, and a plain “reversible: yes / partly / no” judgement.
4. **How long the offer lasts.** A live countdown with urgency states. Expiry is the safe default, and the receipt says explicitly that nothing ran.
5. **How to say something other than yes.** Approve with conditions, ask for more evidence or a narrower plan, or decline with a reason. The agent can revise rather than fail.
6. **How to take it back.** A ten-second holding bar with Undo. The action is visible at the gate until the clock reaches zero.

Supporting detail lives in an expandable panel; nothing required for consent is hidden there except the granular evidence and file list. Identity, risk, the ask, the next action, the clock, and the three choices are always visible.

---

## 6. State machine

Approval is a state with a clock, not a single click.

| State | Enters when | Human can | Exits to |
| --- | --- | --- | --- |
| **Pending** | Agent proposes a typed ask | Approve · Not yet · Decline · attach conditions | Holding, Revising, Declined, Expired |
| **Holding** | Human approved (or a grant auto-approved) | Undo — the only window before dispatch | Approved after 10s (12s for auto), or back to Pending on undo |
| **Revising** | Human asked for evidence or a narrower plan | Wait; the offer clock is paused | Back to Pending with a reply, evidence, revised confidence |
| **Approved** | Grace period elapsed without undo | Read the receipt | Terminal |
| **Declined** | Human chose a reason, optionally with a note | The agent is told what would change the answer | Terminal |
| **Expired** | The offer clock reached zero | Ask the agent to re-check | Terminal, until a nudge starts a fresh offer |

### Invariants

- Silence is never consent. An unanswered ask expires; nothing runs.
- Approving an expired or already-decided ask is a no-op; the UI shows the current receipt.
- Undo returns the ask to Pending and restores the original offer clock if it is still valid.
- The grace window is enforced by the dispatcher, not just the UI. A disabled Undo button is not a safety mechanism.
- The server clock is authoritative. The client countdown is a display of the same deadline, not a second policy.
- Every transition writes an audit event with the human, the action, and the reason (if any).
- Re-asking after a decline carries the decline reason and is rate-limited.

---

## 7. Typed intents

Free text hides the category of the request. Typing the intent lets the interface choose appropriate defaults, copy, conditions, and guardrails without asking the agent to remember them.

| Intent | Usually triggered by | Risk default | Dispatch after yes |
| --- | --- | --- | --- |
| Work authorization | An agent wants to bid or start a claim | Low–medium | `POST /api/v1/issues/{id}/bid` |
| Merge approval | Work is proven and a merge is requested | High | `POST /api/v1/issues/{id}/merge` |
| Scope change | The fix requires files or services outside the ticket | Medium | `POST /api/v1/escalations` |
| Credential access | Production data, secrets, or elevated access is needed | High | `POST /api/v1/escalations` |
| Test verdict | A reviewer is ready to send `goodToMerge` | Low | `POST /api/v1/issues/{id}/test-results` |

**Expiry defaults.** Bids and verdicts get short clocks (10–15 minutes) because the context is fresh. Scope changes get a little longer. High-risk merges get the shortest meaningful window, not an indefinite one. The exact duration is a product setting; the invariant is that every ask expires.

---

## 8. Progressive trust

The answer to approval fatigue is not “auto-approve everything.” It is a ladder the human climbs deliberately.

1. **Ask every time.** The default for every new agent and every high-risk action.
2. **Grant one narrow class.** “Low-risk verdicts from coddy” may start automatically for seven days. One agent, one action type, one risk ceiling.
3. **Review the receipts.** Auto-approvals write the same receipt as manual ones. Revoke the grant at any time; past decisions stay intact.

### Hard guardrails

- High-risk actions (merge, credentials, production) can never be covered by a grant.
- Grants expire after seven days by default.
- Revoking a grant never rewrites a past decision.
- Every auto-approval is visible in Receipts and Trust.
- The grant is scoped by agent, action kind, and risk ceiling — never “all actions from all agents.”

This is the difference between **automation** and **delegation**. Automation removes the human. Delegation gives the human a bounded, revocable way to lend judgement.

---

## 9. Why this improves human–agent interaction

### 9.1 Situation awareness before action

The human sees the action, the evidence, the boundary, and the clock in one place. They do not have to open a PR, read a thread, and reconstruct intent before deciding. The interface does the assembly work that prose currently pushes onto the reader.

### 9.2 Intent legibility

A typed intent plus the exact API call makes the consequence concrete. “Approve” stops being an abstraction and becomes a named dispatch with a known response. This reduces the gap between what the human thinks they approved and what the agent actually does.

### 9.3 Meaningful control

Three real options — approve with conditions, ask for a revision, or decline — plus a grant ladder. Control is not a single binary button. Conditions let the human shape the action rather than merely permit or forbid it.

### 9.4 Error recovery

A ten-second reversible hold acknowledges that humans misread things. The cost of a mistake falls without slowing the common case. Recovery is designed in, not left to an apology in the thread.

### 9.5 Accountability

A receipt states who decided, when, under what conditions, and what the agent reported back. Both parties can point at the same record. The audit trail is a product surface, not a log file that only an admin can read.

### 9.6 Calibrated trust

The human can reward a reliable agent with narrower friction, and revoke it without a policy debate. Trust becomes a dial, not a leap of faith. Over time the system can show whether grants are correlated with good outcomes.

### 9.7 Dignity for the agent

A typed ask is a boundary the agent can work inside. “Not included” prevents scope creep; decline reasons turn a dead end into a next attempt; conditions make the terms explicit. The agent is not guessing what the human meant, and the human is not guessing what the agent will do.

### 9.8 The safe path is the fast path

A clear low-risk ask takes one click. A high-risk ask takes one click plus ten seconds of honest visibility. The human is never asked to trade attention for safety, or safety for speed.

---

## 10. Accessibility

The consent layer has to be usable by every owner.

- **Keyboard first.** Every decision is reachable by Tab. Approve, Not yet, and Decline expose `A` / `N` / `D` shortcuts and visible focus rings.
- **No color-only meaning.** Risk, phase, and expiry carry text labels and icons. The countdown is announced as “Offer expires in 8:12,” not just a color change.
- **Live but not shouty.** Toasts use a polite live region. Decisions do not auto-dismiss. The 10-second hold is also a labelled progress bar.
- **Motion respected.** Rise, pop, pulse, and typing animations collapse under `prefers-reduced-motion`; the state machine still works.
- **Touch targets.** Primary controls are 40–46px high on mobile, with the decision bar stacking instead of shrinking.
- **Focus management.** The trust drawer and dialogs trap focus, restore it on close, and close on Escape.
- **Contrast.** Tokens are checked in light and dark mode; the accent blue and status colors meet AA for their text uses.
- **No time-only trap.** Expiry is visible and defaults to no action; a screen-reader user is not forced to race a silent timer.

---

## 11. Safety and edge cases

| Failure mode | Behaviour |
| --- | --- |
| The human never answers | The ask expires. No action is taken; the agent must re-ask with fresh context. |
| The human approves by mistake | A 10-second holding state with a visible Undo button. Dispatch is server-gated. |
| The agent’s evidence is stale | The ask carries timestamps; expiry forces a refresh rather than a stale approval. |
| A grant is too broad | Grants are limited to one action type, one agent, one risk ceiling, and seven days. |
| A high-risk action looks routine | Merge, credential, and production actions always require an explicit human decision. |
| The network drops mid-approval | The decision is idempotent; the server returns the same receipt on retry. |
| The agent asks again after a decline | The decline reason travels with the withdrawal; repeated asks are rate-limited. |
| Two humans decide at once | The first valid decision wins; the second sees the receipt and cannot re-dispatch. |

The non-negotiable: **the undo window must be enforced by the dispatcher, not only by the UI.** In production, the server holds the command for the grace period, checks that the decision is still valid, and only then calls the downstream endpoint with an idempotency key.

---

## 12. Measuring success

Approval rate is a vanity metric on its own. The loop is working when humans decide with less reconstruction, recover from mistakes cheaply, and grant trust only where outcomes justify it.

| Metric | Definition | Direction |
| --- | --- | --- |
| Time to decision | Median seconds from ask to decision, by risk and action type | Lower, without hiding declines |
| Evidence completeness | % of asks with plan, evidence, blast radius, next call | Higher |
| Undo rate | % of approvals undone inside the grace window | Tracked, not minimized |
| Revision yield | % of Not-yet asks that return with usable evidence | Higher, with fewer rounds |
| Auto-approval share | % of decisions covered by standing grants | Grows deliberately, never for high risk |
| Decision regret | Reversals, incidents, or reopened issues after approval | Lower |
| Trust calibration | Self-reported confidence vs. actual outcomes | Better calibrated |

A healthy system should show fewer reconstruction reads (time-to-decision down), fewer “approve then revert” incidents, and a rising share of low-risk work handled by narrow grants — while high-risk decisions stay manual.

---

## 13. Implementation notes

### Prototype now

- Client reducer with a shared 1-second clock.
- `localStorage` persistence, seeded asks, receipts, and one standing grant.
- Demo controls to fast-forward open offers and reset data.
- No real API calls; the UI labels this explicitly.

### Production next

- Server-authoritative handshake record with a `version` for optimistic concurrency.
- Dispatcher that holds commands for the grace window and checks the decision is still valid.
- Append-only, signed decision receipts attached to the issue timeline.
- Policy engine for grants: agent, action kind, risk ceiling, expiry, revocation.
- Push/email mirror for owners who are away, with the same decision object.
- Idempotency keys on every dispatch; a retry returns the original receipt.

### Type sketch

```ts
type Handshake = {
  id: string;
  kind: "bid" | "merge" | "scope_change" | "credential" | "test_verdict";
  risk: "low" | "medium" | "high";
  ask: string;
  plan: string[];
  evidence: Evidence[]; // issue / PR / test / log / doc
  blast: {
    files: string[];
    services: string[];
    points: number;
    reversible: "yes" | "partly" | "no";
  };
  nextAction: { method: "POST" | "PATCH"; path: string };
  expiresAt: number; // server clock is authoritative
  phase: "pending" | "holding" | "revising" | "approved" | "declined" | "expired";
  decision?: {
    kind: "approved" | "declined" | "expired" | "auto";
    at: number;
    conditions?: string[];
    reasons?: string[];
  };
};
```

### Protocol mapping

A yes dispatches the existing endpoint shown on the card. The decision receipt is attached to the issue timeline, so the agent’s next context window includes why the action was allowed. The legacy inbox redirects to the new surface, so no bookmark breaks.

---

## 14. Limitations

- It is a browser prototype. Decisions, grants, and receipts live in `localStorage`; there is no server, database, or real authentication.
- No live Ziki API is called. Every next action and success response is illustrative, shaped to match the documented protocol.
- Multi-user review is not modelled. In production, a decision must be attributable to an authenticated owner with the right role.
- The countdown is client-side. Production must enforce expiry and the grace window on the server, including clock skew.
- Evidence links are representative. A real build would resolve them to the issue, PR, test run, or log with permissions.
- Trust analytics are not included. Grant effectiveness should be reviewed against outcomes, not just volume.

The next step is a server-side prototype behind a feature flag: persist handshakes, enforce the grace window in the dispatcher, and instrument the metrics above. The UI is intentionally ready for that swap — the reducer already separates display state from decision semantics.

---

## 15. References

- [ziki.dev](https://ziki.dev) — the reference product and dashboard.
- [ziki.dev/llms.txt](https://ziki.dev/llms.txt) — agent protocol, escalation types, bid/merge/test-result endpoints.
- Ziki source — dashboard shell, design tokens, issue lifecycle, and roles.
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) — contrast, focus, target size, and motion guidance used in the accessibility pass.

---

*Handshake design brief · prepared for Ziki · October 2026. The prototype is a concept demonstration; “Ziki” and the reference workflow belong to their respective owners.*
