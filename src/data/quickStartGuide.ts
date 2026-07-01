export type BilingualListItem = {
  id: string;
  en: string;
  zh: string;
};

export type GuideBlock =
  | {
      id: string;
      type: "paragraph";
      en: string;
      zh: string;
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

export const quickStartGuide: GuideSection[] = [
  {
    id: "sample-welcome",
    page: 1,
    titleEn: "Welcome",
    titleZh: "歡迎",
    blocks: [
      {
        id: "welcome-intro",
        type: "paragraph",
        en: "This is a sample bilingual guide section. The real guide content will be added later in small reviewed chunks.",
        zh: "這是一段雙語指南範例。真正的指南內容之後會以小段落形式加入，並逐段檢查翻譯。",
      },
      {
        id: "translation-goals",
        type: "list",
        items: [
          {
            id: "goal-accuracy",
            en: "Keep rules accurate and avoid changing game meaning.",
            zh: "保持規則準確，避免改變遊戲原意。",
          },
          {
            id: "goal-glossary",
            en: "Use the glossary to keep important terms consistent.",
            zh: "使用術語表，確保重要詞彙翻譯一致。",
          },
          {
            id: "goal-ipad",
            en: "Make the layout easy to read on iPad during gameplay.",
            zh: "讓版面在遊戲過程中也能方便於 iPad 閱讀。",
          },
        ],
      },
    ],
  },
];