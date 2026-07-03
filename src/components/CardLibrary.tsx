"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";

import CardEncounterToggle from "@/components/CardEncounterToggle";
import { cardTypeDefinitions, cardTypeLabels } from "@/data/cardTypes";
import type {
  ArydiaCardEntry,
  ArydiaCardType,
  BilingualField,
  TranslationStatus,
} from "@/data/types";
import { useEncounteredCards } from "@/hooks/useEncounteredCards";

type CardLibraryProps = {
  cards: ArydiaCardEntry[];
};

type CardTypeFilter = "all" | ArydiaCardType;
type DisplayMode = "side-by-side" | "zh-only" | "en-only";
type EncounterFilter = "all" | "encountered" | "unencountered";
type SpoilerMode = "hide-unencountered" | "show-all";
type WorkflowMode = "play" | "review";

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

const encounterFilterOptions: { value: EncounterFilter; label: string }[] = [
  { value: "all", label: "All 全部" },
  { value: "encountered", label: "Encountered 已遇到" },
  { value: "unencountered", label: "Not encountered 未遇到" },
];

const spoilerModeOptions: { value: SpoilerMode; label: string }[] = [
  { value: "hide-unencountered", label: "Hide spoilers 隱藏劇透" },
  { value: "show-all", label: "Show all 顯示全部" },
];

const workflowModeOptions: { value: WorkflowMode; label: string }[] = [
  { value: "play", label: "Play mode 遊玩模式" },
  { value: "review", label: "Translation review 翻譯檢查" },
];

const statusLabels: Record<TranslationStatus, string> = {
  draft: "Draft 草稿",
  reviewed: "Reviewed 已檢查",
  approved: "Approved 已確認",
};

function filterButtonClass(isActive: boolean) {
  return `rounded-full border px-3 py-1.5 text-sm transition ${
    isActive
      ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
      : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
  }`;
}

function fieldMatchesSearch(en: string, zh: string, search: string) {
  return `${en} ${zh}`.toLowerCase().includes(search);
}

function cardSafeMetadataMatches(card: ArydiaCardEntry, search: string) {
  const typeDefinition = cardTypeDefinitions.find(
    (definition) => definition.type === card.type,
  );

  return [
    card.id,
    card.code,
    card.type,
    card.state,
    cardTypeLabels[card.type],
    typeDefinition?.code,
    typeDefinition?.en,
    typeDefinition?.zh,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(search);
}

function cardMatchesSearch(
  card: ArydiaCardEntry,
  search: string,
  canSearchFullText: boolean,
) {
  if (search === "") return true;

  const safeMetadataMatches = cardSafeMetadataMatches(card, search);

  if (!canSearchFullText) {
    return safeMetadataMatches;
  }

  const titleMatches = fieldMatchesSearch(card.title.en, card.title.zh, search);

  const subtitleMatches = card.subtitle
    ? fieldMatchesSearch(card.subtitle.en, card.subtitle.zh, search)
    : false;

  const blockMatches = card.blocks.some((block) =>
    fieldMatchesSearch(block.content.en, block.content.zh, search),
  );

  const metadataMatches = [
    card.notes,
    ...card.tags,
    ...(card.glossaryTermIds ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(search);

  return (
    safeMetadataMatches ||
    titleMatches ||
    subtitleMatches ||
    blockMatches ||
    metadataMatches
  );
}

function countCardStatuses(card: ArydiaCardEntry) {
  const counts: Record<TranslationStatus, number> = {
    draft: 0,
    reviewed: 0,
    approved: 0,
  };

  counts[card.title.status] += 1;

  if (card.subtitle) {
    counts[card.subtitle.status] += 1;
  }

  card.blocks.forEach((block) => {
    counts[block.content.status] += 1;
  });

  return counts;
}

function countStatuses(cards: ArydiaCardEntry[]) {
  const counts: Record<TranslationStatus, number> = {
    draft: 0,
    reviewed: 0,
    approved: 0,
  };

  cards.forEach((card) => {
    const cardCounts = countCardStatuses(card);

    counts.draft += cardCounts.draft;
    counts.reviewed += cardCounts.reviewed;
    counts.approved += cardCounts.approved;
  });

  return counts;
}

function BilingualCardField({
  field,
  label,
  displayMode,
  showTranslationStatus,
}: {
  field: BilingualField;
  label: string;
  displayMode: DisplayMode;
  showTranslationStatus: boolean;
}) {
  const statusBadge = showTranslationStatus ? (
    <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] px-2 py-0.5 text-xs text-[var(--arydia-primary)]">
      {statusLabels[field.status]}
    </span>
  ) : null;

  if (displayMode === "en-only") {
    return (
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            {label}
          </p>
          {statusBadge}
        </div>
        <p className="text-sm leading-6 text-[var(--arydia-text)]">{field.en}</p>
      </div>
    );
  }

  if (displayMode === "zh-only") {
    return (
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[rgb(var(--arydia-surface-raised-rgb)/0.6)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            繁體中文
          </p>
          {statusBadge}
        </div>
        <p className="text-sm leading-6 text-[var(--arydia-strong)]">{field.zh}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            {label}
          </p>
          {statusBadge}
        </div>
        <p className="text-sm leading-6 text-[var(--arydia-text)]">{field.en}</p>
      </div>

      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[rgb(var(--arydia-surface-raised-rgb)/0.6)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            繁體中文
          </p>
          {statusBadge}
        </div>
        <p className="text-sm leading-6 text-[var(--arydia-strong)]">{field.zh}</p>
      </div>
    </div>
  );
}

function TranslationProgressBox({
  cardStatusSummary,
}: {
  cardStatusSummary: Record<TranslationStatus, number>;
}) {
  const totalTrackedFields =
    cardStatusSummary.draft +
    cardStatusSummary.reviewed +
    cardStatusSummary.approved;

  return (
    <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
        Translation Progress 翻譯進度
      </p>

      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--arydia-muted)]">Tracked fields 欄位</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--arydia-primary)]">
            {totalTrackedFields}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--arydia-muted)]">Draft 草稿</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--arydia-primary)]">
            {cardStatusSummary.draft}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--arydia-muted)]">Reviewed 已檢查</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--arydia-primary)]">
            {cardStatusSummary.reviewed}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--arydia-muted)]">Approved 已確認</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--arydia-primary)]">
            {cardStatusSummary.approved}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CardLibrary({ cards }: CardLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<CardTypeFilter>("all");
  const [displayMode, setDisplayMode] =
    useState<DisplayMode>("side-by-side");
  const [encounterFilter, setEncounterFilter] =
    useState<EncounterFilter>("all");
  const [spoilerMode, setSpoilerMode] =
    useState<SpoilerMode>("hide-unencountered");
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("play");
  const importInputRef = useRef<HTMLInputElement>(null);

  const {
    encounteredCardIds,
    encounteredCardIdList,
    isLoaded: isProgressLoaded,
    isEncountered,
    toggleEncountered,
    resetEncounteredCards,
    replaceEncounteredCards,
  } = useEncounteredCards();

  const normalisedSearch = search.trim().toLowerCase();
  const showTranslationWorkflow = workflowMode === "review";

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const encountered = encounteredCardIds.has(card.id);
      const matchesType = activeType === "all" || card.type === activeType;
      const matchesEncounter =
        encounterFilter === "all" ||
        (encounterFilter === "encountered" && encountered) ||
        (encounterFilter === "unencountered" && !encountered);
      const canSearchFullText = encountered || spoilerMode === "show-all";
      const matchesSearch = cardMatchesSearch(
        card,
        normalisedSearch,
        canSearchFullText,
      );

      return matchesType && matchesEncounter && matchesSearch;
    });
  }, [
    cards,
    activeType,
    encounterFilter,
    encounteredCardIds,
    normalisedSearch,
    spoilerMode,
  ]);

  const statusSummary = useMemo(() => countStatuses(cards), [cards]);

  const encounteredCardsInLibrary = useMemo(
    () => cards.filter((card) => encounteredCardIds.has(card.id)).length,
    [cards, encounteredCardIds],
  );

  const unencounteredCardsInLibrary = cards.length - encounteredCardsInLibrary;

  function handleResetProgress() {
    const shouldReset = window.confirm(
      "Reset all encountered card progress in this browser?",
    );

    if (shouldReset) {
      resetEncounteredCards();
    }
  }

  function handleExportProgress() {
    const payload = {
      app: "Arydia bilingual database",
      version: 1,
      exportedAt: new Date().toISOString(),
      encounteredCardIds: encounteredCardIdList,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `arydia-encounter-progress-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }

  function handleImportProgressClick() {
    importInputRef.current?.click();
  }

  async function handleImportProgressFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as
        | { encounteredCardIds?: unknown }
        | string[];

      const importedIds = Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : Array.isArray(parsed.encounteredCardIds)
          ? parsed.encounteredCardIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [];

      const knownCardIds = new Set(cards.map((card) => card.id));
      const validImportedIds = Array.from(
        new Set(importedIds.filter((id) => knownCardIds.has(id))),
      ).sort();
      const ignoredCount = importedIds.length - validImportedIds.length;

      const shouldImport = window.confirm(
        `Import ${validImportedIds.length} encountered card IDs? ${ignoredCount} unknown IDs will be ignored. This will replace the current encounter progress in this browser.`,
      );

      if (shouldImport) {
        replaceEncounteredCards(validImportedIds);
      }
    } catch (error) {
      console.warn("Could not import encounter progress.", error);
      window.alert("Could not import encounter progress. Please check the JSON file.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
          Card Library
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--arydia-strong)]">
          Arydia Card Index 卡牌索引
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--arydia-muted)]">
          This page supports two workflows: spoiler-safe play tracking and
          translation review. Play mode hides translation workflow information by
          default.
        </p>
      </section>

      <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
        <label
          htmlFor="card-search"
          className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]"
        >
          Search Cards 搜尋卡牌
        </label>

        <input
          id="card-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search English, 中文, tags, codes..."
          className="w-full rounded-md border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-4 py-2 text-[var(--arydia-text)] placeholder:text-[rgb(var(--arydia-muted-rgb)/0.6)] focus:border-[var(--arydia-primary)] focus:outline-none"
        />

        <p className="mt-3 text-xs leading-5 text-[rgb(var(--arydia-muted-rgb)/0.8)]">
          Spoiler-safe search only checks code/type metadata for unencountered
          cards while spoiler hiding is active.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Workflow Mode 工作模式
          </p>

          <div className="flex flex-wrap gap-2">
            {workflowModeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWorkflowMode(option.value)}
                className={filterButtonClass(option.value === workflowMode)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--arydia-muted)]">
            Play mode hides translation status. Review mode shows translation
            progress and draft/review badges.
          </p>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Display Mode 顯示模式
          </p>

          <div className="flex flex-wrap gap-2">
            {displayOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDisplayMode(option.value)}
                className={filterButtonClass(option.value === displayMode)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--arydia-muted)]">
            Use Chinese-only during play, or side-by-side while reviewing
            translation.
          </p>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Card Type Filter 卡牌類型篩選
          </p>

          <div className="flex flex-wrap gap-2">
            {cardTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveType(option.value)}
                className={filterButtonClass(option.value === activeType)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--arydia-muted)]">
            Showing {filteredCards.length} of {cards.length} entries.
          </p>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Encounter Filter 遇到狀態篩選
          </p>

          <div className="flex flex-wrap gap-2">
            {encounterFilterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEncounterFilter(option.value)}
                className={filterButtonClass(option.value === encounterFilter)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-[var(--arydia-muted)]">
            Progress is saved only in this browser.
          </p>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg lg:col-span-2">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Spoiler Guard 劇透保護
          </p>

          <div className="flex flex-wrap gap-2">
            {spoilerModeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSpoilerMode(option.value)}
                className={filterButtonClass(option.value === spoilerMode)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetProgress}
            className="mt-4 rounded-full border border-red-400/40 bg-[var(--arydia-bg)] px-3 py-1.5 text-sm text-red-200 transition hover:border-red-300 hover:text-red-100"
          >
            Reset encounter progress 重設遇到紀錄
          </button>
        </section>

        <section className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg lg:col-span-2">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Progress Backup
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportProgress}
              className={filterButtonClass(false)}
            >
              Export progress
            </button>

            <button
              type="button"
              onClick={handleImportProgressClick}
              className={filterButtonClass(false)}
            >
              Import progress
            </button>
          </div>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportProgressFile}
          />

          <p className="mt-4 text-sm leading-6 text-[var(--arydia-muted)]">
            Backup files only contain encountered card IDs. They do not contain
            card text, translations, or private Arydia content.
          </p>
        </section>
      </div>

      <section
        className={`grid gap-3 sm:grid-cols-2 ${
          showTranslationWorkflow ? "lg:grid-cols-6" : "lg:grid-cols-3"
        }`}
      >
        <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-surface)] p-4">
          <p className="text-sm text-[var(--arydia-muted)]">Total cards 總卡牌</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--arydia-primary)]">
            {cards.length}
          </p>
        </div>

        <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-surface)] p-4">
          <p className="text-sm text-[var(--arydia-muted)]">Encountered 已遇到</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--arydia-primary)]">
            {encounteredCardsInLibrary}
          </p>
        </div>

        <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-surface)] p-4">
          <p className="text-sm text-[var(--arydia-muted)]">Hidden / New 未遇到</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--arydia-primary)]">
            {unencounteredCardsInLibrary}
          </p>
        </div>

        {showTranslationWorkflow &&
          (["draft", "reviewed", "approved"] as TranslationStatus[]).map(
            (status) => (
              <div
                key={status}
                className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-surface)] p-4"
              >
                <p className="text-sm text-[var(--arydia-muted)]">{statusLabels[status]}</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--arydia-primary)]">
                  {statusSummary[status]}
                </p>
              </div>
            ),
          )}
      </section>

      {!isProgressLoaded && (
        <p className="text-sm text-[var(--arydia-muted)]">Loading encounter progress...</p>
      )}

      <section className="space-y-4">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => {
            const typeDefinition = cardTypeDefinitions.find(
              (definition) => definition.type === card.type,
            );
            const encountered = isEncountered(card.id);
            const shouldHideDetails =
              !encountered && spoilerMode === "hide-unencountered";
            const cardStatusSummary = countCardStatuses(card);
            const safeCardLabel = card.code
              ? `${card.code}${card.state ? ` ${card.state}` : ""}`
              : card.id;

            return (
              <article
                key={card.id}
                className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-5 shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
                      {typeDefinition?.code ?? card.type.toUpperCase()} ·{" "}
                      {cardTypeLabels[card.type]}
                      {card.code ? ` · ${card.code}` : ""}
                      {card.state ? ` ${card.state}` : ""}
                    </p>

                    {shouldHideDetails ? (
                      <>
                        <h2 className="mt-2 text-2xl font-semibold text-[var(--arydia-strong)]">
                          Spoiler-protected card 已隱藏卡牌
                        </h2>
                        <p className="mt-1 text-sm text-[var(--arydia-muted)]">
                          Safe label: {safeCardLabel}
                        </p>
                      </>
                    ) : (
                      <>
                        {displayMode !== "zh-only" && (
                          <h2 className="mt-2 text-2xl font-semibold text-[var(--arydia-strong)]">
                            {card.title.en}
                          </h2>
                        )}

                        {displayMode !== "en-only" && (
                          <p className="mt-1 text-xl font-semibold text-[var(--arydia-primary)]">
                            {card.title.zh}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-bg)] px-3 py-1 text-xs text-[var(--arydia-muted)]">
                      {encountered
                        ? "Encountered 已遇到"
                        : "Not encountered 未遇到"}
                    </span>

                    <CardEncounterToggle
                      encountered={encountered}
                      onToggle={() => toggleEncountered(card.id)}
                    />
                  </div>
                </div>

                {shouldHideDetails ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] p-4">
                      <p className="text-sm leading-6 text-[var(--arydia-muted)]">
                        This card has not been marked as encountered, so its
                        title, story text, translation text, tags, and notes are
                        hidden.
                      </p>
                    </div>

                    {showTranslationWorkflow && (
                      <TranslationProgressBox
                        cardStatusSummary={cardStatusSummary}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {showTranslationWorkflow && (
                      <div className="mt-4">
                        <TranslationProgressBox
                          cardStatusSummary={cardStatusSummary}
                        />
                      </div>
                    )}

                    {card.subtitle && (
                      <div className="mt-4">
                        <BilingualCardField
                          field={card.subtitle}
                          label="English subtitle"
                          displayMode={displayMode}
                          showTranslationStatus={showTranslationWorkflow}
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
                          showTranslationStatus={showTranslationWorkflow}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] px-2.5 py-1 text-xs text-[var(--arydia-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {card.notes && (
                      <p className="mt-4 text-xs leading-5 text-[rgb(var(--arydia-muted-rgb)/0.8)]">
                        Note: {card.notes}
                      </p>
                    )}
                  </>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-6 text-center text-[var(--arydia-muted)]">
            No card entries match your current search, card type, or encounter
            filter.
          </div>
        )}
      </section>
    </div>
  );
}
