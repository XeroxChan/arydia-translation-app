import GlossaryTable from "@/components/GlossaryTable";
import { glossaryData } from "@/data/glossary";

/**
 * The main glossary page for the Arydia translation helper.
 */
export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-[#1c1a17] p-4 text-[#ece3d2] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-4xl font-bold text-[#c98f3b]">
          Arydia Glossary
        </h1>

        <p className="mb-6 text-sm text-[#b9a988]">
          English / 繁體中文 terminology reference for consistent Arydia
          translation.
        </p>

        <GlossaryTable terms={glossaryData} />
      </div>
    </main>
  );
}