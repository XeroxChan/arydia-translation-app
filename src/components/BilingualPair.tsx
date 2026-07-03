import StatusBadge from "@/components/StatusBadge";
import type { TranslationStatus } from "@/data/types";

export type DisplayMode = "side-by-side" | "zh-only" | "en-only";

type BilingualPairProps = {
  en: string;
  zh: string;
  status: TranslationStatus;
  displayMode: DisplayMode;
  subtitleEn?: string;
  subtitleZh?: string;
};

export default function BilingualPair({
  en,
  zh,
  status,
  displayMode,
  subtitleEn,
  subtitleZh,
}: BilingualPairProps) {
  if (displayMode === "zh-only") {
    return (
      <div className="rounded-lg border border-[rgb(var(--arydia-primary-rgb)/0.5)] bg-[rgb(var(--arydia-surface-raised-rgb)/0.7)] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[var(--arydia-muted)]">
            {"\u7e41\u9ad4\u4e2d\u6587"}
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleZh ? (
          <p className="mb-2 text-xl font-bold leading-8 text-[var(--arydia-strong)]">
            {subtitleZh}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-lg leading-8 text-[var(--arydia-strong)]">
          {zh}
        </p>
      </div>
    );
  }

  if (displayMode === "en-only") {
    return (
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[rgb(var(--arydia-bg-rgb)/0.7)] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[var(--arydia-muted)]">
            English
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleEn ? (
          <p className="mb-2 text-lg font-bold leading-7 text-[var(--arydia-highlight)]">
            {subtitleEn}
          </p>
        ) : null}

        <p className="whitespace-pre-line leading-7 text-[var(--arydia-text)]">{en}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[rgb(var(--arydia-bg-rgb)/0.7)] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[var(--arydia-muted)]">
            English
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleEn ? (
          <p className="mb-2 text-lg font-bold leading-7 text-[var(--arydia-highlight)]">
            {subtitleEn}
          </p>
        ) : null}

        <p className="whitespace-pre-line leading-7 text-[var(--arydia-text)]">{en}</p>
      </div>

      <div className="rounded-lg border border-[rgb(var(--arydia-primary-rgb)/0.5)] bg-[rgb(var(--arydia-surface-raised-rgb)/0.7)] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[var(--arydia-muted)]">
            {"\u7e41\u9ad4\u4e2d\u6587"}
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleZh ? (
          <p className="mb-2 text-xl font-bold leading-8 text-[var(--arydia-strong)]">
            {subtitleZh}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-lg leading-8 text-[var(--arydia-strong)]">
          {zh}
        </p>
      </div>
    </div>
  );
}