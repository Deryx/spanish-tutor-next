"use client";

import { useState, useRef, JSX } from "react";

import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SpeakButton from "@/components/speakButton";
import { pickIndicesByReview, recordResults, wordKey } from "@/lib/progress";
import SummaryCard from "@/components/summaryCard";

import { Category, Vocabulary } from "@/types/vocabulary";

type FillInProps = {
    categories: Category[];
    entries: Vocabulary[];
};

type ResultsType = {
    question: string;
    answer: string;
    userAnswer: string;
}

const FillIn = ({ categories, entries }: FillInProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [category, setCategory] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<Vocabulary[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [results, setResults] = useState<ResultsType[]>([]);
    const [numberCorrect, setNumberCorrect] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

    const answerRef = useRef<HTMLInputElement>(null);

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

        const indexes = pickIndicesByReview(pool, numberQuestions);

        setQuestionSet(indexes.map((i: number) => pool[i]));
        setCurrentQuestion(0);
        setShowSession(false);
    };

    const handleExitSessionClick = () => {
        setShowSession(true);
        setQuestionSet([]);
        setCurrentQuestion(0);
    };

    const handleCheckAnswerClick = () => {
        const answer = answerRef.current?.value ?? "";

        const isCorrect = answer.trim().toLowerCase() === current.wordText.toLowerCase();
        recordResults({ [wordKey(current.wordId)]: isCorrect });

        if (isCorrect) setNumberCorrect(prev => prev + 1);

        const answerText = isCorrect ? (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#026440] bg-[#d2f8d2] h-20 text-[1rem] font-bold px-2 mt-6 mb-4"
            >
                Correct!
            </div>
        ): (
            <div
                className="flex flex-col justify-center border-l-[3px] border-l-[#FF0000] bg-[#F9E8E2] h-20 text-[1rem] px-2 font-bold mt-6 mb-4"
            >
                <p className="font-bold">Not quite!</p>
                <p>The correct answer is: <span className="font-bold">{current.wordText}</span>
                </p>
            </div>
        );

        const row = {
            question: current.wordText,
            userAnswer: answer,
            answer: current.wordText
        }

        setResults((prev) => [...prev, row]);

        setAnswerText(answerText);
        setShowAnswer(true);
    };

    const handleNextClick = () => {
        setShowAnswer(false);
        setCurrentQuestion((prev) => (prev + 1));
        answerRef.current!.value = "";
        setAnswerText("");
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
                        sessionSelected={numberQuestions.toString()}
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
                                        <span
                                            className="text-[2.5rem] font-bold tracking-[1.5px] bg-[#000000] text-[#FFF8EB] rounded-[6px] py-2 px-4 mb-4"
                                        >
                                            {current.translation}
                                        </span>
                                        <p
                                            className="text-[#637789] text-[1.25rem] mt-4 mb-4"
                                        >
                                            Enter the Spanish answer
                                        </p>
                                        <input
                                            type="text"
                                            ref={answerRef}
                                            id="answer"
                                            name="answer"
                                            placeholder="Type your answer"
                                            className="w-full border-[0.5px] border-gray-300 py-2 px-4 mb-4 rounded-[6px] bg-[#FFFAF2] text-[1.25rem]"
                                        />
                                        {showAnswer && (
                                            <div>
<div>{answerText}</div>
<div className="mt-3"><SpeakButton text={current.wordText} label="Listen to the word" /></div>
</div>
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
                        <p className="text-[1rem] text-[#C9362B] font-bold">SESSION COMPLETE</p>
                        <h3 className="text-[1.6rem] font-bold">{numberCorrect} of {numberQuestions} correct</h3>
                        <p
                            className="text-gray-400 text-[1rem] mb-4"
                        >
                            Review the corrections, then take another pass.
                        </p>

                        <div>
                            <table
                                className="w-full text-[1.25rem] border-t-[0.5px] border-gray-300"
                            >
                                <tbody>
                                    {
                                        results.map((result) => (
                                            <tr
                                                key={result.question}
                                                className="border-b-[0.5px] border-gray-300 h-9"
                                            >
                                                <td>
                                                    <div className="mt-4 mb-4">
                                                        <div className="text-gray-400 text-[1rem]">Prompt</div>
                                                        <div className="font-bold">{result.question}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <>
                                                        <div className="text-gray-400 text-[1rem]">Answer</div>
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

export default FillIn;