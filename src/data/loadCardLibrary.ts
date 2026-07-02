import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { cardLibrary as demoCardLibrary } from "@/data/cardLibrary";
import type { ArydiaCardEntry } from "@/data/types";

const PRIVATE_DATA_FLAG = "ARYDIA_USE_PRIVATE_DATA";

const privateCardLibraryPath = join(
  process.cwd(),
  "private-data",
  "cards.private.json",
);

function shouldUsePrivateData() {
  return process.env[PRIVATE_DATA_FLAG] === "true";
}

function parseJsonFile(file: string): unknown {
  return JSON.parse(file.replace(/^\uFEFF/, ""));
}

function isCardLibrary(value: unknown): value is ArydiaCardEntry[] {
  return Array.isArray(value);
}

export async function loadCardLibrary(): Promise<ArydiaCardEntry[]> {
  if (!shouldUsePrivateData()) {
    return demoCardLibrary;
  }

  try {
    const file = await readFile(privateCardLibraryPath, "utf8");
    const parsed = parseJsonFile(file);

    if (isCardLibrary(parsed)) {
      return parsed;
    }

    console.warn(
      "Private card library data must be an array. Falling back to demo data.",
    );
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;

    if (typedError.code !== "ENOENT") {
      console.warn(
        "Could not load private card library data. Falling back to demo data.",
        error,
      );
    }
  }

  return demoCardLibrary;
}
