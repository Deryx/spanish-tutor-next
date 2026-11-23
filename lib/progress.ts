import { Vocabulary } from "@/types/vocabulary";

// Leitner-style spaced repetition kept in the browser (localStorage).
// Keys: "w:<wordId>" for vocabulary, "v:<verbId>:<tenseId>" for a verb in a tense.

export type ProgressItem = {
    box: number;    // 1..5
    hits: number;
    misses: number;
    seen: number;   // ms since epoch
    due: number;    // ms since epoch
};

export type ProgressMap = Record<string, ProgressItem>;

export type Summary = {
    practiced: number;
    mastered: number;
    due: number;
    hits: number;
    misses: number;
};

export const STORAGE_KEY = "spanish-tutor-progress-v1";
export const CHANGE_EVENT = "spanish-tutor-progress-change";

const DAY = 86_400_000;
const INTERVAL_DAYS = [0, 0, 1, 3, 7, 14]; // review delay by box (index = box)
const MAX_BOX = 5;
const MASTERED_BOX = 4;

export const wordKey = (wordId: number): string => `w:${wordId}`;
export const verbKey = (verbId: number, tenseId: number): string => `v:${verbId}:${tenseId}`;

export const readRaw = (): string | null => {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const isItem = (value: unknown): value is ProgressItem => {
    if (typeof value !== "object" || value === null) return false;
    const item = value as Record<string, unknown>;
    return ["box", "hits", "misses", "seen", "due"].every((field) => typeof item[field] === "number");
};

export const parseProgress = (raw: string | null): ProgressMap => {
    if (!raw) return {};

    try {
        const data: unknown = JSON.parse(raw);
        if (typeof data !== "object" || data === null) return {};

        return Object.fromEntries(Object.entries(data).filter(([, value]) => isItem(value))) as ProgressMap;
    } catch {
        return {};
    }
};

const save = (map: ProgressMap): void => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
        // storage unavailable (private mode, quota) - progress just isn't kept
    }
};

/** outcomes: item key -> answered correctly */
export const recordResults = (outcomes: Record<string, boolean>): void => {
    if (typeof window === "undefined") return;

    const entries = Object.entries(outcomes);
    if (entries.length === 0) return;

    const map = parseProgress(readRaw());
    const now = Date.now();

    for (const [key, correct] of entries) {
        const old = map[key];
        const box = correct ? Math.min((old?.box ?? 1) + 1, MAX_BOX) : 1;

        map[key] = {
            box,
            hits: (old?.hits ?? 0) + (correct ? 1 : 0),
            misses: (old?.misses ?? 0) + (correct ? 0 : 1),
            seen: now,
            due: now + INTERVAL_DAYS[box] * DAY,
        };
    }

    save(map);
};

export const resetProgress = (): void => {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
        // ignore
    }
};

/**
 * Picks `count` indexes into `pool`: words due for review first,
 * then words never practiced, then words not yet due.
 */
export const pickIndicesByReview = (pool: Vocabulary[], count: number): number[] => {
    const map = parseProgress(readRaw());
    const now = Date.now();

    const scored = pool.map((entry, index) => {
        const item = map[wordKey(entry.wordId)];
        const bucket = !item ? 1 : item.due <= now ? 0 : 2;

        return { index, bucket, due: item && item.due > now ? item.due : 0, tie: Math.random() };
    });

    scored.sort((a, b) => a.bucket - b.bucket || a.due - b.due || a.tie - b.tie);

    return scored.slice(0, Math.min(count, pool.length)).map((s) => s.index);
};

export const summarize = (map: ProgressMap, prefix: "w" | "v", now: number): Summary => {
    const summary: Summary = { practiced: 0, mastered: 0, due: 0, hits: 0, misses: 0 };

    for (const [key, item] of Object.entries(map)) {
        if (!key.startsWith(`${prefix}:`)) continue;

        summary.practiced++;
        if (item.box >= MASTERED_BOX) summary.mastered++;
        if (item.due <= now) summary.due++;
        summary.hits += item.hits;
        summary.misses += item.misses;
    }

    return summary;
};

export const accuracyOf = (summary: Summary): number | null => {
    const total = summary.hits + summary.misses;
    return total === 0 ? null : Math.round((100 * summary.hits) / total);
};

export const troubleKeys = (
    map: ProgressMap,
    prefix: "w" | "v",
    limit = 8
): { key: string; misses: number }[] =>
    Object.entries(map)
        .filter(([key, item]) => key.startsWith(`${prefix}:`) && item.misses > 0)
        .sort((a, b) => b[1].misses - a[1].misses)
        .slice(0, limit)
        .map(([key, item]) => ({ key, misses: item.misses }));
