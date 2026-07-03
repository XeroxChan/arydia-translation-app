import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arydia, the Paths We Dare Tread Bilingual Database",
  description:
    "A private bilingual database for Arydia in English and Traditional Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="bg-[var(--arydia-bg)]">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}