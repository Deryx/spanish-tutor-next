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
import SortableTile from "@/components/sortableTile"
import Tile from "@/components/tile";
import SummaryCard from "@/components/summaryCard";

import { getConjugationSet } from "@/lib/database";

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

        const set = createQuestionSet();
        const answers: Conjugation[] = await retrieveAnswers(set);
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
    };

    const handleCheckAnswerClick = () => {
        const tiles = userAnswers[currentQuestion];
        const currentCorrectAnswers = Object.values(correctAnswers[currentQuestion]);

        const isCorrect = tiles.length === keys.length && tiles.every((tile, index) => tile.text === currentCorrectAnswers[index]);

        let numberCorrect = 0;
        for(let i = 0; i < tiles.length; i++) {
            if (tiles[i].text === currentCorrectAnswers[i]) numberCorrect++;
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
                                            className="text-[#C9362B] text-[0.375rem] font-bold"
                                        >
                                            SPANISH ENGLISH
                                        </p>
                                        <h2
                                            className="text-[1rem] font-bold"
                                            style={{ marginBottom: "5px" }}
                                        >
                                            Arrange the matches
                                        </h2>
                                        <p
                                            className="text-[0.5rem] text-[#637789]"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            Drag the Spanish tiles up or down until each one sits beside its match.
                                        </p>

                                        <div style={{ marginBottom: "10px" }}>
                                            <span
                                                className="bg-[#000000] text-[#FFF8E8] rounded-[3px]"
                                                style={{ padding: "5px 6px" }}
                                            >
                                                {verbs[current].infinitive}
                                            </span>
                                        </div>

                                        <div
                                            className="w-full flex justify-between"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <section
                                                className="w-1/2"
                                                style={{ marginRight: "5px" }}
                                            >
                                                <h3
                                                    className="text-[0.4rem] text-[#637789] font-semibold"
                                                    style={{ marginBottom: "5px" }}
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
                                                    className="text-[0.4rem] text-[#637789] font-semibold"
                                                    style={{ marginBottom: "5px" }}
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
        // <>
        //     <div
        //         className="flex w-3/5 justify-between"
        //         style={{ margin: "0 auto" }}
        //     >
        //         <div>
        //             <Dropdown
        //                 id="verb"
        //                 type="verb"
        //                 label="Verb"
        //                 options={verbs}
        //                 value={selectedVerb}
        //                 onChange={handleVerbChange}
        //             />
        //         </div>

        //         <div>
        //             <Dropdown
        //                 id="tense"
        //                 type="tense"
        //                 label="Tense"
        //                 options={tenses}
        //                 value={selectedTense}
        //                 onChange={handleTenseChange}
        //             />
        //         </div>
        //     </div>
        //     { !showResults ? (
        //         <Card
        //             leftButtonLabel="Exit session"
        //             rightButtonLabel={"Check answer"}
        //             onLeftButtonClick={handleExitSessionClick}
        //             onRightButtonClick={handleCheckAnswerClick}
        //         >
        //             <>
        //                 {currentConjugations ? (
        //                     <>
        //                         <p
        //                             className="w-full font-bold flex justify-between place-items-center"
        //                             style={{ marginBottom: "10px" }}
        //                         >
        //                             <span
        //                                 className="bg-[#000000] text-[#FFF8EB] rounded-[3px]"
        //                                 style={{ padding: "5px 8px" }}
        //                             >
        //                                 {verbs.find((verb) => verb.verbId === selectedVerb)?.infinitive}
        //                             </span>

        //                             <span
        //                                 className="text-[0.4375rem] bg-[#F2B441] rounded-[3px]"
        //                                 style={{ padding: "5px 8px" }}
        //                             >
        //                                 {tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText}
        //                             </span>
        //                         </p>

        //                         <section>
        //                             <p></p>
        //                             <h2
        //                                 className="text-[1rem] font-bold"
        //                                 style={{ marginBottom: "5px" }}
        //                             >
        //                                 Arrange the matches
        //                             </h2>
        //                             <p
        //                                 className="text-[0.5rem] text-[#637789]"
        //                                 style={{ marginBottom: "10px" }}
        //                             >
        //                                 Drag the Spanish tiles up or down until each one sits beside its match.
        //                             </p>

        //                             <div
        //                                 className="w-full flex justify-between"
        //                                 style={{ marginBottom: "10px" }}
        //                             >
        //                                 <section
        //                                     className="w-1/2"
        //                                     style={{ marginRight: "5px" }}
        //                                 >
        //                                     <h3
        //                                         className="text-[0.4rem] text-[#637789] font-semibold"
        //                                         style={{ marginBottom: "5px" }}
        //                                     >
        //                                         PRONOUN
        //                                     </h3>
        //                                     <Tile
        //                                         type="static"
        //                                         label="yo"
        //                                     />
        //                                     <Tile
        //                                         type="static"
        //                                         label="tú"
        //                                     />
        //                                     <Tile
        //                                         type="static"
        //                                         label="él /ella / usted"
        //                                     />
        //                                     <Tile
        //                                         type="static"
        //                                         label="nosotros"
        //                                     />
        //                                     <Tile
        //                                         type="static"
        //                                         label="vosotros"
        //                                     />
        //                                     <Tile
        //                                         type="static"
        //                                         label="ellos /ellas / ustedes"
        //                                     />
        //                                 </section>

        //                                 <section className="w-1/2" style={{ marginLeft: "5px" }}>
        //                                     <h3
        //                                         className="text-[0.4rem] text-[#637789] font-semibold"
        //                                         style={{ marginBottom: "5px" }}
        //                                     >
        //                                         SPANISH
        //                                     </h3>
        //                                     <DndContext
        //                                         sensors={sensors}
        //                                         collisionDetection={closestCenter}
        //                                         modifiers={[restrictToVerticalAxis]}
        //                                         onDragEnd={handleDragEnd}
        //                                     >
        //                                         <SortableContext items={order} strategy={verticalListSortingStrategy}>
        //                                             {order.map((answerIndex) => (
        //                                                 <SortableTile
        //                                                     key={answerIndex}
        //                                                     id={answerIndex}
        //                                                     label={currentCorrectAnswers[answerIndex]}
        //                                                     disabled={showAnswer}
        //                                                 />
        //                                             ))}
        //                                         </SortableContext>
        //                                     </DndContext>
        //                                 </section>
        //                             </div>

        //                             {showAnswer && (
        //                                 <div>{answerText}</div>
        //                             )}
        //                         </section>
        //                     </>
        //                 ) : null}
        //             </>
        //         </Card>
        //     ) : (
        //         <SummaryCard
        //             practiceHref="#"
        //             chooseHref="/"
        //         >
        //             <p className="text-[0.375rem] text-[#C9362B] font-bold">SESSION COMPLETE</p>
        //                 <h3 className="text-[0.8rem] font-bold">{totalCorrect} of {numberQuestions * numberConjugations} correct</h3>
        //                 <p
        //                     className="text-gray-400 text-[0.5rem]"
        //                     style={{ marginBottom: "10px" }}
        //                 >
        //                     Review the corrections, then take another pass.
        //             </p>


        //         </SummaryCard>
        //     )
        // </>
    );
};

export default Slider;