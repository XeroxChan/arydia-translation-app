/**
 * Defines the structure for a single glossary term.
 * This interface ensures all glossary entries have a consistent shape.
 */
export interface GlossaryTerm {
  /** The unique identifier for the term (e.g., the English term in lowercase). */
  id: string;
  /** The English name of the term. */
  en: string;
  /** The Traditional Chinese translation (繁體中文). */
  zh: string;
  /** A detailed explanation or note (備註). */
  description?: string;
  /** Tags for categorization (分類), e.g., "rule", "item", "skill". */
  tags: string[];
}

/**
 * A collection of glossary terms for the Arydia translation helper.
 * In a real application, this data might come from a database or a CMS.
 */
export const glossaryData: GlossaryTerm[] = [
  {
    id: "exile",
    en: "Exile",
    zh: "流亡者",
    description: "玩家角色稱呼",
    tags: ["Characters"],
  },
  {
    id: "path",
    en: "Path",
    zh: "職業路徑",
    description: "類似職業 / Class",
    tags: ["Characters"],
  },
  {
    id: "rogue",
    en: "Rogue",
    zh: "盜賊",
    description: "",
    tags: ["Characters", "Path"],
  },
  {
    id: "cleric",
    en: "Cleric",
    zh: "牧師",
    description: "",
    tags: ["Characters", "Path"],
  },
  {
    id: "threat-deck",
    en: "Threat Deck",
    zh: "威脅牌堆",
    description: "",
    tags: ["Combat"],
  },
  {
    id: "threat-level",
    en: "Threat Level",
    zh: "威脅等級",
    description: "",
    tags: ["Combat"],
  },
  {
    id: "combo-tracker",
    en: "Combo Tracker",
    zh: "連擊追蹤器",
    description: "",
    tags: ["Combat"],
  },
  {
    id: "foe",
    en: "Foe",
    zh: "敵人",
    description: "",
    tags: ["Combat", "Enemy"],
  },
  {
    id: "mob",
    en: "Mob",
    zh: "小怪",
    description: "",
    tags: ["Combat", "Enemy"],
  },
  {
    id: "boss",
    en: "Boss",
    zh: "頭目",
    description: "",
    tags: ["Combat", "Enemy"],
  },
  {
    id: "ai-card",
    en: "AI Card",
    zh: "AI 行動卡",
    description: "控制敵人行動",
    tags: ["Combat", "Cards"],
  },
  {
    id: "event-card",
    en: "Event Card",
    zh: "事件卡",
    description: "編號 EVT-",
    tags: ["Cards"],
  },
  {
    id: "job-card",
    en: "Job Card",
    zh: "任務卡",
    description: "編號 JOB-",
    tags: ["Cards"],
  },
  {
    id: "npc-card",
    en: "NPC Card",
    zh: "NPC 卡",
    description: "編號 NPC-",
    tags: ["Cards", "NPC"],
  },
  {
    id: "point-of-interest",
    en: "Point of Interest",
    zh: "探索點",
    description: "POI",
    tags: ["Map"],
  },
  {
    id: "hex",
    en: "Hex",
    zh: "六角格",
    description: "地圖單位",
    tags: ["Map"],
  },
  {
    id: "world-map",
    en: "World Map",
    zh: "世界地圖",
    description: "",
    tags: ["Map"],
  },
  {
    id: "region",
    en: "Region",
    zh: "地區",
    description: "",
    tags: ["Map"],
  },
  {
    id: "rp-role-play-points",
    en: "RP (Role Play Points)",
    zh: "角色扮演點數",
    description: "RP",
    tags: ["Rules"],
  },
  {
    id: "experience-xp",
    en: "Experience (XP)",
    zh: "經驗值",
    description: "",
    tags: ["Rules"],
  },
  {
    id: "skill",
    en: "Skill",
    zh: "技能",
    description: "",
    tags: ["Rules"],
  },
  {
    id: "chest",
    en: "Chest",
    zh: "寶箱",
    description: "",
    tags: ["Items"],
  },
  {
    id: "loot",
    en: "Loot",
    zh: "戰利品",
    description: "",
    tags: ["Items"],
  },
  {
    id: "weapon",
    en: "Weapon",
    zh: "武器",
    description: "",
    tags: ["Items", "Equipment"],
  },
  {
    id: "armor",
    en: "Armor",
    zh: "護甲",
    description: "",
    tags: ["Items", "Equipment"],
  },
  {
    id: "quick-start-guide",
    en: "Quick Start Guide",
    zh: "新手快速上手指南",
    description: "",
    tags: ["Rules", "Guide"],
  },
  {
    id: "adventure-mode",
    en: "Adventure Mode",
    zh: "冒險模式",
    description: "非戰鬥的探索狀態",
    tags: ["Rules", "Mode"],
  },
  {
    id: "combat-mode",
    en: "Combat Mode",
    zh: "戰鬥模式",
    description: "",
    tags: ["Rules", "Mode", "Combat"],
  },
  {
    id: "save-system",
    en: "Save System",
    zh: "存檔系統",
    description: "",
    tags: ["Rules"],
  },
  {
    id: "keyword-interaction",
    en: "Keyword Interaction",
    zh: "關鍵字互動",
    description: "與 NPC 對話系統",
    tags: ["Rules", "NPC", "Dialogue"],
  },
];