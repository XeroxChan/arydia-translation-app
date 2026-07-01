import GuideSection from "@/components/GuideSection";
import { quickStartGuide } from "@/data/quickStartGuide";

export default function QuickStartPage() {
  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-[#c98f3b]">
          新手快速上手指南 · Quick Start Guide
        </h1>

        <p className="mb-8 text-sm text-[#b9a988]">
          Sample bilingual guide layout. Full translated content will be added
          later in reviewed chunks.
        </p>

        <div className="rounded-xl border border-[#a9762f]/50 bg-[#2a241d] p-5 shadow-lg">
          {quickStartGuide.map((section) => (
            <GuideSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </main>
  );
}