"use client";

import React, { useState, useEffect, JSX } from "react";

import Dropdown from "../../../../components/dropdown";
import Card from "../../../../components/card";

import { getConjugationSet } from "../../../../lib/database"

import { Tense, Verb, ConjugationSet } from "../../../../types/verbs";

type ConjugatorProps = {
    tenses: Tense[];
    verbs: Verb[];
};

const subjectKeys = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"] as const;
type UserAnswers = Record<(typeof subjectKeys)[number], string>;

const printAnswerStatus = (subject: string, answer: string, correctAnswer: string): JSX.Element => {
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    return <p key={subject}>{subject}: {isCorrect ? "Correct!" : `Not quite! The correct answer is: ${correctAnswer}`}</p>;
};

const Conjugator = ({ tenses, verbs }: ConjugatorProps) => {
    const [selectedVerb, setSelectedVerb] = useState<number>(1);
    const [selectedTense, setSelectedTense] = useState<number>(1);
    const [currentConjugations, setCurrentConjugations] = useState<ConjugationSet | null>(null);
    const initialAnswers: UserAnswers = {
        yo: "",
        tu: "",
        el: "",
        nosotros: "",
        vosotros: "",
        ellos: ""
    };
    const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialAnswers);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const conjugationsComplete = subjectKeys.every((subject) => userAnswers[subject].trim() !== "");

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

    const handleUserAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof UserAnswers;
        setUserAnswers((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleCheckAnswerClick = () => {
        if (!conjugationsComplete) return;
        setShowAnswer(true);
    };

    const handleExitSessionClick = () => {
        setShowAnswer(false);
        setUserAnswers(initialAnswers);
    };

    const handleNextClick = () => {
        setShowAnswer(false);
        setUserAnswers(initialAnswers);
    };

    return (
        <>
            <div
                className="flex w-3/5 justify-between"
                style={{ margin: "0 auto" }}
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
            </div>
            <Card
                leftButtonLabel="Exit session"
                rightButtonLabel={showAnswer ? "Next" : "Check answer"}
                onLeftButtonClick={handleExitSessionClick}
                onRightButtonClick={showAnswer ? handleNextClick : handleCheckAnswerClick}
            >
                <>
                    {currentConjugations ? (
                        <>
                            <p
                                className="w-full flex justify-between place-items-center"
                                style={{ marginBottom: "10px" }}
                            >
                                <span>{verbs.find((verb) => verb.verbId === selectedVerb)?.infinitive}</span>

                                <span
                                    className="text-[0.4375rem] bg-[#F2B441] rounded-[3px]"
                                    style={{ padding: "5px 8px" }}
                                >
                                    {tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText}
                                </span>
                            </p>

                            <ul className="w-full">
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Yo</span>
                                    <input
                                        type="text"
                                        name="yo"
                                        value={userAnswers.yo}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] font-[0.4375rem] font-bold w-2/3"
                                        style={{ fontSize: '0.5rem', padding: "5px" }}
                                    />
                                </li>
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Tu</span>
                                    <input
                                        type="text"
                                        name="tu"
                                        value={userAnswers.tu}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.5rem] font-bold w-2/3"
                                        style={{ padding: "5px" }}
                                    />
                                </li>
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Él/Ella/Usted</span>
                                    <input
                                        type="text"
                                        name="el"
                                        value={userAnswers.el}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.5rem] font-bold w-2/3"
                                        style={{ padding: "5px" }}
                                    />
                                </li>
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Nosotros/Nosotras</span>
                                    <input
                                        type="text"
                                        name="nosotros"
                                        value={userAnswers.nosotros}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.5rem] font-bold w-2/3"
                                        style={{ padding: "5px" }}
                                    />
                                </li>
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "5px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Vosotros/Vosotras</span>
                                    <input
                                        type="text"
                                        name="vosotros"
                                        value={userAnswers.vosotros}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.5rem] font-bold w-2/3"
                                        style={{ padding: "5px" }}
                                    />
                                </li>
                                <li
                                    className= "flex justify-between text-[0.5rem] w-full"
                                    style={{ marginBottom: "20px" }}
                                >
                                    <span className="flex w-1/3 place-items-center">Ellos/Ellas/Ustedes</span>
                                    <input
                                        type="text"
                                        name="ellos"
                                        value={userAnswers.ellos}
                                        onChange={handleUserAnswers}
                                        className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.5rem] font-bold w-2/3"
                                        style={{ padding: "5px" }}
                                    />
                                </li>
                            </ul>

                            {showAnswer && conjugationsComplete ? (
                                <>
                                    {printAnswerStatus("Yo", userAnswers.yo, currentConjugations.yo ?? "")}
                                    {printAnswerStatus("Tú", userAnswers.tu, currentConjugations.tu ?? "")}
                                    {printAnswerStatus("Él/Ella/Usted", userAnswers.el, currentConjugations.el ?? "")}
                                    {printAnswerStatus("Nosotros/Nosotras", userAnswers.nosotros, currentConjugations.nosotros ?? "")}
                                    {printAnswerStatus("Vosotros/Vosotras", userAnswers.vosotros, currentConjugations.vosotros ?? "")}
                                    {printAnswerStatus("Ellos/Ellas/Ustedes", userAnswers.ellos, currentConjugations.ellos ?? "")}
                                </>
                            ) : null}
                        </>
                    ) : null}
                </>
            </Card>
        </>
    );
};

export default Conjugator;