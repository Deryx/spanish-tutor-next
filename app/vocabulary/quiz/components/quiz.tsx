"use client";

import { useState, JSX } from "react";

import { RandomNumberArrayGenerator } from "@/lib/helpers";
import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SummaryCard from "@/components/summaryCard";
import AnswerButton from "../components/answerButton";

import { Category, Vocabulary } from "@/types/vocabulary";

type QuizProps = {
    categories: Category[];
    entries: Vocabulary[];
};

type ResultsType = {
    question: string;
    answer: string;
    userAnswer: string;
}

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
    const [results, setResults] = useState<ResultsType[]>([]);
    const [numberCorrect, setNumberCorrect] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

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
        const answer = selectedAnswer;

        const isCorrect = selectedAnswer === questionSet[currentQuestion].translation;

        if (isCorrect) setNumberCorrect(prev => prev + 1);

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

        const row = {
            question: current.wordText,
            userAnswer: answer,
            answer: current.translation
        }

        setResults((prev) => [...prev, row]);

        setAnswerText(answerText);
        setShowAnswer(true);
    };

    const handleNextClick = () => {
        setShowAnswer(false);
        setSelectedAnswer("");
        setCurrentQuestion((prev) => (prev + 1));
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
                ) : !showResults ? (
                    <>
                        <Card
                            leftButtonLabel="Exit session"
                            rightButtonLabel={rightButtonLabel}
                            onLeftButtonClick={handleExitSessionClick}
                            onRightButtonClick={rightButtonMethod}
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
                                            <div>{answerText}</div>
                                        )}
                                    </>
                                ) : null
                            }
                        </Card>
                    </>
                ) : (
                    <SummaryCard
                        practiceHref="#"
                        chooseHref="/"
                    >
                        <p className="text-[0.375rem] text-[#C9362B] font-bold">SESSION COMPLETE</p>
                        <h3 className="text-[0.8rem] font-bold">{numberCorrect} of {numberQuestions} correct</h3>
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
                                    {
                                        results.map((result) => (
                                            <tr
                                                key={result.question}
                                                className="border-b-[0.5px] border-gray-300 h-9"
                                            >
                                                <td>
                                                    <>
                                                        <div className="text-gray-400 text-[0.375rem]">Prompt</div>
                                                        <div className="font-bold">{result.question}</div>
                                                    </>
                                                </td>
                                                <td>
                                                    <>
                                                        <div className="text-gray-400 text-[0.375rem]">Answer</div>
                                                        {
                                                            result.userAnswer === result.answer ? (
                                                                <div className="text-[#29903B] font-bold">{result.answer}</div>
                                                            ) : (
                                                                <div className="text-[#C9362B] font-bold">{result.userAnswer} &#8594; {result.answer}</div>
                                                            )
                                                        }
                                                    </>
                                                </td>
                                                <td className="font-bold">
                                                    {
                                                        result.userAnswer === result.answer ? (
                                                            <span className="text-[#29903B]">&#10004;</span>
                                                        ) : (
                                                            <span className="text-[#C9362B]">&#10006;</span>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </SummaryCard>
                )
            }
        </>
    );
};

export default Quiz;