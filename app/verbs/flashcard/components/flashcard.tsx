"use client";

import { useState, useEffect } from "react";

import { getConjugationSet } from "../../../../lib/database";

import Dropdown from "../../../../components/dropdown";
import SpeakButton from "../../../../components/speakButton";
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
            <div className="w-full h-full">
                <aside
                    className="w-full md:w-3/5 lg:w-3/5 md:m-auto lg:m-auto"
                >
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
                    className="p-4 w-full md:m-auto lg:m-auto md:w-3/5 lg:w-3/5 border-[0.5px] border-gray-300 bg-[#FFFDF7]"
                >
                    <section
                        className="w-full flex justify-between mb-4 md:mb-6 lg:mb-6"
                    >
                        <div>
                            <div className="flex place-items-center gap-2">
                                <span className="text-[0.75rem] md:text-[2.25rem] lg:text-[2.25rem] bg-[#000000] text-[#FFFDF7] rounded-[6px] py-2 px-4 place-items-center font-bold">
                                    {currentVerb?.infinitive}
                                </span>
                                <span><SpeakButton text={currentVerb?.infinitive ?? ""} /></span>
                            </div>
                            <p className="text-[#637789] text-[1.25rem] md:text-[1.25rem] lg:text-[1.25rem]">{currentVerb?.translation}</p>
                        </div>
                        <div
                            className="flex place-items-center h-3 text-[0.75rem] md:text-[1rem] lg:text-[1rem] bg-[#f2b441] font-semibold rounded-[6px] py-4 px-5"
                        >
                            { currentTense }
                        </div>
                    </section>

                    <div>
                        {
                            currentConjugations ? (
                                <ul
                                    className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-3 md:text-[1rem] lg:text-[1rem] text-[0.75rem]"
                                >
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Yo</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.yo}</span>
                                            <span><SpeakButton text={currentConjugations.yo} /></span>
                                        </span>
                                    </li>
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Tú</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.tu}</span>
                                            <span><SpeakButton text={currentConjugations.tu} /></span>
                                        </span>
                                    </li>
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Él/Ella/Usted</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.el}</span>
                                            <span><SpeakButton text={currentConjugations.el} /></span>
                                        </span>
                                    </li>
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Nosotros/Nosotras</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.nosotros}</span>
                                            <span><SpeakButton text={currentConjugations.nosotros} /></span>
                                        </span>
                                    </li>
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Vosotros/Vosotras</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.vosotros}</span>
                                            <span><SpeakButton text={currentConjugations.vosotros} /></span>
                                        </span>
                                    </li>
                                    <li
                                        className="flex justify-between place-items-center border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] p-4"
                                    >
                                        <span>Ellos/Ellas/Ustedes</span> 
                                        <span className="flex place-items-center gap-2">
                                            <span className="font-bold">{currentConjugations.ellos}</span>
                                            <span><SpeakButton text={currentConjugations.ellos} /></span>
                                        </span>
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