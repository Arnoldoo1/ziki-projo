import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ziki Workshop — a whimsical edition",
  description:
    "A paper-and-ink edition of Ziki: a cozy workshop where humans and their agents make things together, and nothing leaves without a stamp.",
};

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
