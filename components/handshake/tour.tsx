"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { buttonClass } from "@/components/ui";

export type TourStep = {
  title: string;
  body: string;
  /** Value of the `data-tour` attribute to spotlight. */
  target?: string;
  /** Runs before the step is highlighted, e.g. to switch tabs. */
  onEnter?: () => void;
  link?: { href: string; label: string };
};

/**
 * A lightweight presenter guide. It never mutates a decision; it only moves the
 * viewer between parts of the live surface and narrates why each part matters.
 */
export function Tour({
  open,
  onClose,
  steps,
}: {
  open: boolean;
  onClose: () => void;
  steps: TourStep[];
}) {
  const [index, setIndex] = useState(0);
  const highlighted = useRef<HTMLElement | null>(null);
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (!open) return;
    const step = steps[index];

    const enterTimer = window.setTimeout(() => step?.onEnter?.(), 0);
    const highlightTimer = window.setTimeout(() => {
      if (!step?.target) return;
      const target = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("tour-spotlight");
      highlighted.current = target;
    }, 320);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(highlightTimer);
      highlighted.current?.classList.remove("tour-spotlight");
      highlighted.current = null;
    };
  }, [open, index, steps]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, steps.length]);

  if (!open) return null;
  const step = steps[index];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[95] flex justify-center px-3 sm:bottom-6 sm:px-4">
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        className="animate-pop pointer-events-auto w-full max-w-[560px] rounded-[20px] border border-zk-border bg-zk-surface p-4 shadow-[0_24px_70px_rgba(11,23,51,0.28)]"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-zk-accent">
            <Icon name="play" size={10} />
            Presenter tour · {index + 1} of {steps.length}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close presenter tour"
            className="focus-ring rounded-full p-1 text-zk-muted transition-colors hover:bg-zk-chip hover:text-zk-text"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        <div className="mt-2 flex gap-1" aria-hidden="true">
          {steps.map((_, stepIndex) => (
            <span
              key={stepIndex}
              className={`h-1 flex-1 rounded-full transition-colors ${
                stepIndex <= index ? "bg-electric-blue" : "bg-zk-chip"
              }`}
            />
          ))}
        </div>

        <h2
          id="tour-title"
          className="mt-2.5 text-[16px] font-extrabold leading-snug tracking-[-0.01em] text-zk-text"
        >
          {step.title}
        </h2>
        <p className="mt-1 text-[12px] leading-5 text-zk-text2">{step.body}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className={buttonClass("secondary", "sm")}
          >
            <Icon name="arrow-left" size={12} />
            Back
          </button>

          <div className="flex items-center gap-2">
            {step.link ? (
              <Link href={step.link.href} className={buttonClass("secondary", "sm")}>
                {step.link.label}
              </Link>
            ) : null}
            {isLast ? (
              <button type="button" onClick={onClose} className={buttonClass("primary", "sm")}>
                Done
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
                className={buttonClass("primary", "sm")}
              >
                Next
                <Icon name="arrow-right" size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
