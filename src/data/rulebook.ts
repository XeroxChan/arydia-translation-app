import type { GuideSection as GuideSectionType } from "@/data/types";

export const rulebookGuide: GuideSectionType[] = [
  {
    id: "rulebook-translation-demo",
    page: 0,
    titleEn: "Rulebook translation workspace",
    titleZh: "\u898f\u5247\u66f8\u7ffb\u8b6f\u5de5\u4f5c\u5340",
    blocks: [
      {
        id: "rulebook-demo-purpose",
        type: "paragraph",
        en: "This is safe demo content for the public app. Real rulebook translation content belongs only in ignored private files.",
        zh: "\u9019\u662f\u516c\u958b app \u4f7f\u7528\u7684\u5b89\u5168\u7bc4\u4f8b\u5167\u5bb9\u3002\u771f\u6b63\u7684\u898f\u5247\u66f8\u7ffb\u8b6f\u5167\u5bb9\u53ea\u61c9\u653e\u5728\u5df2\u5ffd\u7565\u7684\u79c1\u4eba\u6a94\u6848\u4e2d\u3002",
        status: "reviewed"
      },
      {
        id: "rulebook-demo-workflow",
        type: "list",
        items: [
          {
            id: "rulebook-demo-translate-privately",
            en: "Translate rulebook sections privately in small chunks.",
            zh: "\u4ee5\u5c0f\u6bb5\u65b9\u5f0f\u5728\u79c1\u4eba\u6a94\u6848\u4e2d\u7ffb\u8b6f\u898f\u5247\u66f8\u7ae0\u7bc0\u3002",
            status: "reviewed"
          },
          {
            id: "rulebook-demo-review-side-by-side",
            en: "Review English and Traditional Chinese side by side.",
            zh: "\u4ee5\u82f1\u6587\u8207\u7e41\u9ad4\u4e2d\u6587\u5c0d\u7167\u65b9\u5f0f\u6aa2\u67e5\u7ffb\u8b6f\u3002",
            status: "reviewed"
          }
        ]
      }
    ]
  }
];
