import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloom — Developer Workspace",
  description:
    "Your developer workspace. Learn JavaScript and AI, practice in the coding lab, and find your flow with five futuristic themes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("bloom-theme-v1");document.documentElement.dataset.theme=["ember","neon","matrix","robot","nova"].includes(t)?t:"ember"}catch{document.documentElement.dataset.theme="ember"}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
