import { glossaryData, GlossaryTerm } from "@/data/glossary";

/**
 * The main glossary page for the Arydia translation helper.
 * It displays a list of terms in a styled table.
 */
export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-stone-950 p-4 text-stone-300 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-amber-100">
          Arydia Glossary
        </h1>

        <p className="mb-6 text-sm text-stone-400">
          English / 繁體中文 terminology reference for consistent Arydia
          translation.
        </p>

        <div className="overflow-x-auto rounded-lg border border-amber-900/50">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead className="bg-stone-800/50 text-sm uppercase tracking-wider text-amber-200">
              <tr>
                <th className="p-4">English</th>
                <th className="p-4">繁體中文</th>
                <th className="p-4">分類</th>
                <th className="p-4">備註</th>
              </tr>
            </thead>

            <tbody>
              {glossaryData.map((term: GlossaryTerm) => (
                <tr
                  key={term.id}
                  className="border-b border-amber-900/40 transition-colors duration-200 last:border-b-0 hover:bg-stone-900"
                >
                  <td className="p-4 font-semibold text-stone-100">
                    {term.en}
                  </td>

                  <td className="p-4 text-lg font-semibold text-amber-50">
                    {term.zh}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {(term.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-stone-700 px-2.5 py-0.5 text-xs font-medium text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 text-stone-400">
                    {term.description || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}