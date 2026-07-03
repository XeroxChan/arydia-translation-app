import Link from "next/link";

const cards = [
  {
    title: "Glossary",
    zh: "\u8853\u8a9e\u8868",
    href: "/glossary",
    description:
      "Check English and Traditional Chinese terminology for consistent translation.",
  },
  {
    title: "Quick Start Guide",
    zh: "\u65b0\u624b\u5feb\u901f\u4e0a\u624b\u6307\u5357",
    href: "/quick-start",
    description:
      "Read sample bilingual guide sections side by side during development.",
  },
  {
    title: "Rulebook",
    zh: "\u898f\u5247\u66f8",
    href: "/rulebook",
    description:
      "Translate selected rulebook sections privately and extract safe database structure notes.",
  },
  {
    title: "Card Library",
    zh: "\u5361\u724c\u7d22\u5f15",
    href: "/cards",
    description:
      "Browse placeholder card entries using the real Arydia card type structure.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--arydia-bg)] p-4 text-[var(--arydia-text)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.5)] bg-[var(--arydia-surface)] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Arydia, the Paths We Dare Tread Bilingual Database
          </p>

          <h1 className="mb-4 text-4xl font-bold text-[var(--arydia-primary)]">
            {"Arydia, the Paths We Dare Tread \u4e2d\u82f1\u8cc7\u6599\u5eab"}
          </h1>

          <p className="max-w-3xl leading-7 text-[var(--arydia-muted)]">
            A private iPad-friendly web app for displaying Arydia reference
            content in English and Traditional Chinese side by side, with a
            glossary-controlled translation workflow.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-5 shadow-lg transition hover:border-[var(--arydia-primary)] hover:bg-[var(--arydia-surface-raised)]"
            >
              <p className="mb-2 text-sm text-[var(--arydia-muted)]">{card.zh}</p>

              <h2 className="mb-3 text-2xl font-bold text-[var(--arydia-primary)]">
                {card.title}
              </h2>

              <p className="leading-7 text-[var(--arydia-text)]">{card.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
