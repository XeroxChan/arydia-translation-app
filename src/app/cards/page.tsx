import CardLibrary from "@/components/CardLibrary";
import { cardLibrary } from "@/data/cardLibrary";

export default function CardsPage() {
  return <CardLibrary cards={cardLibrary} />;
}