"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    zh: "首頁",
    href: "/",
  },
  {
    label: "Glossary",
    zh: "術語表",
    href: "/glossary",
  },
  {
    label: "Quick Start",
    zh: "快速指南",
    href: "/quick-start",
  },
  {
    label: "Cards",
    zh: "卡牌",
    href: "/cards",
  },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#a9762f]/40 bg-[#1c1a17]/95 px-4 py-3 text-[#ece3d2] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Arydia
          </p>
          <h1 className="text-lg font-bold text-[#c98f3b] group-hover:text-[#ece3d2]">
            雙語翻譯助手
          </h1>
        </Link>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
                    : "border-[#a9762f]/30 bg-[#2a241d] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
                }`}
              >
                <span className="mr-1">{item.zh}</span>
                <span className="text-xs opacity-70">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}