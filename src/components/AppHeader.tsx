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
    label: "Rulebook",
    zh: "規則書",
    href: "/rulebook",
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
    <header className="border-b border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[rgb(var(--arydia-bg-rgb)/0.95)] px-4 py-3 text-[var(--arydia-text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Arydia, the Paths We Dare Tread
          </p>
          <h1 className="text-lg font-bold text-[var(--arydia-primary)] group-hover:text-[var(--arydia-text)]">
            中英資料庫
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
                    ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                    : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-surface)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
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
