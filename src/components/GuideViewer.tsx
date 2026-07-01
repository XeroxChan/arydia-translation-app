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

function filterBlock(block: GuideBlock, status: StatusFilter): GuideBlock | null {
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

export default function GuideViewer({ sections }: GuideViewerProps) {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("side-by-side");

  const filteredSections = useMemo(() => {
    return sections
      .map((section) => {
        const filteredBlocks = section.blocks
          .filter((block) => blockMatchesStatus(block, activeStatus))
          .map((block) => filterBlock(block, activeStatus))
          .filter((block): block is GuideBlock => block !== null);

        return {
          ...section,
          blocks: filteredBlocks,
        };
      })
      .filter((section) => section.blocks.length > 0);
  }, [sections, activeStatus]);

  return (
    <div className="space-y-8">
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
            No guide content matches this status.
          </p>
        )}
      </div>
    </div>
  );
}