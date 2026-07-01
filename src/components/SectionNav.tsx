import type { GuideSection } from "@/data/quickStartGuide";

type SectionNavProps = {
  sections: GuideSection[];
};

export default function SectionNav({ sections }: SectionNavProps) {
  return (
    <nav className="mb-8 rounded-xl border border-[#a9762f]/40 bg-[#2a241d] p-4 shadow-lg">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b9a988]">
        Contents
      </p>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-[#a9762f]/30 bg-[#1c1a17] px-3 py-1.5 text-sm text-[#b9a988] transition hover:border-[#c98f3b] hover:text-[#ece3d2]"
          >
            <span className="mr-1 text-[#c98f3b]">{section.titleZh}</span>
            <span className="text-xs opacity-75">{section.titleEn}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}