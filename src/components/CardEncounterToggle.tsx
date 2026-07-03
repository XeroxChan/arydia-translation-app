"use client";

type CardEncounterToggleProps = {
  encountered: boolean;
  onToggle: () => void;
};

export default function CardEncounterToggle({
  encountered,
  onToggle,
}: CardEncounterToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={encountered}
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        encountered
          ? "border-[var(--arydia-primary)] bg-[var(--arydia-surface-raised)] text-[var(--arydia-strong)]"
          : "border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] text-[var(--arydia-muted)] hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
      }`}
    >
      {encountered ? "Encountered 已遇到" : "Mark encountered 標記已遇到"}
    </button>
  );
}
