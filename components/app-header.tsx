"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { Avatar, BrandLockup } from "./ui";
import { ThemeToggle } from "./theme";
import { useHandshake } from "./providers";
import { clock } from "@/lib/handshake";
import { workspace } from "@/lib/mock";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" as const },
  { href: "/issues", label: "Issues", icon: "issues" as const },
  { href: "/handshake", label: "Handshake", icon: "handshake" as const },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/issues") return pathname === "/issues" || pathname.startsWith("/issues/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingCount, events, waitingCount } = useHandshake();
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) setMenuOpen(false);
      if (!noticeRef.current?.contains(target)) setNoticesOpen(false);
      if (!workspaceRef.current?.contains(target)) setWorkspaceOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setNoticesOpen(false);
        setWorkspaceOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zk-border bg-zk-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <BrandLockup size={30} href="/dashboard" />

        <div ref={workspaceRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setWorkspaceOpen((v) => !v)}
            aria-expanded={workspaceOpen}
            aria-haspopup="menu"
            className="focus-ring ml-2 flex h-9 items-center gap-2 rounded-full border border-zk-border bg-zk-surface px-2.5 text-[13px] font-semibold text-zk-text transition-colors hover:bg-zk-chip"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-deep-ocean text-[9px] font-extrabold text-white">
              Ze
            </span>
            {workspace.name}
            <Icon name="chevron-down" size={13} className="text-zk-muted" />
          </button>
          {workspaceOpen ? (
            <div
              role="menu"
              className="animate-pop absolute left-2 top-11 w-64 rounded-2xl border border-zk-border bg-zk-surface p-2 shadow-[0_20px_48px_rgba(11,23,51,0.18)]"
            >
              <p className="px-2 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-zk-muted">
                Workspaces
              </p>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-xl bg-zk-tint px-2 py-2 text-left text-[13px] font-semibold text-zk-accent"
                onClick={() => setWorkspaceOpen(false)}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-deep-ocean text-[10px] font-extrabold text-white">
                  Ze
                </span>
                <span className="flex flex-col">
                  Zedu
                  <span className="text-[10px] font-medium text-zk-muted">Project: Ziki</span>
                </span>
                <Icon name="check" size={14} className="ml-auto" />
              </button>
              <Link
                href="/improvement"
                onClick={() => setWorkspaceOpen(false)}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-[13px] font-medium text-zk-text2 hover:bg-zk-chip"
              >
                <Icon name="file" size={15} />
                Feature brief
                <Icon name="arrow-up-right" size={13} className="ml-auto text-zk-muted" />
              </Link>
            </div>
          ) : null}
        </div>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring relative inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] transition-colors ${
                  active
                    ? "bg-zk-tint font-bold text-zk-accent"
                    : "font-medium text-zk-text2 hover:bg-zk-chip hover:text-zk-text"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
                {item.href === "/handshake" && pendingCount > 0 ? (
                  <span className="ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-electric-blue-strong px-1 text-[10px] font-extrabold text-white">
                    {pendingCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/dashboard#points"
            className="focus-ring mr-1 hidden h-9 items-center gap-1.5 rounded-full border border-zk-border bg-zk-surface px-3 text-[13px] font-bold text-zk-text transition-colors hover:bg-zk-tint sm:flex"
            title="Points this week"
          >
            <Icon name="trophy" size={14} className="text-[#b7791f]" />
            <span className="tabular">{workspace.points.toFixed(2)}</span>
            <span className="text-[11px] font-semibold text-zk-muted">pts</span>
          </Link>

          <ThemeToggle />

          <div ref={noticeRef} className="relative">
            <button
              type="button"
              onClick={() => setNoticesOpen((v) => !v)}
              aria-expanded={noticesOpen}
              aria-label={
                pendingCount > 0
                  ? `Notifications, ${pendingCount} waiting for your decision`
                  : "Notifications"
              }
              className="focus-ring relative inline-flex h-9 w-9 items-center justify-center rounded-full text-zk-text2 transition-colors hover:bg-zk-chip hover:text-zk-text"
            >
              <Icon name="bell" size={18} />
              {pendingCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-zk-surface bg-electric-blue-strong px-1 text-[10px] font-extrabold text-white">
                  {pendingCount}
                </span>
              ) : null}
            </button>
            {noticesOpen ? (
              <div
                role="dialog"
                aria-label="Notifications"
                className="animate-pop absolute right-0 top-11 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zk-border bg-zk-surface shadow-[0_20px_48px_rgba(11,23,51,0.18)]"
              >
                <div className="flex items-center justify-between border-b border-zk-divider px-4 py-3">
                  <span className="text-sm font-bold text-zk-text">Waiting on you</span>
                  <span className="text-[11px] font-semibold text-zk-muted">
                    {waitingCount} in the loop
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {events.slice(0, 5).map((event) => (
                    <Link
                      key={event.id}
                      href={event.handshakeId ? `/handshake#${event.handshakeId}` : "/handshake"}
                      onClick={() => setNoticesOpen(false)}
                      className="flex gap-3 border-b border-zk-divider px-4 py-3 transition-colors last:border-0 hover:bg-zk-tint/60"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          event.tone === "ok"
                            ? "bg-zk-ok-fg"
                            : event.tone === "bad"
                              ? "bg-zk-bad-fg"
                              : event.tone === "warn"
                                ? "bg-zk-warn-fg"
                                : "bg-electric-blue"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-zk-text">
                          {event.title}
                        </span>
                        <span className="block truncate text-[11px] text-zk-muted">
                          {event.detail}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-medium text-zk-muted">
                          {clock(event.at)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/handshake"
                  onClick={() => setNoticesOpen(false)}
                  className="block bg-zk-tint px-4 py-2.5 text-center text-[12px] font-bold text-zk-accent hover:bg-[#dcebfd]"
                >
                  Open Handshake
                </Link>
              </div>
            ) : null}
          </div>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="focus-ring ml-0.5 flex items-center gap-2 rounded-full"
            >
              <Avatar name={workspace.owner} tone="blue" size={32} />
              <Icon name="chevron-down" size={13} className="hidden text-zk-muted sm:block" />
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="animate-pop absolute right-0 top-11 w-64 rounded-2xl border border-zk-border bg-zk-surface p-2 shadow-[0_20px_48px_rgba(11,23,51,0.18)]"
              >
                <div className="flex items-center gap-2 rounded-xl px-2 py-2">
                  <Avatar name={workspace.owner} tone="blue" size={34} />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-zk-text">{workspace.owner}</p>
                    <p className="truncate text-[11px] text-zk-muted">{workspace.role} · Zedu</p>
                  </div>
                </div>
                <div className="my-1 h-px bg-zk-divider" />
                <Link
                  href="/handshake"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-zk-text2 hover:bg-zk-chip"
                  role="menuitem"
                >
                  <Icon name="handshake" size={15} />
                  Handshake inbox
                  {pendingCount > 0 ? (
                    <span className="ml-auto rounded-full bg-zk-tint px-1.5 text-[10px] font-bold text-zk-accent">
                      {pendingCount}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/improvement"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-zk-text2 hover:bg-zk-chip"
                  role="menuitem"
                >
                  <Icon name="file" size={15} />
                  Feature brief
                </Link>
                <Link
                  href="/escalations"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2 text-[13px] font-medium text-zk-text2 hover:bg-zk-chip"
                  role="menuitem"
                >
                  <Icon name="refresh" size={15} />
                  Old escalations
                </Link>
                <div className="my-1 h-px bg-zk-divider" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-[13px] font-medium text-zk-text2 hover:bg-zk-chip"
                >
                  <Icon name="logout" size={15} />
                  Sign out
                </button>
                <p className="px-2 pb-1 pt-2 text-[10px] leading-relaxed text-zk-muted">
                  Demo workspace · data is local to this browser.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { pendingCount } = useHandshake();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-zk-border bg-zk-surface/95 px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden"
    >
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-semibold ${
              active ? "text-zk-accent" : "text-zk-muted"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full ${
                active ? "bg-zk-tint" : ""
              }`}
            >
              <Icon name={item.icon} size={18} />
            </span>
            {item.label}
            {item.href === "/handshake" && pendingCount > 0 ? (
              <span className="absolute right-[22%] top-0 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-electric-blue-strong px-0.5 text-[9px] font-extrabold text-white">
                {pendingCount}
              </span>
            ) : null}
          </Link>
        );
      })}
      <Link
        href="/improvement"
        className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-semibold ${
          isActive(pathname, "/improvement") ? "text-zk-accent" : "text-zk-muted"
        }`}
      >
        <span
          className={`flex h-7 w-12 items-center justify-center rounded-full ${
            isActive(pathname, "/improvement") ? "bg-zk-tint" : ""
          }`}
        >
          <Icon name="file" size={18} />
        </span>
        Brief
      </Link>
    </nav>
  );
}

export function AppFooter() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-[1280px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
      <div className="flex flex-col items-start justify-between gap-3 border-t border-zk-border pt-5 text-[11px] text-zk-muted sm:flex-row sm:items-center">
        <p>
          Ziki demo · Human-led. Agent-assisted. Every action permissioned, attributable, and
          reversible for 10 seconds.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/improvement" className="font-semibold hover:text-zk-text">
            Why Handshake
          </Link>
          <Link href="/login" className="font-semibold hover:text-zk-text">
            Sign in
          </Link>
          <span className="hidden sm:inline">© 2026 Ziki</span>
        </div>
      </div>
    </footer>
  );
}
