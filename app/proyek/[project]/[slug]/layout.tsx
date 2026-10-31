import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bab", robots: { index: false } };

export default function ProjectChapterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
