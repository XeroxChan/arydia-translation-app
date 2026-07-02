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
          ? "border-[#c98f3b] bg-[#3a2b1c] text-[#fff6df]"
          : "border-[#a9762f]/30 bg-[#1c1a17] text-[#b9a988] hover:border-[#c98f3b] hover:text-[#ece3d2]"
      }`}
    >
      {encountered ? "Encountered 已遇到" : "Mark encountered 標記已遇到"}
    </button>
  );
}
