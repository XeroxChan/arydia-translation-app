import type { ArydiaCardEntry } from "@/data/types";

export const cardLibrary: ArydiaCardEntry[] = [
  {
    id: "sample-foe-card",
    code: "SAMPLE-FOE-001",
    type: "foe",
    title: {
      en: "Sample Foe Card",
      zh: "範例敵人卡",
      status: "draft",
    },
    subtitle: {
      en: "Placeholder combat reference",
      zh: "戰鬥參考佔位內容",
      status: "draft",
    },
    blocks: [
      {
        id: "sample-foe-rule-1",
        kind: "rule",
        label: "Card text",
        content: {
          en: "This is placeholder text for a future foe card translation.",
          zh: "這是未來敵人卡翻譯用的佔位文字。",
          status: "draft",
        },
      },
      {
        id: "sample-foe-note-1",
        kind: "note",
        label: "Translation note",
        content: {
          en: "Use glossary-controlled terms for enemy, foe, boss, and AI card.",
          zh: "敵人、小怪、頭目、AI 行動卡等術語應依照術語表統一翻譯。",
          status: "reviewed",
        },
      },
    ],
    notes:
      "Private placeholder only. Do not paste full copyrighted Arydia card text into the public repository.",
    tags: ["combat", "foe", "placeholder"],
    glossaryTermIds: ["foe", "boss", "foe-cards"],
  },
  {
    id: "sample-key-card",
    code: "SAMPLE-KEY-001",
    type: "key",
    title: {
      en: "Sample Key Card",
      zh: "範例關鍵卡",
      status: "reviewed",
    },
    subtitle: {
      en: "Placeholder party inventory reference",
      zh: "隊伍物品欄參考佔位內容",
      status: "reviewed",
    },
    blocks: [
      {
        id: "sample-key-rule-1",
        kind: "rule",
        label: "Card text",
        content: {
          en: "This is placeholder text for a future key card translation.",
          zh: "這是未來關鍵卡翻譯用的佔位文字。",
          status: "reviewed",
        },
      },
      {
        id: "sample-key-note-1",
        kind: "note",
        label: "Translation note",
        content: {
          en: "Keep item names, effects, and keywords consistent with the glossary.",
          zh: "物品名稱、效果與關鍵字應與術語表保持一致。",
          status: "approved",
        },
      },
    ],
    notes:
      "Use this structure later for real reviewed excerpts or private local data.",
    tags: ["key", "inventory", "placeholder"],
    glossaryTermIds: ["key-cards", "keyword-interaction"],
  },
  {
    id: "sample-ref-card",
    code: "SAMPLE-REF-001",
    type: "ref",
    title: {
      en: "Sample Rules Card",
      zh: "範例規則卡",
      status: "approved",
    },
    blocks: [
      {
        id: "sample-ref-reminder-1",
        kind: "reminder",
        label: "Rule reminder",
        content: {
          en: "This entry can be used for short private rule reminders during play.",
          zh: "這類條目可用於遊玩時快速查看私人規則提醒。",
          status: "approved",
        },
      },
    ],
    notes:
      "Keep this short. Avoid storing full rulebook passages in public code.",
    tags: ["rules", "reference", "placeholder"],
    glossaryTermIds: ["rules-cards", "quick-start-guide", "adventure-mode"],
  },
];