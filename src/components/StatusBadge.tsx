import type { TranslationStatus } from "@/data/types";

type StatusBadgeProps = {
  status: TranslationStatus;
};

const statusStyles: Record<TranslationStatus, string> = {
  draft: "border-[#8a4a3a]/60 bg-[#8a4a3a]/20 text-[#e0b8a8]",
  reviewed: "border-[#a9762f]/60 bg-[#a9762f]/20 text-[#c98f3b]",
  approved: "border-emerald-700/60 bg-emerald-900/30 text-emerald-200",
};

const statusLabels: Record<TranslationStatus, string> = {
  draft: "Draft 草稿",
  reviewed: "Reviewed 已檢查",
  approved: "Approved 已確認",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}