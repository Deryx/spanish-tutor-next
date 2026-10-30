"use client";

import { useState, useRef, useMemo, JSX } from "react";

import { RandomNumberArrayGenerator } from "@/lib/helpers";
import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SummaryCard from "@/components/summaryCard";

import { Category, Vocabulary } from "@/types/vocabulary";

type CompletionProps = {
    categories: Category[];
    entries: Vocabulary[];
};

const incompleteWord = (word: string): string => {
    const numberLetters = Math.ceil(word.length / 2);
    const indexes = RandomNumberArrayGenerator(0, word.length - 1, numberLetters);
    for (let i = 0; i < indexes.length; i++) {
        word = word.substring(0, indexes[i]) + "_" + word.substring(indexes[i] + 1);
    }
    return word;
}

const Completion = ({ categories, entries }: CompletionProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [category, setCategory] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<Vocabulary[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [revealHint, setRevealHint] = useState<boolean>(false);

    const answerRef = useRef<HTMLInputElement>(null);
    let questions: string[] = [];
    let userAnswers: string[] = [];

    const handleCategoryChange = (newCategory: number) => {
        setCategory(newCategory);
    };

    const handleSessionButtonClick = (
        e?: React.MouseEvent<HTMLButtonElement>
    ) => {
        const activeButton = e?.currentTarget;
        setNumberQuestions(Number(activeButton?.name ?? 0));
    };

    const handlePracticeClick = () => {
        const pool =
            category === 0
                ? entries
                : entries.filter((entry) => entry.categoryId === category);

        const count = Math.min(numberQuestions, pool.length);
        const indexes = RandomNumberArrayGenerator(0, pool.length, count);

        setQuestionSet(indexes.map((i: number) => pool[i]));
        setCurrentQuestion(0);
        setShowSession(false);
    };

    const handleExitSessionClick = () => {
        setShowSession(true);
        setQuestionSet([]);
        setCurrentQuestion(0);
        setShowAnswer(false);
        setShowResults(false);
        setAnswerText("");
        setRevealHint(false);
    };

    const handleCheckAnswerClick = () => {
        const answer = answerRef.current?.value ?? "";
        userAnswers = [...userAnswers, answer];
        const isCorrect = answer.trim().toLowerCase() === current.wordText.toLowerCase();
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
                <p className="font-bold">Not quite!</p>
                <p>The correct answer is: <span className="font-bold">{current.wordText}</span>
                </p>
            </div>
        );
        setAnswerText(answerText);
        setShowAnswer(true);
    };

    const handleNextClick = () => {
        setShowAnswer(false);
        setCurrentQuestion((prev) => (prev + 1));
        answerRef.current!.value = "";
        setAnswerText("");
        setRevealHint(false);
    };

    const handleSeeResultsClick = () => {
        setShowResults(true);
    };

    const handleRevealHint = () => {
        setRevealHint(true);
    }

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

    const current = questionSet[currentQuestion];

    const maskedWord = useMemo(
        () => (current ? incompleteWord(current.wordText) : ""),
        [current]
    );
    questions = [...questions, maskedWord];

    return (
        <>
            { showSession ? (
                    <ScreenCard
                        onSessionButtonClick={handleSessionButtonClick}
                        onPracticeClick={handlePracticeClick}
                    >
                        <Dropdown
                            type="category"
                            firstOption="All words"
                            label="Category"
                            options={categories}
                            value={category}
                            onChange={handleCategoryChange}
                        />
                    </ScreenCard>
                ) : !showResults ? (
                        <>
                            <Card
                                leftButtonLabel="Exit session"
                                rightButtonLabel={rightButtonLabel}
                                onLeftButtonClick={handleExitSessionClick}
                                onRightButtonClick={rightButtonMethod}
                            >
                                {
                                    questionSet.length >= 0 && current ? (
                                        <>
                                            <h2 style={{ marginBottom: "5px" }}>
                                                <span
                                                    className="text-[1.25rem] font-bold tracking-[1.5px] bg-[#000000] text-[#FFF8EB] rounded-[3px]"
                                                    style={{ padding: "5px 8px" }}
                                                >
                                                        {maskedWord}
                                                </span>
                                            </h2>
                                            {
                                                !revealHint ? (
                                                <button
                                                    onClick={handleRevealHint}
                                                    className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.4375rem]"
                                                    style={{ padding: "5px 8px", marginBottom: "25px" }}
                                                >
                                                    Hint
                                                </button>
                                                ) : <p
                                                    className="text-[#637789] text-[0.75rem] font-bold"
                                                    style={{ marginBottom: "5px" }}>
                                                        {current.translation}
                                                    </p>
                                            }
                                            <p
                                                className="text-[#637789] text-[0.5rem]"
                                                style={{ marginBottom: "15px" }}
                                            >
                                                Type the complete Spanish word.
                                            </p>
                                            <input
                                                type="text"
                                                ref={answerRef}
                                                id="answer"
                                                name="answer"
                                                placeholder="Type your answer"
                                                className="w-full border-[0.5px] border-gray-300 rounded-[3px] bg-[#FFFAF2] text-[0.5rem]"
                                                style={{ padding: "5px 8px", marginBottom: "15px" }}
                                            />
                                            {showAnswer && (
                                                <div>{answerText}</div>
                                            )}
                                        </>
                                    ) : null
                                }
                            </Card>
                        </>
                ) : (
                    <SummaryCard>
                        &nbsp;
                    </SummaryCard>
                )
            }
        </>
    );
};

export default Completion;