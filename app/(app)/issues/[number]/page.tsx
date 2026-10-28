import { notFound } from "next/navigation";
import { issueByNumber, issues } from "@/lib/mock";
import { IssueDetail } from "./issue-detail";

export function generateStaticParams() {
  return issues.map((issue) => ({ number: String(issue.number) }));
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const issue = issueByNumber(Number(number));
  if (!issue) notFound();
  return <IssueDetail issue={issue} />;
}
