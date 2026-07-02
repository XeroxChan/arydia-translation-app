import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { quickStartGuide as demoQuickStartGuide } from "@/data/quickStartGuide";
import type { GuideSection } from "@/data/types";

const PRIVATE_DATA_FLAG = "ARYDIA_USE_PRIVATE_DATA";

const privateQuickStartGuidePath = join(
  process.cwd(),
  "private-data",
  "quick-start.private.json",
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

export async function loadQuickStartGuide(): Promise<GuideSection[]> {
  if (!shouldUsePrivateData()) {
    return demoQuickStartGuide;
  }

  try {
    const file = await readFile(privateQuickStartGuidePath, "utf8");
    const parsed = parseJsonFile(file);

    if (isGuideSectionArray(parsed)) {
      return parsed;
    }

    console.warn(
      "Private quick-start data must be an array. Falling back to demo data.",
    );
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;

    if (typedError.code !== "ENOENT") {
      console.warn(
        "Could not load private quick-start data. Falling back to demo data.",
        error,
      );
    }
  }

  return demoQuickStartGuide;
}
