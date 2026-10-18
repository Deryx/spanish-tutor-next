import { ConjugationSet } from "../types/verbs";

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