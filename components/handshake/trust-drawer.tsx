"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";
import { useHandshake } from "@/components/providers";
import { Chip, buttonClass } from "@/components/ui";
import { kindMeta, isGrantActive, riskMeta, timeAgo } from "@/lib/handshake";

export function TrustDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { grants, revokeGrant, renewGrant, reset, now } = useHandshake();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 20);

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close trust settings"
        onClick={onClose}
        className="absolute inset-0 bg-deep-ocean/35 backdrop-blur-[2px]"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trust-title"
        className="animate-rise absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-zk-border bg-zk-surface shadow-[-24px_0_60px_rgba(11,23,51,0.18)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zk-divider px-5 py-4">
          <div>
            <h2 id="trust-title" className="text-lg font-extrabold text-zk-text">
              Trust settings
            </h2>
            <p className="mt-0.5 text-xs text-zk-muted">
              Autonomy is earned one decision at a time.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 flex h-8 w-8 items-center justify-center rounded-full text-zk-muted hover:bg-zk-chip hover:text-zk-text"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-xl border border-zk-border bg-zk-bg/60 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-zk-text2">
              <Icon name="shield" size={13} className="text-zk-ok-fg" />
              Guardrails that always apply
            </p>
            <ul className="mt-1.5 space-y-1 text-[11px] leading-4 text-zk-muted">
              <li>· A grant covers one action type, one agent, and one risk ceiling.</li>
              <li>· High-risk actions (merge, credentials, production) always ask.</li>
              <li>· Every grant expires after 7 days unless you renew it.</li>
              <li>· Revoking a grant never touches a decision already made.</li>
            </ul>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zk-text">Standing grants</h3>
            <Chip tone={grants.some((grant) => isGrantActive(grant, now)) ? "accent" : "muted"}>
              {grants.filter((grant) => isGrantActive(grant, now)).length} active
            </Chip>
          </div>

          {grants.length > 0 && !grants.some((grant) => isGrantActive(grant, now)) ? (
            <p className="mt-2 rounded-lg bg-zk-warn-bg/70 px-2.5 py-2 text-[10.5px] font-medium leading-4 text-zk-warn-fg">
              Every grant has expired. Nothing is automatic until you renew one.
            </p>
          ) : null}

          {grants.length === 0 ? (
            <div className="mt-2 rounded-xl border border-dashed border-zk-border p-5 text-center">
              <p className="text-[12px] font-bold text-zk-text">No standing grants</p>
              <p className="mt-1 text-[11px] leading-4 text-zk-muted">
                Approve a low- or medium-risk action and tick “Remember this” to create one.
              </p>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {grants.map((grant) => {
                const active = isGrantActive(grant, now);
                const expiry = new Date(grant.expiresAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <li
                    key={grant.id}
                    className={`rounded-xl border p-3 ${
                      active ? "border-zk-border bg-zk-surface" : "border-zk-border/70 bg-zk-bg/60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active ? "bg-zk-tint text-zk-accent" : "bg-zk-chip text-zk-muted"
                        }`}
                      >
                        <Icon
                          name={
                            grant.kind === "bid"
                              ? "zap"
                              : grant.kind === "merge"
                                ? "merge"
                                : grant.kind === "scope_change"
                                  ? "scale"
                                  : grant.kind === "credential"
                                    ? "key"
                                    : "test"
                          }
                          size={15}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-bold text-zk-text">
                          {kindMeta[grant.kind].label} · {grant.agentName}
                          <Chip tone={active ? "ok" : "muted"}>{active ? "Active" : "Expired"}</Chip>
                        </p>
                        <p className="mt-0.5 text-[11px] text-zk-muted">
                          Covers {riskMeta[grant.maxRisk].label.toLowerCase()} and below ·{" "}
                          {active ? `expires ${expiry}` : `expired ${expiry} · no longer matches`}
                        </p>
                        <p className="mt-0.5 text-[10px] text-zk-muted">
                          Created {timeAgo(grant.createdAt, now)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5">
                        {active ? null : (
                          <button
                            type="button"
                            onClick={() => renewGrant(grant.id)}
                            className={buttonClass("primary", "sm")}
                          >
                            Renew
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => revokeGrant(grant.id)}
                          className={buttonClass("secondary", "sm")}
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6 rounded-xl border border-zk-border p-3">
            <h3 className="text-[12px] font-bold text-zk-text">The trust ladder</h3>
            <ol className="mt-2 space-y-2">
              {[
                ["Ask every time", "The default for every new agent and every high-risk action."],
                ["Ask below a ceiling", "A grant silences one low-risk action class for 7 days."],
                ["Review receipts", "Every grant still writes an attributable decision receipt."],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zk-tint text-[10px] font-extrabold text-zk-accent">
                    {index + 1}
                  </span>
                  <span className="text-[11px] leading-4">
                    <span className="block font-bold text-zk-text">{title}</span>
                    <span className="text-zk-muted">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 border-t border-zk-divider pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className={buttonClass("secondary", "sm")}
            >
              <Icon name="refresh" size={13} />
              Reset demo data
            </button>
            <p className="mt-2 text-[10px] leading-4 text-zk-muted">
              This prototype runs entirely in your browser. Reset restores the seeded handshakes
              and removes any grants or decisions you made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
