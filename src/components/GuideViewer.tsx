"use client";

import { useEffect, useMemo, useState } from "react";
import GuideSection from "@/components/GuideSection";
import type { DisplayMode } from "@/components/BilingualPair";
import type {
  GuideBlock,
  GuideSection as GuideSectionType,
  TranslationStatus,
} from "@/data/types";

type StatusFilter = "all" | TranslationStatus;

type GuideViewerProps = {
  sections: GuideSectionType[];
};

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All \u5168\u90e8" },
  { value: "draft", label: "Draft \u8349\u7a3f" },
  { value: "reviewed", label: "Reviewed \u5df2\u6aa2\u67e5" },
  { value: "approved", label: "Approved \u5df2\u78ba\u8a8d" },
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "side-by-side", label: "Side by side \u5c0d\u7167" },
  { value: "zh-only", label: "\u4e2d\u6587 only" },
  { value: "en-only", label: "English only" },
];

const statusSummaryOptions: {
  value: TranslationStatus;
  label: string;
  helper: string;
}[] = [
  { value: "draft", label: "Draft \u8349\u7a3f", helper: "Needs review" },
  { value: "reviewed", label: "Reviewed \u5df2\u6aa2\u67e5", helper: "Checked once" },
  { value: "approved", label: "Approved \u5df2\u78ba\u8a8d", helper: "Ready for play" },
];

function blockMatchesStatus(block: GuideBlock, status: StatusFilter) {
  if (status === "all") return true;

  if (block.type === "paragraph") {
    return block.status === status;
  }

  return block.items.some((item) => item.status === status);
}

function filterBlockByStatus(
  block: GuideBlock,
  status: StatusFilter,
): GuideBlock | null {
  if (status === "all") return block;

  if (block.type === "paragraph") {
    return block.status === status ? block : null;
  }

  const filteredItems = block.items.filter((item) => item.status === status);

  if (filteredItems.length === 0) {
    return null;
  }

  return {
    ...block,
    items: filteredItems,
  };
}

function getBlockSearchText(block: GuideBlock) {
  if (block.type === "paragraph") {
    return `${block.subtitleEn ?? ""} ${block.subtitleZh ?? ""} ${block.en} ${block.zh}`.toLowerCase();
  }

  return block.items
    .map((item) => `${item.en} ${item.zh}`)
    .join(" ")
    .toLowerCase();
}

function blockMatchesSearch(block: GuideBlock, search: string) {
  if (search === "") return true;
  return getBlockSearchText(block).includes(search);
}

function filterBlockBySearch(
  block: GuideBlock,
  search: string,
): GuideBlock | null {
  if (search === "") return block;

  if (block.type === "paragraph") {
    return blockMatchesSearch(block, search) ? block : null;
  }

  const filteredItems = block.items.filter((item) =>
    `${item.en} ${item.zh}`.toLowerCase().includes(search),
  );

  if (filteredItems.length === 0) {
    return null;
  }

  return {
    ...block,
    items: filteredItems,
  };
}

function countBlockStatuses(block: GuideBlock) {
  const counts: Record<TranslationStatus, number> = {
    draft: 0,
    reviewed: 0,
    approved: 0,
  };

  if (block.type === "paragraph") {
    counts[block.status] += 1;
    return counts;
  }

  block.items.forEach((item) => {
    counts[item.status] += 1;
  });

  return counts;
}

function getSectionLabel(section: GuideSectionType) {
  const page = section.page ?? "?";
  return `Page ${page} - ${section.titleZh} \u00b7 ${section.titleEn}`;
}

function updateUrlForSection(section: GuideSectionType) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);

  if (section.page !== undefined) {
    url.searchParams.set("page", String(section.page));
    url.searchParams.delete("section");
  } else {
    url.searchParams.set("section", section.id);
    url.searchParams.delete("page");
  }

  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function scrollToReaderTop() {
  if (typeof window === "undefined") return;

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

export default function GuideViewer({ sections }: GuideViewerProps) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("side-by-side");
  const [search, setSearch] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(
    sections[0]?.id ?? "",
  );
  const [showAllPages, setShowAllPages] = useState(false);

  const normalisedSearch = search.trim().toLowerCase();

  useEffect(() => {
    if (sections.length === 0) return;
    if (typeof window === "undefined") return;

    const frameId = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");
      const sectionParam = params.get("section");

      const matchedSection =
        (pageParam
          ? sections.find((section) => String(section.page) === pageParam)
          : undefined) ??
        (sectionParam
          ? sections.find((section) => section.id === sectionParam)
          : undefined);

      setSelectedSectionId(matchedSection?.id ?? sections[0].id);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [sections]);

  const statusSummary = useMemo(() => {
    return sections.reduce<Record<TranslationStatus, number>>(
      (summary, section) => {
        section.blocks.forEach((block) => {
          const blockCounts = countBlockStatuses(block);

          summary.draft += blockCounts.draft;
          summary.reviewed += blockCounts.reviewed;
          summary.approved += blockCounts.approved;
        });

        return summary;
      },
      {
        draft: 0,
        reviewed: 0,
        approved: 0,
      },
    );
  }, [sections]);

  const filteredSections = useMemo(() => {
    return sections
      .map((section) => {
        const sectionTitleMatches =
          normalisedSearch === "" ||
          `${section.titleEn} ${section.titleZh}`
            .toLowerCase()
            .includes(normalisedSearch);

        const filteredBlocks = section.blocks
          .filter((block) => blockMatchesStatus(block, activeStatus))
          .map((block) => filterBlockByStatus(block, activeStatus))
          .filter((block): block is GuideBlock => block !== null)
          .filter((block) =>
            sectionTitleMatches
              ? true
              : blockMatchesSearch(block, normalisedSearch),
          )
          .map((block) =>
            sectionTitleMatches
              ? block
              : filterBlockBySearch(block, normalisedSearch),
          )
          .filter((block): block is GuideBlock => block !== null);

        return {
          ...section,
          blocks: filteredBlocks,
        };
      })
      .filter((section) => section.blocks.length > 0);
  }, [sections, activeStatus, normalisedSearch]);

  useEffect(() => {
    if (filteredSections.length === 0) return;

    const currentSectionStillVisible = filteredSections.some(
      (section) => section.id === selectedSectionId,
    );

    if (currentSectionStillVisible) return;
    if (typeof window === "undefined") return;

    const frameId = window.requestAnimationFrame(() => {
      setSelectedSectionId(filteredSections[0].id);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [filteredSections, selectedSectionId]);

  const selectedSection = useMemo(() => {
    return (
      filteredSections.find((section) => section.id === selectedSectionId) ??
      filteredSections[0] ??
      null
    );
  }, [filteredSections, selectedSectionId]);

  const selectedIndex = selectedSection
    ? filteredSections.findIndex((section) => section.id === selectedSection.id)
    : -1;

  const previousSection =
    selectedIndex > 0 ? filteredSections[selectedIndex - 1] : null;
  const nextSection =
    selectedIndex >= 0 && selectedIndex < filteredSections.length - 1
      ? filteredSections[selectedIndex + 1]
      : null;

  const contentSections = showAllPages
    ? filteredSections
    : selectedSection
      ? [selectedSection]
      : [];

  function selectSection(section: GuideSectionType) {
    setSelectedSectionId(section.id);
    setShowAllPages(false);
    updateUrlForSection(section);
    scrollToReaderTop();
  }

  function clearSearchAndFilters() {
    setSearch("");
    setActiveStatus("all");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
        <label
          htmlFor="guide-search"
          className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#b9a988]"
        >
          Search Guide
        </label>

        <input
          id="guide-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, Chinese, section titles..."
          className="w-full rounded-md border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-[#ece3d2] placeholder:text-[#b9a988]/60 focus:border-[#c98f3b] focus:outline-none"
        />
      </section>

      <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
              Review Summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#fff6df]">
              Translation progress
            </h2>
          </div>

          <p className="text-sm text-[#b9a988]">
            {statusSummary.draft +
              statusSummary.reviewed +
              statusSummary.approved}{" "}
            guide items tracked
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {statusSummaryOptions.map((option) => (
            <div
              key={option.value}
              className="rounded-lg border border-[#a9762f]/30 bg-[#1c1a17] p-4"
            >
              <p className="text-sm text-[#b9a988]">{option.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#c98f3b]">
                {statusSummary[option.value]}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#b9a988]/70">
                {option.helper}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg lg:col-span-2">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Translation Status Filter
          </p>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option.value === activeStatus;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveStatus(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
                      : "border-[#a9762f]/30 bg-[#1c1a17] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-[#b9a988]">
            {filteredSections.length} of {sections.length} sections match the
            current filters.
          </p>
        </section>

        <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Display Mode
          </p>

          <div className="flex flex-wrap gap-2">
            {displayOptions.map((option) => {
              const isActive = option.value === displayMode;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDisplayMode(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
                      : "border-[#a9762f]/30 bg-[#1c1a17] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="hidden rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg lg:block">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
                  Contents
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#fff6df]">
                  Page navigator
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAllPages((current) => !current)}
                className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-3 py-1 text-xs text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2]"
              >
                {showAllPages ? "Single page" : "Show all"}
              </button>
            </div>

            <div className="max-h-[calc(100vh-12rem)] space-y-2 overflow-y-auto pr-1">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => {
                  const isActive =
                    !showAllPages && selectedSection?.id === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => selectSection(section)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
                          : "border-[#a9762f]/25 bg-[#1c1a17] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-[0.16em] text-[#c98f3b]">
                        Page {section.page ?? "?"}
                      </span>
                      <span className="mt-1 block font-medium text-[#fff6df]">
                        {section.titleZh}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#b9a988]">
                        {section.titleEn}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="rounded-lg border border-[#a9762f]/25 bg-[#1c1a17] p-3 text-sm text-[#b9a988]">
                  No pages match the current filters.
                </p>
              )}
            </div>
          </div>

          <div className="sticky top-20 z-20 rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg lg:hidden">
            <label
              htmlFor="mobile-page-select"
              className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#b9a988]"
            >
              Jump to page
            </label>

            <select
              id="mobile-page-select"
              value={selectedSection?.id ?? ""}
              onChange={(event) => {
                const section = filteredSections.find(
                  (candidate) => candidate.id === event.target.value,
                );

                if (section) {
                  selectSection(section);
                }
              }}
              className="w-full rounded-md border border-[#a9762f]/40 bg-[#1c1a17] px-3 py-2 text-sm text-[#ece3d2] focus:border-[#c98f3b] focus:outline-none"
            >
              {filteredSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {getSectionLabel(section)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAllPages((current) => !current)}
              className="mt-3 w-full rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-3 py-2 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2]"
            >
              {showAllPages ? "Single page mode" : "Show all pages"}
            </button>
          </div>
        </aside>

        <main className="min-w-0 space-y-4">
          {!showAllPages && selectedSection ? (
            <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={!previousSection}
                  onClick={() => previousSection && selectSection(previousSection)}
                  className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &larr; Previous
                </button>

                <p className="text-center text-sm text-[#b9a988]">
                  Page {selectedSection.page ?? "?"} of{" "}
                  {filteredSections.length > 0
                    ? filteredSections[filteredSections.length - 1].page
                    : "?"}
                </p>

                <button
                  type="button"
                  disabled={!nextSection}
                  onClick={() => nextSection && selectSection(nextSection)}
                  className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-5 shadow-lg">
            {contentSections.length > 0 ? (
              contentSections.map((section) => (
                <GuideSection
                  key={section.id}
                  section={section}
                  displayMode={displayMode}
                />
              ))
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-[#b9a988]">
                  No guide content matches your current search or status filter.
                </p>

                <button
                  type="button"
                  onClick={clearSearchAndFilters}
                  className="rounded-full border border-[#c98f3b] bg-[#3a2b1c] px-4 py-2 text-sm text-[#fff6df] transition hover:bg-[#4a3825]"
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </div>

          {!showAllPages && selectedSection ? (
            <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={!previousSection}
                  onClick={() => previousSection && selectSection(previousSection)}
                  className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &larr; Previous
                </button>

                <button
                  type="button"
                  disabled={!nextSection}
                  onClick={() => nextSection && selectSection(nextSection)}
                  className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}