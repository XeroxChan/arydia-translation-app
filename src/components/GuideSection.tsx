import BilingualPair, { type DisplayMode } from "@/components/BilingualPair";
import type { GuideSection as GuideSectionType } from "@/data/types";

type GuideSectionProps = {
  section: GuideSectionType;
  displayMode: DisplayMode;
};

export default function GuideSection({
  section,
  displayMode,
}: GuideSectionProps) {
  return (
    <section id={section.id} className="mb-10 scroll-mt-24">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#b9a988]">
        Page {section.page}
      </p>

      <h2 className="mb-4 border-b border-[#a9762f]/50 pb-2 text-2xl font-bold text-[#c98f3b]">
        {section.titleZh} · {section.titleEn}
      </h2>

      <div className="space-y-5">
        {section.blocks.map((block) => {
          if (block.type === "paragraph") {
            return (
              <BilingualPair
                key={block.id}
                en={block.en}
                zh={block.zh}
                status={block.status}
                displayMode={displayMode}
              />
            );
          }

          return (
            <div key={block.id} className="space-y-3">
              {block.items.map((item) => (
                <BilingualPair
                  key={item.id}
                  en={item.en}
                  zh={item.zh}
                  status={item.status}
                  displayMode={displayMode}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}