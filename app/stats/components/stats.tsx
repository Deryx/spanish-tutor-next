"use client";

import Link from "next/link";
import { useState } from "react";

import { useHydrated, useProgress } from "@/lib/useProgress";
import { accuracyOf, resetProgress, summarize, Summary, troubleKeys } from "@/lib/progress";
import { Tense, Verb } from "@/types/verbs";
import { Vocabulary } from "@/types/vocabulary";

type StatsProps = {
    words: Vocabulary[];
    verbs: Verb[];
    tenses: Tense[];
};

type BlockProps = {
    title: string;
    summary: Summary;
    total?: number;
};

const Stat = ({ value, label }: { value: string; label: string }) => (
    <div>
        <p className="text-[2rem] font-bold">{value}</p>
        <p className="text-[0.9rem] text-[#637789] font-semibold">{label}</p>
    </div>
);

const Block = ({ title, summary, total }: BlockProps) => {
    const accuracy = accuracyOf(summary);
    const share = total ? Math.min(100, Math.round((100 * summary.mastered) / total)) : 0;

    return (
        <section className="w-full p-4 mb-4 border-[0.5px] border-gray-300 bg-[#FFFDF7]">
            <p className="text-[1rem] text-[#C9362B] font-bold mb-3">{title}</p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat value={total ? `${summary.practiced} / ${total.toLocaleString()}` : `${summary.practiced}`} label="PRACTICED" />
                <Stat value={`${summary.mastered}`} label="MASTERED" />
                <Stat value={`${summary.due}`} label="DUE FOR REVIEW" />
                <Stat value={accuracy === null ? "–" : `${accuracy}%`} label="ACCURACY" />
            </div>

            {total ? (
                <div className="mt-4">
                    <div className="w-full h-2 rounded-[3px] bg-[#FFF8EB] border-[0.5px] border-gray-300">
                        <div
                            className="h-full rounded-[3px] bg-[#29903B]"
                            style={{ width: `${share}%` }}
                        />
                    </div>
                    <p className="text-[0.9rem] text-[#84929f] mt-1">{share}% mastered</p>
                </div>
            ) : null}
        </section>
    );
};

const StatsView = ({ words, verbs, tenses }: StatsProps) => {
    const hydrated = useHydrated();
    const progress = useProgress();
    const [now] = useState(() => Date.now());

    if (!hydrated) return null;

    const wordSummary = summarize(progress, "w", now);
    const verbSummary = summarize(progress, "v", now);

    const wordLabels = new Map(words.map((word) => [word.wordId, `${word.wordText} — ${word.translation}`]));
    const verbLabels = new Map(verbs.map((verb) => [verb.verbId, verb.infinitive]));
    const tenseLabels = new Map(tenses.map((tense) => [tense.tenseId, tense.tenseText]));

    const trouble = [
        ...troubleKeys(progress, "w").map(({ key, misses }) => ({
            key,
            misses,
            label: wordLabels.get(Number(key.split(":")[1])) ?? key,
        })),
        ...troubleKeys(progress, "v").map(({ key, misses }) => {
            const [, verbId, tenseId] = key.split(":");

            return {
                key,
                misses,
                label: `${verbLabels.get(Number(verbId)) ?? verbId} · ${tenseLabels.get(Number(tenseId)) ?? tenseId}`,
            };
        }),
    ].sort((a, b) => b.misses - a.misses);

    const nothingYet = wordSummary.practiced === 0 && verbSummary.practiced === 0;

    const handleReset = () => {
        if (window.confirm("Reset all saved progress on this device?")) resetProgress();
    };

    if (nothingYet) {
        return (
            <div className="w-full p-4 border-[0.5px] border-gray-300 bg-[#FFFDF7]">
                <p className="text-[1.25rem] font-bold">Nothing practiced yet</p>
                <p className="text-[#637789] mb-4">Finish a round in any activity and your results will show up here.</p>
                <Link
                    href="/"
                    className="inline-block bg-[#C9362B] text-[#FFF8EB] rounded-[6px] px-4 py-2"
                >
                    Choose activity
                </Link>
            </div>
        );
    }

    return (
        <>
            <Block title="VOCABULARY" summary={wordSummary} total={words.length} />
            <Block title="VERB FORMS" summary={verbSummary} />

            {trouble.length > 0 ? (
                <section className="w-full p-4 mb-4 border-[0.5px] border-gray-300 bg-[#FFFDF7]">
                    <p className="text-[1.25rem] font-bold mb-2">Needs the most work</p>
                    <ul>
                        {trouble.map((item) => (
                            <li
                                key={item.key}
                                className="flex justify-between gap-4 py-2 border-t-[0.5px] border-gray-300"
                            >
                                <span>{item.label}</span>
                                <span className="text-[#C9362B] font-bold whitespace-nowrap">{item.misses} missed</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <div className="flex gap-2">
                <Link
                    href="/"
                    className="bg-[#FFF8EB] border-[0.5px] rounded-[6px] border-gray-300 px-4 py-2"
                >
                    Choose activity
                </Link>
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-[#FFF8EB] border-[0.5px] rounded-[6px] border-gray-300 px-4 py-2"
                >
                    Reset progress
                </button>
            </div>
        </>
    );
};

export default StatsView;
