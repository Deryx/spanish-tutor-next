import { ConjugationSet, Verb } from "../types/verbs";
import { shuffleArray } from "./helpers";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getDatabaseData = async <T>(data: string): Promise<T> => {
    try {
        const response = await fetch(`${url}/api/${data}`, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${data}: ${response.status}`);
        }

        return await response.json() as T;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error fetching ${data}: ${error.message}`);
        }

        throw error;
    }
};

export const getConjugationSets = async (): Promise<ConjugationSet[]> => {
    try {
        const response = await fetch(`${url}/api/verbs/conjugations-wide`, { cache: "no-store" });


        if (!response.ok) {
            throw new Error(`Failed to fetch conjugation sets: ${response.status}`);
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error fetching conjugation sets: ${error.message}`);
        }

        throw error;
    }
};

export const getConjugationSet = async (verbId: number, tenseId: number): Promise<ConjugationSet> => {
    try {
        const response = await fetch(`${url}/api/verbs/${verbId}/conjugations-wide/tense/${tenseId}`, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Failed to fetch conjugation set: ${response.status}`);
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error fetching conjugation set: ${error.message}`);
        }

        throw error;
    }
}

// Returns null when a verb has no conjugation for the tense (for example "haber" has no imperative).
export const getConjugationSetOrNull = async (verbId: number, tenseId: number): Promise<ConjugationSet | null> => {
    const response = await fetch(`${url}/api/verbs/${verbId}/conjugations-wide/tense/${tenseId}`, { cache: "no-store" });

    if (response.status === 404 || response.status === 204) return null;

    if (!response.ok) {
        throw new Error(`Failed to fetch conjugation set: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return null;

    const data = JSON.parse(text) as ConjugationSet | null;

    return data && typeof data.yo === "string" ? data : null;
};

// Picks up to `count` random verbs that actually have the tense and returns their indexes with their conjugations.
export const pickConjugationSets = async (
    verbs: Verb[],
    tenseId: number,
    count: number
): Promise<{ indices: number[]; sets: ConjugationSet[] }> => {
    const wanted = Math.min(count, verbs.length);
    const order = shuffleArray(verbs.map((_, index) => index));
    const indices: number[] = [];
    const sets: ConjugationSet[] = [];
    let cursor = 0;

    while (indices.length < wanted && cursor < order.length) {
        const batch = order.slice(cursor, cursor + (wanted - indices.length));
        cursor += batch.length;

        const found = await Promise.all(batch.map((i) => getConjugationSetOrNull(verbs[i].verbId, tenseId)));

        found.forEach((set, k) => {
            if (set) {
                indices.push(batch[k]);
                sets.push(set);
            }
        });
    }

    return { indices, sets };
};
