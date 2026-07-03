export type TranslationStatus = "draft" | "reviewed" | "approved";

export type BilingualListItem = {
  id: string;
  en: string;
  zh: string;
  status: TranslationStatus;
};

export type GuideBlock =
  | {
      id: string;
      type: "paragraph";
      en: string;
      zh: string;
      status: TranslationStatus;
    }
  | {
      id: string;
      type: "list";
      items: BilingualListItem[];
    };

export type GuideSection = {
  id: string;
  page: number;
  order?: number;
  titleEn: string;
  titleZh: string;
  blocks: GuideBlock[];
};

export type BilingualField = {
  en: string;
  zh: string;
  status: TranslationStatus;
};

export type ArydiaCardType =
  | "npc"
  | "job"
  | "thr"
  | "foe"
  | "key"
  | "day"
  | "evt"
  | "trv"
  | "ref"
  | "poi"
  | "character"
  | "skill-tree"
  | "path-rules";

export type CardTextBlockKind =
  | "narration"
  | "rule"
  | "dialogue"
  | "choice"
  | "check"
  | "reward"
  | "reminder"
  | "effect"
  | "setup"
  | "note";

export type CardTextBlock = {
  id: string;
  kind: CardTextBlockKind;
  label?: string;
  content: BilingualField;
};

export type ArydiaCardEntry = {
  id: string;
  code?: string;
  type: ArydiaCardType;
  state?: string;
  title: BilingualField;
  subtitle?: BilingualField;
  blocks: CardTextBlock[];
  notes?: string;
  tags: string[];
  glossaryTermIds?: string[];
};