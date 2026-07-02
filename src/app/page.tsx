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
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Arydia, the Paths We Dare Tread Bilingual Database
          </p>

          <h1 className="mb-4 text-4xl font-bold text-[#c98f3b]">
            {"Arydia, the Paths We Dare Tread \u4e2d\u82f1\u8cc7\u6599\u5eab"}
          </h1>

          <p className="max-w-3xl leading-7 text-[#b9a988]">
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
              className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-5 shadow-lg transition hover:border-[#c98f3b] hover:bg-[#3a2b1c]"
            >
              <p className="mb-2 text-sm text-[#b9a988]">{card.zh}</p>

              <h2 className="mb-3 text-2xl font-bold text-[#c98f3b]">
                {card.title}
              </h2>

              <p className="leading-7 text-[#ece3d2]">{card.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
