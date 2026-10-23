import type { Metadata } from "next";
import "./globals.css";
import "./readability.css";

export const metadata: Metadata = {
  title: "Bloom · A little learning, every day",
  description:
    "Build your understanding of AI, one approachable lesson at a time. Read, practice, and track your progress with Bloom.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
