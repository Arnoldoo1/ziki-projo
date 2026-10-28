"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { BrandMark, buttonClass } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="grid min-h-screen bg-zk-bg lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-deep-ocean p-10 text-white lg:flex lg:flex-col">
        <div aria-hidden="true" className="zk-grid-bg absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full bg-electric-blue/25 blur-[110px]"
        />
        <div className="relative flex items-center gap-2.5">
          <BrandMark size={34} />
          <span className="font-display text-[25px] font-extrabold tracking-[-0.04em]">ziki</span>
        </div>

        <div className="relative my-auto max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10.5px] font-bold text-[#c9d6ef]">
            <Icon name="handshake" size={11} className="text-sky-tint" />
            Every action permissioned
          </span>
          <h1 className="mt-5 font-display text-[42px] font-extrabold leading-[1.06] tracking-[-0.045em]">
            The last word
            <span className="block text-sky-tint">stays human.</span>
          </h1>
          <p className="mt-4 text-[14px] leading-6 text-[#b7c3da]">
            Ziki gives your agents a place to work and a gate to stop at. Report, vote, bid, prove,
            and merge — with a receipt for every decision.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8fa3c4]">
              A decision receipt
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[13px] font-bold">
              <Icon name="check-circle" size={15} className="text-[#6ee7a8]" />
              Approved by Arnold · 09:41
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#a9bada]">
              Merge PR #1847 · condition: “deploy after 18:00” · coddy reported{" "}
              <span className="font-mono text-[10.5px] text-sky-tint">merged 9f2c1ab</span>
            </p>
            <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3 text-[10px] text-[#8fa3c4]">
              <span className="flex items-center gap-1">
                <Icon name="clock" size={10} />
                held 10s
              </span>
              <span className="flex items-center gap-1">
                <Icon name="file" size={10} />
                append-only
              </span>
              <span className="flex items-center gap-1">
                <Icon name="shield" size={10} />
                attributable
              </span>
            </div>
          </div>
        </div>

        <p className="relative text-[10.5px] text-[#7f92b3]">
          Ziki demo workspace · designed for the human–agent handoff.
        </p>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-lg lg:hidden">
            <BrandMark size={30} />
            <span className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-zk-text">
              ziki
            </span>
          </Link>
          <Link href="/" className="focus-ring hidden text-[11.5px] font-semibold text-zk-muted hover:text-zk-text lg:block">
            ← Back to ziki.dev
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center py-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-zk-accent">
            Welcome back
          </p>
          <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text">
            Sign in to Ziki
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-zk-muted">
            Pick up your issues, your agents, and every decision still waiting at the gate.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="focus-ring mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-zk-border bg-zk-surface text-[13px] font-bold text-zk-text transition-colors hover:bg-zk-chip"
          >
            <Icon name="google" size={17} />
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-zk-border" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zk-muted">
              or use email
            </span>
            <span className="h-px flex-1 bg-zk-border" />
          </div>

          {sent ? (
            <div className="animate-fade rounded-2xl border border-zk-ok-fg/25 bg-zk-ok-bg/50 p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-zk-ok-fg">
                <Icon name="check-circle" size={15} />
                Magic link ready
              </p>
              <p className="mt-1.5 text-[11.5px] leading-5 text-zk-text2">
                In a live workspace, a one-time link would be sent to{" "}
                <span className="font-semibold text-zk-text">{email}</span>. This prototype keeps
                everything in your browser — no email was sent.
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className={buttonClass("primary", "md", "mt-3 w-full")}
              >
                Open the demo workspace
                <Icon name="arrow-right" size={14} />
              </button>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 w-full text-[11px] font-semibold text-zk-muted hover:text-zk-text"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) return;
                setSent(true);
              }}
            >
              <label htmlFor="email" className="block text-[11px] font-bold text-zk-text">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-zk-border bg-zk-surface px-3.5 text-[13px] text-zk-text placeholder:text-zk-muted focus:border-electric-blue focus:outline-none"
              />
              <button type="submit" className={buttonClass("primary", "lg", "mt-3 w-full")}>
                Continue with email
                <Icon name="arrow-right" size={15} />
              </button>
            </form>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 text-[11px]">
            <Link href="/dashboard" className="font-bold text-zk-accent hover:underline">
              Skip — open the demo
            </Link>
            <span className="text-zk-muted">No account needed</span>
          </div>

          <div className="mt-8 rounded-xl border border-zk-border bg-zk-surface/70 p-3">
            <p className="flex items-start gap-2 text-[10.5px] leading-4 text-zk-muted">
              <Icon name="info" size={12} className="mt-0.5 shrink-0 text-zk-accent" />
              <span>
                <span className="font-bold text-zk-text2">Prototype note:</span> authentication is
                simulated. Decisions, grants, and receipts live in this browser’s local storage.
              </span>
            </p>
          </div>
        </div>

        <p className="mx-auto w-full max-w-[390px] text-[10px] leading-4 text-zk-muted">
          By continuing you agree to the demo terms. Ziki is a product concept built to explore
          human-in-the-loop agent workflows.
        </p>
      </main>
    </div>
  );
}
