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
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4">
        <label
          htmlFor="glossary-search"
          className="mb-2 block text-sm font-semibold text-[var(--arydia-primary)]"
        >
          Search glossary
        </label>

        <input
          id="glossary-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, 中文, notes, or tags..."
          className="w-full rounded-md border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-[var(--arydia-text)] placeholder:text-[rgb(var(--arydia-muted-rgb)/0.6)] focus:border-[var(--arydia-primary)] focus:outline-none"
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
                    ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                    : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-[var(--arydia-muted)]">
          Showing {filteredTerms.length} of {terms.length} terms
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.5)] bg-[var(--arydia-surface)] shadow-lg">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead className="bg-[var(--arydia-surface-raised)] text-sm uppercase tracking-wider text-[var(--arydia-primary)]">
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
                className="border-b border-[rgb(var(--arydia-border-rgb)/0.3)] transition-colors duration-200 last:border-b-0 hover:bg-[rgb(var(--arydia-surface-raised-rgb)/0.7)]"
              >
                <td className="p-4 font-semibold text-[var(--arydia-text)]">{term.en}</td>

                <td className="p-4 text-lg font-semibold text-[var(--arydia-strong)]">
                  {term.zh}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {(term.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--arydia-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4 text-[var(--arydia-muted)]">
                  {term.description || ""}
                </td>
              </tr>
            ))}

            {filteredTerms.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-[var(--arydia-muted)]">
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