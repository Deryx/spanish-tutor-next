"use client";

import { useState, JSX } from "react";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

type SortableTileProps = {
    id: number;
    label: string;
    disabled: boolean;
};

import { RandomNumberArrayGenerator } from "@/lib/helpers";
import ScreenCard from "@/components/sessionCard";
import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SpeakButton from "@/components/speakButton";
import { recordResults, wordKey } from "@/lib/progress";
import Tile from "@/components/tile";
import SortableTile from "@/components/sortableTile"
import SummaryCard from "@/components/summaryCard";

import { Category, Vocabulary } from "@/types/vocabulary";

type SliderProps = {
    categories: Category[];
    entries: Vocabulary[];
};

type ResultsType = {
    question: string[];
    answer: string[];
    userAnswer: string[];
}

const Slider = ({ categories, entries }: SliderProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [category, setCategory] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<number[][]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [results, setResults] = useState<ResultsType[]>([]);
    const [numberCorrect, setNumberCorrect] = useState<number[]>([]);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

    const current = questionSet[currentQuestion];

    const shuffle = (set: number[]): number[] =>
        RandomNumberArrayGenerator(0, set.length - 1, set.length).map((i) => set[i]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        setUserAnswers((prev) =>
            arrayMove(prev, prev.indexOf(active.id as number), prev.indexOf(over.id as number))
        );
    };

    const filteredEntries =
        category === 0
            ? entries
            : entries.filter((entry) => entry.categoryId === category);


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
        setShowSession(false);

        const createWordSet = (): number[] => {
            const count = Math.min(numberQuestions, filteredEntries.length);
            return RandomNumberArrayGenerator(0, filteredEntries.length - 1, count);
        };

        const sets = Array.from({ length: numberQuestions }, createWordSet);

        setQuestionSet(sets);
        setUserAnswers(sets[0] ? shuffle(sets[0]) : []);
    };

    const handleExitSessionClick = () => {
        setShowSession(true);
        setQuestionSet([]);
        setCurrentQuestion(0);
        setShowAnswer(false);
        setShowResults(false);
        setAnswerText("");
    };

    const handleCheckAnswerClick = () => {
        const isCorrect = current.length === userAnswers.length && current.every((value, index) => value === userAnswers[index]);

        let numberCorrect = 0;
        for(let i = 0; i < current.length; i++) {
            if (current[i] === userAnswers[i]) numberCorrect++;
        }
        const outcomes: Record<string, boolean> = {};
        current.forEach((entry, i) => {
            outcomes[wordKey(filteredEntries[entry].wordId)] = entry === userAnswers[i];
        });
        recordResults(outcomes);

        setTotalCorrect((prev) => prev + numberCorrect);

        setNumberCorrect((prev) => [...prev, numberCorrect]);

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
                <p className="font-bold">Review your matches</p>
                <p>{ numberCorrect } of { current.length } are in the correct position.</p>
            </div>
        );

        let promptSet: string[] = [];
        let answerSet: string[] = [];
        current.forEach((entry) => {
            promptSet = [...promptSet, filteredEntries[entry].translation];
            answerSet = [...answerSet, filteredEntries[entry].wordText];
        });

        let userInput: string[] = [];
        userAnswers.forEach((entry) => {
            userInput = [...userInput, filteredEntries[entry].wordText];
        });

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
        setUserAnswers(questionSet[next] ? shuffle(questionSet[next]) : []);
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
                                current ? (
                                    <>
                                        <p
                                            className="text-[#C9362B] text-[0.8rem] font-bold"
                                        >
                                            SPANISH ENGLISH
                                        </p>
                                        <h2
                                            className="text-[2rem] font-bold mb-2"
                                        >
                                            Arrange the matches
                                        </h2>
                                        <p
                                            className="text-[1rem] text-[#637789] mb-4"
                                        >
                                            Drag the Spanish tiles up or down until each one sits beside its match.
                                        </p>

                                        <div
                                            className="w-full flex justify-between mt-8"
                                        >
                                            <section
                                                className="w-1/2 mr-2"
                                            >
                                                <h3
                                                    className="text-[1rem] text-[#637789] font-semibold mb-3"
                                                >
                                                    ENGLISH
                                                </h3>
                                                {
                                                    current.map((index) => (
                                                        <Tile
                                                            key={filteredEntries[index].translation}
                                                            type="static"
                                                            label={filteredEntries[index].translation}
                                                        />
                                                    ))
                                                }
                                            </section>

                                            <section className="w-1/2 ml-2">
                                                <h3
                                                    className="text-[1rem] text-[#637789] font-semibold mb-3"
                                                >
                                                    SPANISH
                                                </h3>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    modifiers={[restrictToVerticalAxis]}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <SortableContext items={userAnswers} strategy={verticalListSortingStrategy}>
                                                        {userAnswers.map((index) => (
                                                            <SortableTile
                                                                key={index}
                                                                id={index}
                                                                label={filteredEntries[index].wordText}
                                                                disabled={showAnswer}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                            </section>
                                        </div>
                                        {showAnswer && (
                                            <div>
<div>{answerText}</div>
<div className="mt-3"><SpeakButton text={current.map((entry) => filteredEntries[entry].wordText).join(", ")} label="Listen to the words" /></div>
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
                        <h3 className="text-[1.6rem] font-bold">{totalCorrect} of {numberQuestions * 5} correct</h3>
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
                                    {results.map((result, resultIndex) => (
                                        <tr
                                            key={`${result.question.join("-")}-${resultIndex}`}
                                            className="w-full border-b-[0.5px] border-gray-300 h-38"
                                        >
                                            <td className="w-1/2">
                                                <div className="font-bold">
                                                    {result.question.map((prompt, promptIndex) => (
                                                        <div className="mt-6 mb-4 text-[0.75rem]">
                                                            <div className="text-gray-400">Prompt</div>
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
                                                        <div className="flex flex-col justify-center h-10 text-[0.75rem] md:text-[1rem] lg:text-[1rem] font-bold mt-6 mb-4">
                                                            <div className="text-gray-400">Answer</div>
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

export default Slider;