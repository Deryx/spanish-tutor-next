"use client";

import React, { useState, JSX } from "react";

import { RandomNumberArrayGenerator } from "@/lib/helpers";
import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SummaryCard from "@/components/summaryCard";

import { getConjugationSet } from "@/lib/database"

import { Tense, Verb, ConjugationSet } from "@/types/verbs";

type ConjugatorProps = {
    tenses: Tense[];
    verbs: Verb[];
};

type ResultsType = {
    question: string[];
    answer: string[];
    userAnswer: string[];
}

type Conjugation = {
    yo: string;
    tu: string;
    el: string;
    nosotros: string;
    vosotros: string;
    ellos: string;
};

const Conjugator = ({ tenses, verbs }: ConjugatorProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [selectedTense, setSelectedTense] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<number[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [correctAnswers, setCorrectAnswers] = useState<Conjugation[]>([]);
    const [userAnswers, setUserAnswers] = useState<Conjugation>({
        yo: "",
        tu: "",
        el: "",
        nosotros: "",
        vosotros: "",
        ellos: "",
    });
    const [results, setResults] = useState<ResultsType[]>([]);
    const [numberCorrect, setNumberCorrect] = useState<number[]>([]);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

    const numberConjugations = 6;

    const current = questionSet[currentQuestion];
    const currentTense = tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText;
    const emptyConjugation = (): Conjugation => ({
        yo: "",
        tu: "",
        el: "",
        nosotros: "",
        vosotros: "",
        ellos: "",
    });

    const handleTenseChange = (value: number) => {
        setSelectedTense(value);
    };

    const handleSessionButtonClick = (
        e?: React.MouseEvent<HTMLButtonElement>
    ) => {
        const activeButton = e?.currentTarget;
        setNumberQuestions(Number(activeButton?.name ?? 0));
    };

    const createQuestionSet = (): number[] => {
        const count = Math.min(numberQuestions, verbs.length);
        const set = RandomNumberArrayGenerator(0, verbs.length - 1, count);
        setQuestionSet(set);
        return set;
    };

    const retrieveAnswers = async (set: number[]): Promise<Conjugation[]> => {
        if (set.length === 0) return [];

        const conjugations = await Promise.all(
            set.map((index) => getConjugationSet(verbs[index].verbId, selectedTense))
        );

        return conjugations.map(({ yo, tu, el, nosotros, vosotros, ellos }) => ({
            yo, tu, el, nosotros, vosotros, ellos,
        }));
    };

    const keys = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"] as const;
    const currentConjugations = correctAnswers[currentQuestion] ?? emptyConjugation();
    const conjugationsComplete = keys.every((key) => userAnswers[key].trim().length > 0);

    const printAnswerStatus = (label: string, userValue: string, correctValue: string) => {
        const isCorrect = userValue.trim().toLowerCase() === correctValue.trim().toLowerCase();

        return (
            <div className="flex justify-between text-[0.4375rem]" style={{ marginBottom: "5px" }}>
                <span className="font-bold text-gray-700">{label}</span>
                <span className={isCorrect ? "text-[#29903B] font-bold" : "text-[#C9362B] font-bold"}>
                    {isCorrect ? "Correct" : `${userValue || "-"} → ${correctValue}`}
                </span>
            </div>
        );
    };

    const handleUserAnswers = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof Conjugation;
        setUserAnswers((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handlePracticeClick = async () => {
        setShowSession(false);

        const set = createQuestionSet();
        const answers: Conjugation[] = await retrieveAnswers(set);
        setCorrectAnswers(answers);
        setUserAnswers(emptyConjugation());
    };

    const handleExitSessionClick = () => {
        setShowSession(true);
        setQuestionSet([]);
        setCurrentQuestion(0);
        setShowAnswer(false);
        setShowResults(false);
        setAnswerText("");
        setSelectedTense(0);
    };

    const handleCheckAnswerClick = () => {
        const currentCorrectAnswers = Object.values(correctAnswers[currentQuestion]);
        const userAnswerTexts = Object.values(userAnswers);

        const isCorrect = currentCorrectAnswers.length === keys.length && currentCorrectAnswers.every((answers, index) => answers === userAnswerTexts[index]);

        let numberCorrect = 0;
        for(let i = 0; i < userAnswerTexts.length; i++) {
            if (userAnswerTexts[i] === currentCorrectAnswers[i]) numberCorrect++;
        }

        setTotalCorrect((prev) => prev + numberCorrect);
        setNumberCorrect((prev) => [...prev, numberCorrect]);

        const answerText = isCorrect ? (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#026440] bg-[#d2f8d2] h-10 text-[0.5rem] font-bold"
                style={{ paddingLeft: "10px", marginBottom: "15px" }}
            >
                Correct!
            </div>
        ): (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#FF0000] bg-[#F9E8E2] h-10 text-[0.5rem]"
                style={{ paddingLeft: "10px", marginBottom: "15px" }}
            >
                <p className="font-bold">Review your matches</p>
                <p>{ numberCorrect } of { userAnswerTexts.length } are in the correct position.</p>
            </div>
        );

        const currentAnswer = correctAnswers[currentQuestion];
        const promptSet = [verbs[current].infinitive];
        const answerSet = keys.map((key) => currentAnswer[key]);
        const userInput = userAnswerTexts;

        const set = {
            question: promptSet,
            userAnswer: userInput,
            answer: answerSet
        };

        setResults((prev) => [...prev, set]);

        setAnswerText(answerText);
        setShowAnswer(true);
    };

    const handleNextClick = () => {
        const next = currentQuestion + 1;

        setShowAnswer(false);
        setCurrentQuestion(next);
        setUserAnswers(emptyConjugation());
    };

    const handleSeeResultsClick = () => {
        setShowResults(true);
    };

    const isLastQuestion = currentQuestion === questionSet.length - 1;

    let rightButtonLabel = "";
    let rightButtonMethod = () => {};

    if (currentQuestion < questionSet.length) {
        if (!showAnswer) {
            rightButtonLabel = "Check answer";
            rightButtonMethod = handleCheckAnswerClick;
        } else if (isLastQuestion) {
            rightButtonLabel = "See results";
            rightButtonMethod = handleSeeResultsClick;
        } else {
            rightButtonLabel = "Next";
            rightButtonMethod = handleNextClick;
        }
    }

    return (
        <>
            { showSession ? (
                    <ScreenCard
                        onSessionButtonClick={handleSessionButtonClick}
                        onPracticeClick={handlePracticeClick}
                    >
                        <Dropdown
                            id="tense"
                            type="tense"
                            options={tenses}
                            value={selectedTense}
                            firstOption="Select tense"
                            onChange={handleTenseChange}
                        />
                    </ScreenCard>
                ) : !showResults ? (
                    <Card
                        leftButtonLabel="Exit session"
                        rightButtonLabel={rightButtonLabel}
                        onLeftButtonClick={handleExitSessionClick}
                        onRightButtonClick={rightButtonMethod}
                    >
                        <>
                            {current && verbs[current].infinitive ? (
                                <>
                                    <p
                                        className="w-full flex justify-between place-items-center"
                                        style={{ marginBottom: "10px" }}
                                    >
                                        <span
                                            className="text-[0.5rem] text-[#FFF8EB] bg-[#000000] rounded-[3px] font-bold"
                                            style={{ padding: "5px 6px" }}
                                        >
                                            {verbs[current].infinitive}
                                        </span>

                                        <span
                                            className="text-[0.4375rem] bg-[#F2B441] rounded-[3px] font-bold"
                                            style={{ padding: "3px 6px" }}
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
                                        <div>{answerText}</div>
                                    ) : null}
                                </>
                            ) : null}
                        </>
                    </Card>
                ) : (
                    <SummaryCard
                        practiceHref="#"
                        chooseHref="/"
                    >
                        <p className="text-[0.375rem] text-[#C9362B] font-bold">SESSION COMPLETE</p>
                        <h3 className="text-[0.8rem] font-bold">{totalCorrect} of {numberQuestions * 5} correct</h3>
                        <p
                            className="text-gray-400 text-[0.5rem]"
                            style={{ marginBottom: "10px" }}
                        >
                            Review the corrections, then take another pass.
                        </p>

                        <div>
                            <table
                                className="w-full text-[0.5rem] border-t-[0.5px] border-gray-300"
                            >
                                <tbody>
                                    {results.map((result, resultIndex) => (
                                        <tr
                                            key={`${result.question.join("-")}-${resultIndex}`}
                                            className="w-full border-b-[0.5px] border-gray-300 h-38"
                                        >
                                            <td className="w-1/2">
                                                <div className="font-bold">
                                                    {result.question.map((prompt, promptIndex) => (
                                                        <div style={{ marginBottom: "5px" }}>
                                                            <div className="text-gray-400 text-[0.375rem]">Verb</div>
                                                            <div key={`${prompt}-${promptIndex}`}>{prompt}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="w-1/2 font-bold">
                                                {result.answer.map((answer, answerIndex) => {
                                                    const userAnswer = result.userAnswer[answerIndex];
                                                    const isCorrect = userAnswer === answer;

                                                    return (
                                                        <div style={{ marginBottom: "5px" }}>
                                                            <div className="text-gray-400 text-[0.375rem]">{keys[answerIndex]}</div>
                                                            <div
                                                                key={`${answer}-${answerIndex}`}
                                                                className={isCorrect ? "text-[#29903B] font-bold" : "text-[#C9362B] font-bold"}
                                                            >
                                                                {isCorrect ? answer : <span>{userAnswer} &#8594; {answer}</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SummaryCard>
                )
            }
        </>
    );
};

export default Conjugator;