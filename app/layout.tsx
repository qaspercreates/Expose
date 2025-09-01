import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Expose — Daily Chaos Game",
  description: "Answer the daily question, unlock the vault, vote the wildest takes, get featured.",
  openGraph: {
    title: "Expose — Daily Chaos Game",
    description: "Answer. Unlock. Vote. Get featured.",
    images: ["/og.png"]
  },
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white">
        <Header />
        <main className="max-w-2xl mx-auto px-4 pb-24">{children}</main>
      </body>
    </html>
  );
}
