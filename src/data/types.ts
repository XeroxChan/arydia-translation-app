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
  titleEn: string;
  titleZh: string;
  blocks: GuideBlock[];
};