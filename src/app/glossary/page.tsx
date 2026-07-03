import GlossaryTable from "@/components/GlossaryTable";
import { glossaryData } from "@/data/glossary";

/**
 * The main glossary page for the Arydia translation helper.
 */
export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-[var(--arydia-bg)] p-4 text-[var(--arydia-text)] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-[var(--arydia-primary)]">
          Arydia Glossary
        </h1>

        <p className="mb-6 text-sm text-[var(--arydia-muted)]">
          English / 繁體中文 terminology reference for consistent Arydia
          translation.
        </p>

        <GlossaryTable terms={glossaryData} />
      </div>
    </main>
  );
}