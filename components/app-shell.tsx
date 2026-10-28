"use client";

import type { ReactNode } from "react";
import { AppFooter, AppHeader, MobileNav } from "./app-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div data-app-shell className="flex min-h-screen flex-col bg-zk-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-zk-surface focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-zk-text"
      >
        Skip to content
      </a>
      <AppHeader />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-24 pt-6 outline-none sm:px-6 lg:px-8 lg:pb-8 lg:pt-8"
      >
        {children}
      </main>
      <AppFooter />
      <MobileNav />
    </div>
  );
}
