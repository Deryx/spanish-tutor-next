"use client";

import React, { useState, JSX } from "react";

import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SpeakButton from "@/components/speakButton";
import { recordResults, verbKey } from "@/lib/progress";
import SummaryCard from "@/components/summaryCard";

import { pickConjugationSets } from "@/lib/database";

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

    const emptyFor = (answer?: Conjugation): Conjugation => ({
        ...emptyConjugation(),
        yo: answer?.yo === "—" ? "—" : "",
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

    const toConjugations = (sets: ConjugationSet[]): Conjugation[] =>
        sets.map(({ yo, tu, el, nosotros, vosotros, ellos }) => ({
            yo, tu, el, nosotros, vosotros, ellos,
        }));

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

        const { indices, sets } = await pickConjugationSets(verbs, selectedTense, numberQuestions);
        const answers = toConjugations(sets);
        setQuestionSet(indices);
        setCorrectAnswers(answers);
        setUserAnswers(emptyFor(answers[0]));
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

        const currentAnswer = correctAnswers[currentQuestion];
        const norm = (s: string) => s.trim().toLowerCase();
        const numberCorrect = keys.filter((k) => norm(userAnswers[k]) === norm(currentAnswer[k])).length;
        const isCorrect = numberCorrect === keys.length;
        recordResults({ [verbKey(verbs[current].verbId, selectedTense)]: isCorrect });

        setTotalCorrect((prev) => prev + numberCorrect);
        setNumberCorrect((prev) => [...prev, numberCorrect]);

        const answerText = isCorrect ? (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#026440] bg-[#d2f8d2] h-10 text-[1rem] font-bold mt-6 mb-4"
            >
                Correct!
            </div>
        ): (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#FF0000] bg-[#F9E8E2] h-20 text-[1rem] px-2 font-bold mt-6 mb-4"
            >
                <p className="font-bold">Review your matches</p>
                <p>{ numberCorrect } of { userAnswerTexts.length } are in the correct position.</p>
            </div>
        );

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
        setUserAnswers(emptyFor(correctAnswers[next]));
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
                        sessionSelected={numberQuestions.toString()}
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
                            {current !== undefined && verbs[current].infinitive ? (
                                <>
                                    <div
                                        className="w-full flex justify-between place-items-center mb-10 text-[1.25rem]"
                                    >
                                        <div className="flex place-items-center">
                                            <span
                                                className="text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] text-[#FFF8EB] bg-[#000000] rounded-[6px] font-bold py-2 px-4"
                                            >
                                                {verbs[current].infinitive}
                                            </span>
                                            <span
                                                className="ml-2"
                                            >
                                                <SpeakButton text={verbs[current].infinitive} />
                                            </span>
                                        </div>

                                        <div>
                                            <span
                                                className="text-[0.75rem] md:text-[1rem] lg:text-[1rem] bg-[#F2B441] rounded-[6px] font-bold py-2 px-4"
                                            >
                                                {tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText}
                                            </span>
                                        </div>
                                    </div>

                                    <ul className="w-full">
                                        <li
                                            className="flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Yo</span>
                                            <input
                                                type="text"
                                                name="yo"
                                                readOnly={currentConjugations.yo === "—"}
                                                value={userAnswers.yo}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                        <li
                                            className= "flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Tu</span>
                                            <input
                                                type="text"
                                                name="tu"
                                                value={userAnswers.tu}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                        <li
                                            className= "flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Él/Ella/Usted</span>
                                            <input
                                                type="text"
                                                name="el"
                                                value={userAnswers.el}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                        <li
                                            className= "flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Nosotros/Nosotras</span>
                                            <input
                                                type="text"
                                                name="nosotros"
                                                value={userAnswers.nosotros}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                        <li
                                            className= "flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Vosotros/Vosotras</span>
                                            <input
                                                type="text"
                                                name="vosotros"
                                                value={userAnswers.vosotros}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                        <li
                                            className= "flex justify-between text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] w-full mb-4"
                                        >
                                            <span className="flex w-1/3 place-items-center">Ellos/Ellas/Ustedes</span>
                                            <input
                                                type="text"
                                                name="ellos"
                                                value={userAnswers.ellos}
                                                onChange={handleUserAnswers}
                                                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[0.8rem] py-2 px-2 w-3/5"
                                            />
                                        </li>
                                    </ul>

                                    {showAnswer && conjugationsComplete ? (
                                        <div>
                                            <div>{answerText}</div>
                                            <div className="mt-3"><SpeakButton text={keys.map((key) => currentConjugations[key]).filter((form) => form !== "—").join(", ")} label="Listen to the forms" /></div>
                                        </div>
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
                        <p className="text-[1rem] text-[#C9362B] font-bold">SESSION COMPLETE</p>
                        <h3 className="text-[1.6rem] font-bold">{totalCorrect} of {questionSet.length * keys.length} correct</h3>
                        <p
                            className="text-gray-400 text-[1rem] "
                        >
                            Review the corrections, then take another pass.
                        </p>

                        <div>
                            <table
                                className="w-full text-[1.25rem] border-t-[0.5px] border-gray-300"
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
                                                        <div key={`${prompt}-${promptIndex}`} style={{ marginBottom: "5px" }}>
                                                            <div className="text-gray-400 text-[1rem]">Verb</div>
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
                                                        <div key={`${answer}-${answerIndex}`} className="mt-4 mb-4">
                                                            <div className="text-gray-400 text-[1rem]">{keys[answerIndex]}</div>
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