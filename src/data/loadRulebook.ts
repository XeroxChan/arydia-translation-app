import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { rulebookGuide as demoRulebookGuide } from "@/data/rulebook";
import type { GuideSection } from "@/data/types";

const PRIVATE_DATA_FLAG = "ARYDIA_USE_PRIVATE_DATA";

const privateRulebookPath = join(
  process.cwd(),
  "private-data",
  "rulebook.private.json",
);

function shouldUsePrivateData() {
  return process.env[PRIVATE_DATA_FLAG] === "true";
}

function parseJsonFile(file: string): unknown {
  return JSON.parse(file.replace(/^\uFEFF/, ""));
}

function isGuideSectionArray(value: unknown): value is GuideSection[] {
  return Array.isArray(value);
}

export async function loadRulebookGuide(): Promise<GuideSection[]> {
  if (!shouldUsePrivateData()) {
    return demoRulebookGuide;
  }

  try {
    const file = await readFile(privateRulebookPath, "utf8");
    const parsed = parseJsonFile(file);

    if (isGuideSectionArray(parsed)) {
      return parsed;
    }

    console.warn(
      "Private rulebook data must be an array. Falling back to demo data.",
    );
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;

    if (typedError.code !== "ENOENT") {
      console.warn(
        "Could not load private rulebook data. Falling back to demo data.",
        error,
      );
    }
  }

  return demoRulebookGuide;
}
