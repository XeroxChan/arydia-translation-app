import type { GuideSection } from "@/data/types";

type SectionNavProps = {
  sections: GuideSection[];
};

function getPageLabel(section: GuideSection) {
  return typeof section.page === "number" ? `Page ${section.page}` : "Page ?";
}

export default function SectionNav({ sections }: SectionNavProps) {
  return (
    <nav className="mb-8 rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.4)] bg-[var(--arydia-surface)] p-4 shadow-lg">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
        Contents
      </p>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-[rgb(var(--arydia-border-rgb)/0.3)] bg-[var(--arydia-bg)] px-3 py-1.5 text-sm text-[var(--arydia-muted)] transition hover:border-[var(--arydia-primary)] hover:text-[var(--arydia-text)]"
          >
            <span className="mr-1 text-[var(--arydia-primary)]">{section.titleZh}</span>
            <span className="mr-1 text-xs opacity-75">{section.titleEn}</span>
            <span className="text-xs text-[rgb(var(--arydia-muted-rgb)/0.7)]">
              ({getPageLabel(section)})
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
