"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "arydia.encounteredCards.v1";
const STORAGE_CHANGE_EVENT = "arydia-encountered-cards-change";
const EMPTY_PROGRESS = JSON.stringify({ encounteredCardIds: [] });

type StoredEncounterProgress = {
  encounteredCardIds?: unknown;
};

function parseStoredEncounteredCardIds(rawValue: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredEncounterProgress | string[];

    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }

    if (Array.isArray(parsed.encounteredCardIds)) {
      return parsed.encounteredCardIds.filter(
        (id): id is string => typeof id === "string",
      );
    }
  } catch (error) {
    console.warn("Could not read encountered card progress.", error);
  }

  return [];
}

function getStorageSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS;
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_PROGRESS;
}

function getServerSnapshot() {
  return EMPTY_PROGRESS;
}

function notifyStorageChanged() {
  window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
}

function writeStoredEncounteredCardIds(cardIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueSortedCardIds = Array.from(new Set(cardIds)).sort();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ encounteredCardIds: uniqueSortedCardIds }),
  );

  notifyStorageChanged();
}

function subscribeToEncounterProgress(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(STORAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(STORAGE_CHANGE_EVENT, onStoreChange);
  };
}

export function useEncounteredCards() {
  const storageSnapshot = useSyncExternalStore(
    subscribeToEncounterProgress,
    getStorageSnapshot,
    getServerSnapshot,
  );

  const encounteredCardIdList = useMemo(
    () => parseStoredEncounteredCardIds(storageSnapshot),
    [storageSnapshot],
  );

  const encounteredCardIds = useMemo(
    () => new Set(encounteredCardIdList),
    [encounteredCardIdList],
  );

  const updateEncounteredCards = useCallback(
    (updater: (current: Set<string>) => void) => {
      const current = new Set(parseStoredEncounteredCardIds(getStorageSnapshot()));
      updater(current);
      writeStoredEncounteredCardIds(Array.from(current));
    },
    [],
  );

  const isEncountered = useCallback(
    (cardId: string) => encounteredCardIds.has(cardId),
    [encounteredCardIds],
  );

  const markEncountered = useCallback(
    (cardId: string) => {
      updateEncounteredCards((current) => {
        current.add(cardId);
      });
    },
    [updateEncounteredCards],
  );

  const markUnencountered = useCallback(
    (cardId: string) => {
      updateEncounteredCards((current) => {
        current.delete(cardId);
      });
    },
    [updateEncounteredCards],
  );

  const toggleEncountered = useCallback(
    (cardId: string) => {
      updateEncounteredCards((current) => {
        if (current.has(cardId)) {
          current.delete(cardId);
        } else {
          current.add(cardId);
        }
      });
    },
    [updateEncounteredCards],
  );

  const resetEncounteredCards = useCallback(() => {
    writeStoredEncounteredCardIds([]);
  }, []);

  return {
    encounteredCardIds,
    encounteredCardIdList,
    isLoaded: true,
    isEncountered,
    markEncountered,
    markUnencountered,
    toggleEncountered,
    resetEncounteredCards,
  };
}
