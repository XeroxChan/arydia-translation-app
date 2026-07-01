import type { ArydiaCardType } from "@/data/types";

export type CardTypeDefinition = {
  type: ArydiaCardType;
  code: string;
  count: number;
  en: string;
  zh: string;
  description?: string;
};

export const cardTypeDefinitions: CardTypeDefinition[] = [
  {
    type: "npc",
    code: "NPC",
    count: 165,
    en: "NPC cards",
    zh: "NPC 卡（非玩家角色）",
  },
  {
    type: "job",
    code: "JOB",
    count: 34,
    en: "Job cards",
    zh: "任務卡",
  },
  {
    type: "thr",
    code: "THR",
    count: 54,
    en: "Threat cards",
    zh: "威脅卡",
  },
  {
    type: "foe",
    code: "FOE",
    count: 203,
    en: "Foe cards",
    zh: "敵人卡",
  },
  {
    type: "key",
    code: "KEY",
    count: 188,
    en: "Key cards",
    zh: "關鍵卡",
  },
  {
    type: "day",
    code: "DAY",
    count: 13,
    en: "Day cards",
    zh: "日卡",
  },
  {
    type: "evt",
    code: "EVT",
    count: 292,
    en: "Event cards",
    zh: "事件卡",
  },
  {
    type: "trv",
    code: "TRV",
    count: 70,
    en: "Travel cards",
    zh: "旅行卡",
  },
  {
    type: "ref",
    code: "REF",
    count: 20,
    en: "Rules cards",
    zh: "規則卡",
    description: "General rules reference cards.",
  },
  {
    type: "poi",
    code: "POI",
    count: 140,
    en: "Point of Interest cards",
    zh: "探索點卡",
  },
  {
    type: "character",
    code: "PC",
    count: 9,
    en: "Character cards",
    zh: "角色卡",
    description: "每角色 1 張",
  },
  {
    type: "skill-tree",
    code: "SKILL TREE",
    count: 6,
    en: "Skill Tree card",
    zh: "技能樹卡",
    description: "每路徑 1 張",
  },
  {
    type: "path-rules",
    code: "PATH RULES",
    count: 102,
    en: "Rules cards",
    zh: "規則卡",
    description: "每路徑 17 張，共 102 張",
  },
];

export const cardTypeLabels: Record<ArydiaCardType, string> = {
  npc: "NPC 卡（非玩家角色）",
  job: "任務卡",
  thr: "威脅卡",
  foe: "敵人卡",
  key: "關鍵卡",
  day: "日卡",
  evt: "事件卡",
  trv: "旅行卡",
  ref: "規則卡",
  poi: "探索點卡",
  character: "角色卡",
  "skill-tree": "技能樹卡",
  "path-rules": "規則卡",
};