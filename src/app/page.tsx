import Link from "next/link";

const cards = [
  {
    title: "Glossary",
    zh: "術語表",
    href: "/glossary",
    description:
      "Check English and Traditional Chinese terminology for consistent translation.",
  },
  {
    title: "Quick Start Guide",
    zh: "新手快速上手指南",
    href: "/quick-start",
    description:
      "Read sample bilingual guide sections side by side during development.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Arydia Translation Helper
          </p>

          <h1 className="mb-4 text-4xl font-bold text-[#c98f3b]">
            Arydia 雙語翻譯助手
          </h1>

          <p className="max-w-3xl leading-7 text-[#b9a988]">
            A private iPad-friendly web app for displaying Arydia reference
            content in English and Traditional Chinese side by side, with a
            glossary-controlled translation workflow.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
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