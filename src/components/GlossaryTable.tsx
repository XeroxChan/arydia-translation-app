"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/data/glossary";

type GlossaryTableProps = {
  terms: GlossaryTerm[];
};

export default function GlossaryTable({ terms }: GlossaryTableProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = useMemo(() => {
    const tags = terms.flatMap((term) => term.tags ?? []);
    return ["All", ...Array.from(new Set(tags)).sort()];
  }, [terms]);

  const filteredTerms = useMemo(() => {
    const normalisedSearch = search.trim().toLowerCase();

    return terms.filter((term) => {
      const matchesTag =
        activeTag === "All" || (term.tags ?? []).includes(activeTag);

      const searchableText = [
        term.en,
        term.zh,
        term.description ?? "",
        ...(term.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalisedSearch === "" || searchableText.includes(normalisedSearch);

      return matchesTag && matchesSearch;
    });
  }, [terms, search, activeTag]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#2a241d] p-4">
        <label
          htmlFor="glossary-search"
          className="mb-2 block text-sm font-semibold text-[#c98f3b]"
        >
          Search glossary
        </label>

        <input
          id="glossary-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, 中文, notes, or tags..."
          className="w-full rounded-md border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-[#ece3d2] placeholder:text-[#b9a988]/60 focus:border-[#c98f3b] focus:outline-none"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = tag === activeTag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  isActive
                    ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
                    : "border-[#a9762f]/30 bg-[#1c1a17] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-[#b9a988]">
          Showing {filteredTerms.length} of {terms.length} terms
        </p>
      </div>

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
            {filteredTerms.map((term) => (
              <tr
                key={term.id}
                className="border-b border-[#a9762f]/30 transition-colors duration-200 last:border-b-0 hover:bg-[#3a2b1c]/70"
              >
                <td className="p-4 font-semibold text-[#ece3d2]">{term.en}</td>

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

            {filteredTerms.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-[#b9a988]">
                  No glossary terms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}