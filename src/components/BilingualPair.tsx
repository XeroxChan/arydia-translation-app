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
      <div className="rounded-lg border border-[#c98f3b]/50 bg-[#3a2b1c]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            {"\u7e41\u9ad4\u4e2d\u6587"}
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleZh ? (
          <p className="mb-2 text-xl font-bold leading-8 text-[#fff6df]">
            {subtitleZh}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-lg leading-8 text-[#fff6df]">
          {zh}
        </p>
      </div>
    );
  }

  if (displayMode === "en-only") {
    return (
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#1c1a17]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            English
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleEn ? (
          <p className="mb-2 text-lg font-bold leading-7 text-[#fff1cf]">
            {subtitleEn}
          </p>
        ) : null}

        <p className="whitespace-pre-line leading-7 text-[#ece3d2]">{en}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-[#a9762f]/40 bg-[#1c1a17]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            English
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleEn ? (
          <p className="mb-2 text-lg font-bold leading-7 text-[#fff1cf]">
            {subtitleEn}
          </p>
        ) : null}

        <p className="whitespace-pre-line leading-7 text-[#ece3d2]">{en}</p>
      </div>

      <div className="rounded-lg border border-[#c98f3b]/50 bg-[#3a2b1c]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            {"\u7e41\u9ad4\u4e2d\u6587"}
          </span>
          <StatusBadge status={status} />
        </div>

        {subtitleZh ? (
          <p className="mb-2 text-xl font-bold leading-8 text-[#fff6df]">
            {subtitleZh}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-lg leading-8 text-[#fff6df]">
          {zh}
        </p>
      </div>
    </div>
  );
}