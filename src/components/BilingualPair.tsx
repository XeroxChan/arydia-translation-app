import StatusBadge from "@/components/StatusBadge";
import type { TranslationStatus } from "@/data/types";

export type DisplayMode = "side-by-side" | "zh-only" | "en-only";

type BilingualPairProps = {
  en: string;
  zh: string;
  status: TranslationStatus;
  displayMode: DisplayMode;
};

export default function BilingualPair({
  en,
  zh,
  status,
  displayMode,
}: BilingualPairProps) {
  if (displayMode === "zh-only") {
    return (
      <div className="rounded-lg border border-[#c98f3b]/50 bg-[#3a2b1c]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            繁體中文
          </span>
          <StatusBadge status={status} />
        </div>

        <p className="text-lg leading-8 text-[#fff6df]">{zh}</p>
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

        <p className="leading-7 text-[#ece3d2]">{en}</p>
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

        <p className="leading-7 text-[#ece3d2]">{en}</p>
      </div>

      <div className="rounded-lg border border-[#c98f3b]/50 bg-[#3a2b1c]/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="block text-xs uppercase tracking-wider text-[#b9a988]">
            繁體中文
          </span>
          <StatusBadge status={status} />
        </div>

        <p className="text-lg leading-8 text-[#fff6df]">{zh}</p>
      </div>
    </div>
  );
}