import GuideViewer from "@/components/GuideViewer";
import { loadQuickStartGuide } from "@/data/loadQuickStartGuide";

export default async function QuickStartPage() {
  const quickStartGuide = await loadQuickStartGuide();

  return (
    <main className="min-h-screen bg-[var(--arydia-bg)] p-4 text-[var(--arydia-text)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 rounded-xl border border-[rgb(var(--arydia-border-rgb)/0.5)] bg-[var(--arydia-surface)] p-6 shadow-lg">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[var(--arydia-muted)]">
            Bilingual Guide
          </p>

          <h1 className="mb-3 text-4xl font-bold text-[var(--arydia-primary)]">
            新手快速上手指南 · Quick Start Guide
          </h1>

          <p className="max-w-3xl text-sm leading-7 text-[var(--arydia-muted)]">
            Sample bilingual guide layout. Full translated content will be added
            later in reviewed chunks.
          </p>
        </section>

        <GuideViewer sections={quickStartGuide} />
      </div>
    </main>
  );
}
