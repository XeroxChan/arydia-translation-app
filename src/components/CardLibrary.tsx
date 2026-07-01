"use client";

import { useMemo, useState } from "react";
import { cardTypeDefinitions, cardTypeLabels } from "@/data/cardTypes";
import type {
  ArydiaCardEntry,
  ArydiaCardType,
  BilingualField,
  TranslationStatus,
} from "@/data/types";

type CardLibraryProps = {
  cards: ArydiaCardEntry[];
};

type CardTypeFilter = "all" | ArydiaCardType;
type DisplayMode = "side-by-side" | "zh-only" | "en-only";

const cardTypeOptions: { value: CardTypeFilter; label: string }[] = [
  { value: "all", label: "All 全部" },
  ...cardTypeDefinitions.map((definition) => ({
    value: definition.type,
    label: `${definition.code} · ${definition.en} ${definition.zh}`,
  })),
];

const displayOptions: { value: DisplayMode; label: string }[] = [
  { value: "side-by-side", label: "Side by side 對照" },
  { value: "zh-only", label: "中文 only" },
  { value: "en-only", label: "English only" },
];

const statusLabels: Record<TranslationStatus, string> = {
  draft: "Draft 草稿",
  reviewed: "Reviewed 已檢查",
  approved: "Approved 已確認",
};

function fieldMatchesSearch(en: string, zh: string, search: string) {
  return `${en} ${zh}`.toLowerCase().includes(search);
}

function cardMatchesSearch(card: ArydiaCardEntry, search: string) {
  if (search === "") return true;

  const titleMatches = fieldMatchesSearch(card.title.en, card.title.zh, search);

  const subtitleMatches = card.subtitle
    ? fieldMatchesSearch(card.subtitle.en, card.subtitle.zh, search)
    : false;

  const blockMatches = card.blocks.some((block) =>
    fieldMatchesSearch(block.content.en, block.content.zh, search),
  );

  const typeDefinition = cardTypeDefinitions.find(
    (definition) => definition.type === card.type,
  );

  const typeMatches = [
    cardTypeLabels[card.type],
    typeDefinition?.code,
    typeDefinition?.en,
    typeDefinition?.zh,
    typeDefinition?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(search);

  const metadataMatches = [
    card.code,
    card.type,
    card.state,
    card.notes,
    ...card.tags,
    ...(card.glossaryTermIds ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(search);

  return (
    titleMatches ||
    subtitleMatches ||
    blockMatches ||
    typeMatches ||
    metadataMatches
  );
}

function countStatuses(cards: ArydiaCardEntry[]) {
  const counts: Record<TranslationStatus, number> = {
    draft: 0,
    reviewed: 0,
    approved: 0,
  };

  cards.forEach((card) => {
    counts[card.title.status] += 1;

    if (card.subtitle) {
      counts[card.subtitle.status] += 1;
    }

    card.blocks.forEach((block) => {
      counts[block.content.status] += 1;
    });
  });

  return counts;
}

function BilingualCardField({
  field,
  label,
  displayMode,
}: {
  field: BilingualField;
  label: string;
  displayMode: DisplayMode;
}) {
  if (displayMode === "en-only") {
    return (
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#1c1a17] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            {label}
          </p>
          <span className="rounded-full border border-[#a9762f]/40 px-2 py-0.5 text-xs text-[#c98f3b]">
            {statusLabels[field.status]}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#ece3d2]">{field.en}</p>
      </div>
    );
  }

  if (displayMode === "zh-only") {
    return (
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#3a2b1c]/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            繁體中文
          </p>
          <span className="rounded-full border border-[#a9762f]/40 px-2 py-0.5 text-xs text-[#c98f3b]">
            {statusLabels[field.status]}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#fff6df]">{field.zh}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#1c1a17] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            {label}
          </p>
          <span className="rounded-full border border-[#a9762f]/40 px-2 py-0.5 text-xs text-[#c98f3b]">
            {statusLabels[field.status]}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#ece3d2]">{field.en}</p>
      </div>

      <div className="rounded-lg border border-[#a9762f]/40 bg-[#3a2b1c]/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            繁體中文
          </p>
          <span className="rounded-full border border-[#a9762f]/40 px-2 py-0.5 text-xs text-[#c98f3b]">
            {statusLabels[field.status]}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#fff6df]">{field.zh}</p>
      </div>
    </div>
  );
}

export default function CardLibrary({ cards }: CardLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<CardTypeFilter>("all");
  const [displayMode, setDisplayMode] =
    useState<DisplayMode>("side-by-side");

  const normalisedSearch = search.trim().toLowerCase();

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesType = activeType === "all" || card.type === activeType;
      const matchesSearch = cardMatchesSearch(card, normalisedSearch);

      return matchesType && matchesSearch;
    });
  }, [cards, activeType, normalisedSearch]);

  const statusSummary = useMemo(() => countStatuses(cards), [cards]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
          Card Library
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#fff6df]">
          Arydia Card Index 卡牌索引
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#b9a988]">
          This page is a private-use structure for future card translations.
          Current entries are placeholders only, so no full copyrighted card text
          is stored in the public app.
        </p>
      </section>

      <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
        <label
          htmlFor="card-search"
          className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#b9a988]"
        >
          Search Cards 搜尋卡牌
        </label>

        <input
          id="card-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, 中文, tags, codes..."
          className="w-full rounded-md border border-[#a9762f]/40 bg-[#1c1a17] px-4 py-2 text-[#ece3d2] placeholder:text-[#b9a988]/60 focus:border-[#c98f3b] focus:outline-none"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Card Type Filter 卡牌類型篩選
          </p>

          <div className="flex flex-wrap gap-2">
            {cardTypeOptions.map((option) => {
              const isActive = option.value === activeType;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveType(option.value)}
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
            Showing {filteredCards.length} of {cards.length} entries.
          </p>
        </section>

        <section className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
            Display Mode 顯示模式
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

          <p className="mt-4 text-sm text-[#b9a988]">
            Use Chinese-only during play, or side-by-side while reviewing
            translation.
          </p>
        </section>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {(["draft", "reviewed", "approved"] as TranslationStatus[]).map(
          (status) => (
            <div
              key={status}
              className="rounded-lg border border-[#a9762f]/30 bg-[#2a241d] p-4"
            >
              <p className="text-sm text-[#b9a988]">{statusLabels[status]}</p>
              <p className="mt-2 text-3xl font-semibold text-[#c98f3b]">
                {statusSummary[status]}
              </p>
            </div>
          ),
        )}
      </section>

      <section className="space-y-4">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => {
            const typeDefinition = cardTypeDefinitions.find(
              (definition) => definition.type === card.type,
            );

            return (
              <article
                key={card.id}
                className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-5 shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b9a988]">
                      {typeDefinition?.code ?? card.type.toUpperCase()} ·{" "}
                      {cardTypeLabels[card.type]}
                      {card.code ? ` · ${card.code}` : ""}
                      {card.state ? ` ${card.state}` : ""}
                    </p>

                    {displayMode !== "zh-only" && (
                      <h2 className="mt-2 text-2xl font-semibold text-[#fff6df]">
                        {card.title.en}
                      </h2>
                    )}

                    {displayMode !== "en-only" && (
                      <p className="mt-1 text-xl font-semibold text-[#c98f3b]">
                        {card.title.zh}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full border border-[#a9762f]/40 bg-[#1c1a17] px-3 py-1 text-xs text-[#b9a988]">
                    {statusLabels[card.title.status]}
                  </span>
                </div>

                {card.subtitle && (
                  <div className="mt-4">
                    <BilingualCardField
                      field={card.subtitle}
                      label="English subtitle"
                      displayMode={displayMode}
                    />
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  {card.blocks.map((block) => (
                    <BilingualCardField
                      key={block.id}
                      field={block.content}
                      label={block.label ?? block.kind}
                      displayMode={displayMode}
                    />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#a9762f]/30 bg-[#1c1a17] px-2.5 py-1 text-xs text-[#b9a988]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {card.notes && (
                  <p className="mt-4 text-xs leading-5 text-[#b9a988]/80">
                    Note: {card.notes}
                  </p>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-6 text-center text-[#b9a988]">
            No card entries match your current search or card type filter.
          </div>
        )}
      </section>
    </div>
  );
}