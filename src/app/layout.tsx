import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arydia Translation Helper",
  description:
    "A private bilingual translation helper for Arydia in English and Traditional Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="bg-[#1c1a17]">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}