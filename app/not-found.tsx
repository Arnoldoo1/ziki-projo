import Link from "next/link";
import { BrandMark, buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zk-bg px-4 text-center">
      <span className="flex items-center gap-2">
        <BrandMark size={34} />
        <span className="font-display text-[25px] font-extrabold tracking-[-0.04em] text-zk-text">
          ziki
        </span>
      </span>
      <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.14em] text-zk-accent">
        404 · Nothing at the gate
      </p>
      <h1 className="mt-2 max-w-md font-display text-[32px] font-extrabold leading-tight tracking-[-0.035em] text-zk-text sm:text-[40px]">
        This page never got permission to exist.
      </h1>
      <p className="mt-3 max-w-sm text-[13px] leading-6 text-zk-muted">
        The link may be old, or the page may have moved. Your decisions and receipts are safe in
        Handshake.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link href="/dashboard" className={buttonClass("primary")}>
          Back to dashboard
        </Link>
        <Link href="/handshake" className={buttonClass("secondary")}>
          Open Handshake
        </Link>
      </div>
    </main>
  );
}
