import type { Scripture } from "@/data/collections";

export function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Reading remains available when browser storage is disabled or full.
  }
}

export function readSelection(id: string, scriptures: Scripture[]): number[] {
  const saved = readStored<unknown>(`${id}_selectedScriptures`, []);
  return Array.isArray(saved)
    ? scriptures
        .filter((scripture) => saved.includes(scripture.id))
        .map((s) => s.id)
    : [];
}

export interface ReadingPosition {
  collectionId: string;
  scriptureId: number;
}

export function readPosition(key: string): ReadingPosition | null {
  const saved = readStored<Partial<ReadingPosition> | null>(key, null);
  return saved &&
    typeof saved.collectionId === "string" &&
    typeof saved.scriptureId === "number"
    ? { collectionId: saved.collectionId, scriptureId: saved.scriptureId }
    : null;
}
