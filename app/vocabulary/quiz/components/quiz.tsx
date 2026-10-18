"use client";

import { useState, JSX } from "react";

import { RandomNumberArrayGenerator } from "../../../../lib/helpers";
import ScreenCard from "../../../../components/sessionCard";
import Dropdown from "../../../../components/dropdown";
import Card from "../../../../components/card";
import AnswerButton from "../components/answerButton";

import { Category, Vocabulary } from "../../../../types/vocabulary";

type QuizProps = {
    categories: Category[];
    entries: Vocabulary[];
};

const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const randomAnswers = (correctAnswer: string, entries: Vocabulary[]): string[] => {
    const pool = entries.filter((entry) => entry.wordText !== correctAnswer);
    const count = Math.min(3, pool.length);
    const indexes = RandomNumberArrayGenerator(0, pool.length - 1, count);
    const wrongAnswers = indexes.map((i: number) => pool[i].translation);

    return shuffle([...wrongAnswers, correctAnswer]);
};

const Quiz = ({ categories, entries }: QuizProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [category, setCategory] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<Vocabulary[]>([]);
    const [answerSet, setAnswerSet] = useState<string[][]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");


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
        setAnswerSet(indexes.map((i: number) => randomAnswers(pool[i].translation, entries)));
        setCurrentQuestion(0);
        setShowSession(false);
    };

    const handleExitSessionClick = () => {
        setShowSession(true);
        setQuestionSet([]);
        setCurrentQuestion(0);
        setAnswerSet([]);
    };

    const handleAnswerButtonClick = (selectedAnswer: string) => {
        setSelectedAnswer(selectedAnswer);
    };

    const handleCheckAnswerClick = () => {
        const isCorrect = selectedAnswer === questionSet[currentQuestion].translation;
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
                <p>The correct answer is: <span className="font-bold">{current.translation}</span>
                </p>
            </div>
        );
        setAnswerText(answerText);
        setShowAnswer(true);
    };

    const handleNextClick = () => {
        setShowAnswer(false);
        setSelectedAnswer("");
        setCurrentQuestion((prev) => (prev + 1));
    };

    const current = questionSet[currentQuestion];

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
                ) : (
                    <>
                        <Card
                            leftButtonLabel="Exit session"
                            rightButtonLabel={showAnswer ? "Next" : "Check answer"}
                            onLeftButtonClick={handleExitSessionClick}
                            onRightButtonClick={showAnswer ? handleNextClick : handleCheckAnswerClick}
                        >
                            {
                                questionSet.length >= numberQuestions && current ? (
                                    <>
                                        <h2 className="text-[1.25rem] font-bold">{current.wordText}</h2>
                                        <p className="text-[0.75rem]">{current.pronunciation}</p>
                                        <p
                                            className="text-[#637789] text-[0.5rem]"
                                            style={{ marginBottom: "15px" }}
                                        >
                                            Choose the matching answer.
                                            </p>
                                        <div
                                            className="grid grid-cols-2 gap-1"
                                            style={{ marginBottom: "15px" }}
                                        >
                                            {answerSet[currentQuestion]?.map((answer) => (
                                                <AnswerButton
                                                    key={answer}
                                                    answer={answer}
                                                    onClick={() => handleAnswerButtonClick(answer)}
                                                />
                                            ))}
                                        </div>
                                        {showAnswer && (
                                            <p>{answerText}</p>
                                        )}
                                    </>
                                ) : null
                            }
                        </Card>
                    </>
                )
            }
        </>
    );
};

export default Quiz;