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
import { recordResults, verbKey } from "@/lib/progress";
import SortableTile from "@/components/sortableTile"
import Tile from "@/components/tile";
import SummaryCard from "@/components/summaryCard";

import { pickConjugationSets } from "@/lib/database";

import { Tense, Verb, ConjugationSet } from "@/types/verbs";

type SliderProps = {
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

type TileItem = {
    id: number;
    text: string;
};

const Slider = ({ tenses, verbs }: SliderProps) => {
    const [showSession, setShowSession] = useState<boolean>(true);
    const [selectedTense, setSelectedTense] = useState<number>(0);
    const [numberQuestions, setNumberQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [questionSet, setQuestionSet] = useState<number[]>([]);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [correctAnswers, setCorrectAnswers] = useState<Conjugation[]>([]);
    const [userAnswers, setUserAnswers] = useState<TileItem[][]>([]);
    const [results, setResults] = useState<ResultsType[]>([]);
    const [numberCorrect, setNumberCorrect] = useState<number[]>([]);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

    const numberConjugations = 6;

    const current = questionSet[currentQuestion];
    const currentTense = tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText;

    const tiles = userAnswers[currentQuestion] ?? [];

    const shuffle = <T,>(set: T[]): T[] =>
        RandomNumberArrayGenerator(0, set.length - 1, set.length).map((i) => set[i]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        setUserAnswers((prev) =>
            prev.map((tiles, q) => {
                if (q !== currentQuestion) return tiles;
                const from = tiles.findIndex((t) => t.id === active.id);
                const to = tiles.findIndex((t) => t.id === over.id);
                return arrayMove(tiles, from, to);
            })
        );
    };

    const handleTenseChange = (value: number) => {
        setSelectedTense(value);
        setAnswerText("");
        setShowAnswer(false)
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

    const createUserAnswers = (answers: Conjugation[]): TileItem[][] =>
        answers.map((answer) => {
            const scrambled = RandomNumberArrayGenerator(0, keys.length - 1, keys.length);
            return scrambled.map((i) => ({
                id: i,
                text: answer[keys[i]],
            }));
        });

    const handlePracticeClick = async () => {
        setShowSession(false);

        const { indices, sets } = await pickConjugationSets(verbs, selectedTense, numberQuestions);
        const answers = toConjugations(sets);
        setQuestionSet(indices);
        setCorrectAnswers(answers);
        const userAnswers = createUserAnswers(answers);
        setUserAnswers(userAnswers);
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
        const tiles = userAnswers[currentQuestion];
        const currentCorrectAnswers = Object.values(correctAnswers[currentQuestion]);

        const isCorrect = tiles.length === keys.length && tiles.every((tile, index) => tile.text === currentCorrectAnswers[index]);
        recordResults({ [verbKey(verbs[current].verbId, selectedTense)]: isCorrect });

        let numberCorrect = 0;
        for(let i = 0; i < tiles.length; i++) {
            if (tiles[i].text === currentCorrectAnswers[i]) numberCorrect++;
        }

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
                <p>{ numberCorrect } of { tiles.length } are in the correct position.</p>
            </div>
        );

        const currentAnswer = correctAnswers[currentQuestion];
        const promptSet = [verbs[current].infinitive];
        const answerSet = keys.map((key) => currentAnswer[key]);
        const userInput = tiles.map((tile) => tile.text);

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
        setUserAnswers((prev) =>
            prev.map((answers, index) =>
                index === next ? shuffle(answers) : answers
            )
        );
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
                                            className="text-[1.25rem] md:text-[2rem] lg:text-[2rem] font-bold mb-2"
                                        >
                                            Arrange the matches
                                        </h2>
                                        <p
                                            className="text-[0.8rem] md:text-[1rem] lg:text-[1rem] text-[#637789] mb-4"
                                        >
                                            Drag the Spanish tiles up or down until each one sits beside its match.
                                        </p>

                                        <div
                                            className="flex items-center justify-between space-x-2 mb-8"
                                        >
                                            <span
                                                className="bg-[#000000] text-[#FFF8E8] text-[1.25rem] md:text-[2rem] lg:text-[2rem] font-bold rounded-[6px] py-2 px-4"
                                            >
                                                {verbs[current].infinitive}
                                            </span>
                                            <span
                                                className="text-[0.75rem] md:text-[1rem] lg:text-[1rem] bg-[#F2B441] rounded-[6px] font-bold py-2 px-4"
                                            >
                                                {currentTense}
                                            </span>
                                        </div>

                                        <div
                                            className="w-full flex justify-between mb-4"
                                        >
                                            <section
                                                className="w-1/2 mr-2"
                                            >
                                                <h3
                                                    className="text-[0.8rem] md:text-[1rem] lg:text-[1rem] text-[#637789] font-semibold mb-3"
                                                >
                                                    PRONOUN
                                                </h3>
                                                <Tile
                                                    type="static"
                                                    label="yo"
                                                />
                                                <Tile
                                                    type="static"
                                                    label="tú"
                                                />
                                                <Tile
                                                    type="static"
                                                    label="él /ella / usted"
                                                />
                                                <Tile
                                                    type="static"
                                                    label="nosotros"
                                                />
                                                <Tile
                                                    type="static"
                                                    label="vosotros"
                                                />
                                                <Tile
                                                    type="static"
                                                    label="ellos /ellas / ustedes"
                                                />
                                            </section>

                                            <section className="w-1/2" style={{ marginLeft: "5px" }}>
                                                <h3
                                                    className="text-[0.8rem] md:text-[1rem] lg:text-[1rem] text-[#637789] font-semibold mb-3"
                                                >
                                                    SPANISH
                                                </h3>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    modifiers={[restrictToVerticalAxis]}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <SortableContext items={tiles.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                                                        {tiles.map((tile) => (
                                                            <SortableTile
                                                                key={tile.id}
                                                                id={tile.id}
                                                                label={tile.text}
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
<div className="mt-3"><SpeakButton text={keys.map((key) => correctAnswers[currentQuestion]?.[key] ?? "").filter((form) => form !== "—").join(", ")} label="Listen to the forms" /></div>
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
                                                <div className="font-bold text-[1rem]">
                                                    {result.question.map((prompt, promptIndex) => (
                                                        <div className="mb-4">
                                                            <div className="text-gray-400">Verb</div>
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
                                                        <div className="flex flex-col justify-center border-l-[3px] border-l-[#026440] bg-[#d2f8d2] h-10 text-[0.75rem] md:text-[1rem] lg:text-[1rem] font-bold mt-6 mb-4">
                                                            <div className="text-gray-400">{keys[answerIndex]}</div>
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