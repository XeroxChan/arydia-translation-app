"use client";

import { useMemo, useState } from "react";
import GuideSection from "@/components/GuideSection";
import SectionNav from "@/components/SectionNav";
import type { DisplayMode } from "@/components/BilingualPair";
import type {
  GuideBlock,
  GuideSection as GuideSectionType,
  TranslationStatus,
} from "@/data/quickStartGuide";

type StatusFilter = "all" | TranslationStatus;

type GuideViewerProps = {
  sections: GuideSectionType[];
};

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All 全部" },
  { value: "draft", label: "Draft 草稿" },
  { value: "reviewed", label: "Reviewed 已檢查" },
  { value: "approved", label: "Approved 已確認" },
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "side-by-side", label: "Side by side 對照" },
  { value: "zh-only", label: "中文 only" },
  { value: "en-only", label: "English only" },
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

function blockMatchesSearch(block: GuideBlock, search: string) {
  if (search === "") return true;

  if (block.type === "paragraph") {
    return `${block.en} ${block.zh}`.toLowerCase().includes(search);
  }

  return block.items.some((item) =>
    `${item.en} ${item.zh}`.toLowerCase().includes(search),
  );
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

export default function GuideViewer({ sections }: GuideViewerProps) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("side-by-side");
  const [search, setSearch] = useState("");

  const normalisedSearch = search.trim().toLowerCase();

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

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
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
          placeholder="Search English, 中文, section titles..."
          className="w-full rounded-md border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-[#ece3d2] placeholder:text-[#b9a988]/60 focus:border-[#c98f3b] focus:outline-none"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
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
            Showing {filteredSections.length} of {sections.length} sections.
          </p>
        </div>

        <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
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
        </div>
      </div>

      <SectionNav sections={filteredSections} />

      <div className="rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-5 shadow-lg">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <GuideSection
              key={section.id}
              section={section}
              displayMode={displayMode}
            />
          ))
        ) : (
          <p className="text-center text-[#b9a988]">
            No guide content matches your current search or status filter.
          </p>
        )}
      </div>
    </div>
  );
}