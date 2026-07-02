import type { GuideSection as GuideSectionType } from "@/data/types";

export const rulebookGuide: GuideSectionType[] = [
  {
    id: "rulebook-schema-discovery-demo",
    page: 0,
    titleEn: "Rulebook schema discovery",
    titleZh: "規則書資料結構探索",
    blocks: [
      {
        id: "rulebook-demo-purpose",
        type: "paragraph",
        en: "This is safe demo content for the public app. Real rulebook translation content belongs only in ignored private files.",
        zh: "這是公開 app 使用的安全範例內容。真正的規則書翻譯內容只應放在已忽略的私人檔案中。",
        status: "reviewed"
      },
      {
        id: "rulebook-demo-workflow",
        type: "list",
        items: [
          {
            id: "rulebook-demo-translate-privately",
            en: "Translate rulebook sections privately in small chunks.",
            zh: "以小段方式在私人檔案中翻譯規則書章節。",
            status: "reviewed"
          },
          {
            id: "rulebook-demo-extract-schema",
            en: "Extract public-safe database design notes without copying rulebook text.",
            zh: "整理不含規則書原文的公開安全資料庫設計筆記。",
            status: "reviewed"
          },
          {
            id: "rulebook-demo-refine-card-types",
            en: "Use those notes to refine card type storage.",
            zh: "用這些筆記改善不同卡牌類型的儲存結構。",
            status: "draft"
          }
        ]
      }
    ]
  }
];
