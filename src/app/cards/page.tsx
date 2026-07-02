import CardLibrary from "@/components/CardLibrary";
import { loadCardLibrary } from "@/data/loadCardLibrary";

export default async function CardsPage() {
  const cardLibrary = await loadCardLibrary();

  return <CardLibrary cards={cardLibrary} />;
}
