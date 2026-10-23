import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chapter", robots: { index: false } };

export default function ChapterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
