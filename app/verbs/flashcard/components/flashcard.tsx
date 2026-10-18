"use client";

import { useState, useEffect } from "react";

import { getConjugationSet } from "../../../../lib/database";

import Dropdown from "../../../../components/dropdown";
import { Tense, Verb, ConjugationSet } from "../../../../types/verbs";

type FlashcardProps = {
    tenses: Tense[];
    verbs: Verb[];
};

const Flashcard = ({ tenses, verbs }: FlashcardProps) => {
    const [selectedVerb, setSelectedVerb] = useState<number>(verbs[0]?.verbId ?? 0);
    const [selectedTense, setSelectedTense] = useState<number>(tenses[0]?.tenseId ?? 0);
    const [currentConjugations, setCurrentConjugations] = useState<ConjugationSet | null>(null);

    useEffect(() => {
        if (!selectedVerb || !selectedTense) return;

        const fetchConjugationSet = async () => {
            try {
                const data = await getConjugationSet(selectedVerb, selectedTense);

                setCurrentConjugations(data);
            } catch (error: unknown) {
                if (error instanceof Error && error.name === "AbortError") return;
                console.error("Error fetching conjugation set:", error);
            }
        };

        fetchConjugationSet();
    }, [selectedVerb, selectedTense]);

    const handleVerbChange = (value: number) => {
        setSelectedVerb(value);
    };

    const handleTenseChange = (value: number) => {
        setSelectedTense(value);
    };

    const currentVerb = verbs.find((verb) => verb.verbId === selectedVerb);
    const currentTense = tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText;

    return (
        <>
            <div className="w-full flex">
                <aside
                    className="w-1/4"
                    style={{ marginRight: "20px" }}>
                    <div>
                        <Dropdown
                            id="verb"
                            type="verb"
                            label="Verb"
                            options={verbs}
                            value={selectedVerb}
                            onChange={handleVerbChange}
                        />
                    </div>

                    <div>
                        <Dropdown
                            id="tense"
                            type="tense"
                            label="Tense"
                            options={tenses}
                            value={selectedTense}
                            onChange={handleTenseChange}
                        />
                    </div>
                </aside>
                <div
                    className="w-3/4 border-[0.5px] border-gray-300 bg-[#FFFDF7]"
                    style={{ padding: "20px" }}
                >
                    <section
                        className="w-full flex justify-between"
                        style={{ marginBottom: "15px" }}
                    >
                        <div>
                            <h2 className="text-[1.25rem] font-bold">{currentVerb?.infinitive}</h2>
                            <p className="text-[#637789] text-[0.625rem]">{currentVerb?.translation}</p>
                        </div>
                        <div
                            className="flex place-items-center h-3 text-[0.4375rem] bg-[#f2b441] font-semibold rounded-[3px]"
                            style={{ padding: "0 8px"}}
                        >
                            { currentTense }
                        </div>
                    </section>

                    <div>
                        {
                            currentConjugations ? (
                                <ul
                                    className="grid grid-cols-2 gap-1 text-[0.5rem]"
                                >
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Yo</span> <span className="font-bold">{currentConjugations.yo}</span>
                                    </li>
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Tú</span> <span className="font-bold">{currentConjugations.tu}</span>
                                    </li>
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Él/Ella/Usted</span> <span className="font-bold">{currentConjugations.el}</span>
                                    </li>
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Nosotros/Nosotras</span> <span className="font-bold">{currentConjugations.nosotros}</span>
                                    </li>
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Vosotros/Vosotras</span> <span className="font-bold">{currentConjugations.vosotros}</span>
                                    </li>
                                    <li
                                        className="flex justify-between border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px]"
                                        style={{ padding: "10px" }}
                                    >
                                        <span>Ellos/Ellas/Ustedes</span> <span className="font-bold">{currentConjugations.ellos}</span>
                                    </li>
                                </ul>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Flashcard;