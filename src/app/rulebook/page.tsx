import GuideViewer from "@/components/GuideViewer";
import { loadRulebookGuide } from "@/data/loadRulebook";

type RulebookPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    section?: string | string[];
    mode?: string | string[];
  }>;
};

function getFirstSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RulebookPage({
  searchParams,
}: RulebookPageProps) {
  const rulebookGuide = await loadRulebookGuide();
  const params = searchParams ? await searchParams : {};
  const initialPage = getFirstSearchParam(params.page);
  const initialSectionId = getFirstSearchParam(params.section);
  const initialShowAll = getFirstSearchParam(params.mode) === "all";

  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Rulebook Translation
          </p>

          <h1 className="mb-3 text-4xl font-bold text-[#c98f3b]">
            {"\u898f\u5247\u66f8\u7ffb\u8b6f \u00b7 Rulebook Translation"}
          </h1>

          <p className="max-w-3xl text-sm leading-7 text-[#b9a988]">
            Private rulebook translation workspace. Use this page to translate
            rulebook sections in small reviewed chunks with English and
            Traditional Chinese side by side.
          </p>
        </section>

        <GuideViewer
          sections={rulebookGuide}
          basePath="/rulebook"
          initialPage={initialPage}
          initialSectionId={initialSectionId}
          initialShowAll={initialShowAll}
        />
      </div>
    </main>
  );
}
