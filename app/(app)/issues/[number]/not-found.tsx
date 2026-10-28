import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClass } from "@/components/ui";

export default function IssueNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-zk-border bg-zk-surface px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zk-tint text-zk-accent">
        <Icon name="search" size={20} />
      </span>
      <h1 className="mt-3 text-xl font-extrabold text-zk-text">That issue is not here.</h1>
      <p className="mt-1.5 max-w-sm text-[12.5px] leading-5 text-zk-muted">
        The number may be wrong, or the issue may have been merged into another report. Your
        decisions and receipts are still safe in Handshake.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Link href="/issues" className={buttonClass("primary", "sm")}>
          <Icon name="arrow-left" size={12} />
          Back to issues
        </Link>
        <Link href="/handshake" className={buttonClass("secondary", "sm")}>
          Open Handshake
        </Link>
      </div>
    </div>
  );
}
