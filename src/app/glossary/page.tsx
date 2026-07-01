import { glossaryData, GlossaryTerm } from "@/data/glossary";

/**
 * The main glossary page for the Arydia translation helper.
 * It displays a list of terms in a styled table.
 */
export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-[#c98f3b]">
          Arydia Glossary
        </h1>

        <p className="mb-6 text-sm text-[#b9a988]">
          English / 繁體中文 terminology reference for consistent Arydia
          translation.
        </p>

        <div className="overflow-x-auto rounded-lg border border-[#a9762f]/50 bg-[#2a241d] shadow-lg">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead className="bg-[#3a2b1c] text-sm uppercase tracking-wider text-[#c98f3b]">
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
                  className="border-b border-[#a9762f]/30 transition-colors duration-200 last:border-b-0 hover:bg-[#3a2b1c]/70"
                >
                  <td className="p-4 font-semibold text-[#ece3d2]">
                    {term.en}
                  </td>

                  <td className="p-4 text-lg font-semibold text-[#fff6df]">
                    {term.zh}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {(term.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-2.5 py-0.5 text-xs font-medium text-[#b9a988]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 text-[#b9a988]">
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