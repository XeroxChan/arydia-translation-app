"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
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
  basePath?: string;
  initialPage?: string;
  initialSectionId?: string;
  initialShowAll?: boolean;
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

function resolveInitialSectionId(
  sections: GuideSectionType[],
  initialPage?: string,
  initialSectionId?: string,
) {
  const matchedSection =
    (initialPage
      ? sections.find((section) => String(section.page) === initialPage)
      : undefined) ??
    (initialSectionId
      ? sections.find((section) => section.id === initialSectionId)
      : undefined);

  return matchedSection?.id ?? sections[0]?.id ?? "";
}

function getSectionLabel(section: GuideSectionType) {
  const page = section.page ?? "?";
  return `Page ${page} - ${section.titleZh} \u00b7 ${section.titleEn}`;
}

function getSectionHref(
  basePath: string,
  section: GuideSectionType,
  showAllPages = false,
) {
  const params = new URLSearchParams();

  if (section.page !== undefined) {
    params.set("page", String(section.page));
  } else {
    params.set("section", section.id);
  }

  if (showAllPages) {
    params.set("mode", "all");
  }

  return `${basePath}?${params.toString()}`;
}

function updateUrlForSection(
  basePath: string,
  section: GuideSectionType,
  showAllPages = false,
) {
  if (typeof window === "undefined") return;

  const href = getSectionHref(basePath, section, showAllPages);
  window.history.replaceState(null, "", href);
}

function scrollToReaderTop() {
  if (typeof window === "undefined") return;

  window.requestAnimationFrame(() => {
    const readerContent = document.getElementById("guide-reader-content");

    if (readerContent) {
      readerContent.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

export default function GuideViewer({
  sections,
  basePath = "/rulebook",
  initialPage,
  initialSectionId,
  initialShowAll = false,
}: GuideViewerProps) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("side-by-side");
  const [search, setSearch] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(() =>
    resolveInitialSectionId(sections, initialPage, initialSectionId),
  );
  const [showAllPages, setShowAllPages] = useState(initialShowAll);

  const normalisedSearch = search.trim().toLowerCase();

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

  function selectSection(
    event: MouseEvent<HTMLAnchorElement>,
    section: GuideSectionType,
  ) {
    event.preventDefault();
    setSelectedSectionId(section.id);
    setShowAllPages(false);
    updateUrlForSection(basePath, section, false);
    scrollToReaderTop();
  }

  function toggleShowAllPages(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const nextShowAllPages = !showAllPages;
    setShowAllPages(nextShowAllPages);

    if (selectedSection) {
      updateUrlForSection(basePath, selectedSection, nextShowAllPages);
    }
  }

  function clearSearchAndFilters() {
    setSearch("");
    setActiveStatus("all");
  }

  const showAllHref = selectedSection
    ? getSectionHref(basePath, selectedSection, true)
    : `${basePath}?mode=all`;

  const singlePageHref = selectedSection
    ? getSectionHref(basePath, selectedSection, false)
    : basePath;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
        <label
          htmlFor="guide-search"
          className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]"
        >
          Search Guide
        </label>

        <input
          id="guide-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, Chinese, section titles..."
          className="w-full rounded-md border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-[var(--arydia-text)] placeholder:text-[rgb(var(--arydia-muted-rgb)/0.6)] focus:border-[var(--arydia-primary)] focus:outline-none"
        />
      </section>

      <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
              Review Summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--arydia-strong)]">
              Translation progress
            </h2>
          </div>

          <p className="text-sm text-[var(--arydia-muted)]">
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
              className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] p-4"
            >
              <p className="text-sm text-[var(--arydia-muted)]">{option.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--arydia-primary)]">
                {statusSummary[option.value]}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgb(var(--arydia-muted-rgb)/0.7)]">
                {option.helper}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg lg:col-span-2">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
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
                      ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                      : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-[var(--arydia-muted)]">
            {filteredSections.length} of {sections.length} sections match the
            current filters.
          </p>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
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
                      ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                      : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="hidden rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg md:block">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
                  Contents
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--arydia-strong)]">
                  Page navigator
                </h2>
              </div>

              <a
                href={showAllPages ? singlePageHref : showAllHref}
                onClick={toggleShowAllPages}
                className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-3 py-1 text-xs text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
              >
                {showAllPages ? "Single page" : "Show all"}
              </a>
            </div>

            <div className="max-h-[calc(100vh-12rem)] space-y-2 overflow-y-auto pr-1">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => {
                  const isActive =
                    !showAllPages && selectedSection?.id === section.id;

                  return (
                    <a
                      key={section.id}
                      href={getSectionHref(basePath, section)}
                      onClick={(event) => selectSection(event, section)}
                      className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                          : "border-[rgb(var(--arydia-border-rgb)/0.25)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-[0.16em] text-[var(--arydia-primary)]">
                        Page {section.page ?? "?"}
                      </span>
                      <span className="mt-1 block font-medium text-[var(--arydia-strong)]">
                        {section.titleZh}
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--arydia-muted)]">
                        {section.titleEn}
                      </span>
                    </a>
                  );
                })
              ) : (
                <p className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.25)] bg-[var(--arydia-bg)] p-3 text-sm text-[var(--arydia-muted)]">
                  No pages match the current filters.
                </p>
              )}
            </div>
          </div>

          <details className="sticky top-20 z-20 rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg md:hidden">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
              Jump to page
            </summary>

            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {filteredSections.map((section) => {
                const isActive =
                  !showAllPages && selectedSection?.id === section.id;

                return (
                  <a
                    key={section.id}
                    href={getSectionHref(basePath, section)}
                    onClick={(event) => selectSection(event, section)}
                    className={`block rounded-lg border px-3 py-2 text-sm transition ${
                      isActive
                        ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
                        : "border-[rgb(var(--arydia-border-rgb)/0.25)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                    }`}
                  >
                    {getSectionLabel(section)}
                  </a>
                );
              })}
            </div>

            <a
              href={showAllPages ? singlePageHref : showAllHref}
              onClick={toggleShowAllPages}
              className="mt-3 block rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-3 py-2 text-center text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
            >
              {showAllPages ? "Single page mode" : "Show all pages"}
            </a>
          </details>
        </aside>

        <main className="min-w-0 space-y-4">
          {!showAllPages && selectedSection ? (
            <div className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousSection ? (
                  <a
                    href={getSectionHref(basePath, previousSection)}
                    onClick={(event) => selectSection(event, previousSection)}
                    className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  >
                    &larr; Previous
                  </a>
                ) : (
                  <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] opacity-40">
                    &larr; Previous
                  </span>
                )}

                <p className="text-center text-sm text-[var(--arydia-muted)]">
                  Page {selectedSection.page ?? "?"} of{" "}
                  {filteredSections.length > 0
                    ? filteredSections[filteredSections.length - 1].page
                    : "?"}
                </p>

                {nextSection ? (
                  <a
                    href={getSectionHref(basePath, nextSection)}
                    onClick={(event) => selectSection(event, nextSection)}
                    className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  >
                    Next &rarr;
                  </a>
                ) : (
                  <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] opacity-40">
                    Next &rarr;
                  </span>
                )}
              </div>
            </div>
          ) : null}

          <div
            id="guide-reader-content"
            className="scroll-mt-24 rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.5)] bg-[var(--arydia-surface)] p-5 shadow-lg"
          >
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
                <p className="text-[var(--arydia-muted)]">
                  No guide content matches your current search or status filter.
                </p>

                <button
                  type="button"
                  onClick={clearSearchAndFilters}
                  className="rounded-full border border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] px-4 py-2 text-sm text-[var(--arydia-strong)] transition hover:bg-[var(--arydia-surface-hover)]"
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </div>

          {!showAllPages && selectedSection ? (
            <div className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousSection ? (
                  <a
                    href={getSectionHref(basePath, previousSection)}
                    onClick={(event) => selectSection(event, previousSection)}
                    className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  >
                    &larr; Previous
                  </a>
                ) : (
                  <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] opacity-40">
                    &larr; Previous
                  </span>
                )}

                {nextSection ? (
                  <a
                    href={getSectionHref(basePath, nextSection)}
                    onClick={(event) => selectSection(event, nextSection)}
                    className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
                  >
                    Next &rarr;
                  </a>
                ) : (
                  <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-center text-sm text-[var(--arydia-muted)] opacity-40">
                    Next &rarr;
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}