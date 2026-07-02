import GuideViewer from "@/components/GuideViewer";
import { loadRulebookGuide } from "@/data/loadRulebook";

export default async function RulebookPage() {
  const rulebookGuide = await loadRulebookGuide();

  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Rulebook Workspace
          </p>

          <h1 className="mb-3 text-4xl font-bold text-[#c98f3b]">
            規則書翻譯與結構筆記 · Rulebook Translation
          </h1>

          <p className="max-w-3xl text-sm leading-7 text-[#b9a988]">
            Private rulebook translation workspace. Use this page to translate
            rulebook sections in small reviewed chunks and extract safe database
            design notes for the public repo.
          </p>
        </section>

        <GuideViewer sections={rulebookGuide} />
      </div>
    </main>
  );
}
