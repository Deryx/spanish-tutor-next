"use client";

import { useState, useEffect, JSX } from "react";

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

import Dropdown from "../../../../components/dropdown";
import Card from "../../../../components/card";
import SortableTile from "../../../../components/sortableTile"
import Tile from "../../../../components/tile";

import { getConjugationSet } from "../../../../lib/database";

import { Tense, Verb, ConjugationSet } from "../../../../types/verbs";
import { RandomNumberArrayGenerator } from "../../../../lib/helpers"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

type SliderProps = {
    tenses: Tense[];
    verbs: Verb[];
};

const Slider = ({ tenses, verbs }: SliderProps) => {
    const [selectedVerb, setSelectedVerb] = useState<number>(1);
    const [selectedTense, setSelectedTense] = useState<number>(1);
    const [currentConjugations, setCurrentConjugations] = useState<ConjugationSet>();
    const numberConjugations = 6;
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [answerText, setAnswerText] = useState<JSX.Element | string>("");
    const [order, setOrder] = useState<number[]>([]);

    useEffect(() => {
        if (!selectedVerb || !selectedTense) return;

        const fetchConjugationSet = async () => {
            try {
                const data = await getConjugationSet(selectedVerb, selectedTense);

                setCurrentConjugations(data);
                setOrder(RandomNumberArrayGenerator(0, numberConjugations - 1, numberConjugations));
            } catch (error: unknown) {
                if (error instanceof Error && error.name === "AbortError") return;
                console.error("Error fetching conjugation set:", error);
            }
        };

        fetchConjugationSet();
    }, [selectedVerb, selectedTense]);

    const currentCorrectAnswers: string[] = currentConjugations
        ? [
            currentConjugations.yo,
            currentConjugations.tu,
            currentConjugations.el,
            currentConjugations.nosotros,
            currentConjugations.vosotros,
            currentConjugations.ellos,
        ]
        : [];

    useEffect(() => {
        if (!currentConjugations) {
            setOrder([]);
            return;
        }
        setOrder(RandomNumberArrayGenerator(0, numberConjugations - 1, numberConjugations));
    }, [currentConjugations]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        setOrder((prev) =>
            arrayMove(prev, prev.indexOf(active.id as number), prev.indexOf(over.id as number))
        );
    };

    const handleVerbChange = (value: number) => {
        setSelectedVerb(value);
        setAnswerText("");
        setShowAnswer(false)
    };

    const handleTenseChange = (value: number) => {
        setSelectedTense(value);
        setAnswerText("");
        setShowAnswer(false)
    };

    const handleExitSessionClick = () => {
    };

    const handleCheckAnswerClick = () => {
        const matches = order.filter(
            (answerIndex, position) => currentCorrectAnswers[answerIndex] === currentCorrectAnswers[position]
        ).length;
        const isCorrect = matches === currentCorrectAnswers.length;
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
                <p>{matches} of {currentCorrectAnswers.length} are in the correct position.</p>
            </div>
        );

        setAnswerText(answerText);
        setShowAnswer(true);
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
                rightButtonLabel={"Check answer"}
                onLeftButtonClick={handleExitSessionClick}
                onRightButtonClick={handleCheckAnswerClick}
            >
                <>
                    {currentConjugations ? (
                        <>
                            <p
                                className="w-full font-bold flex justify-between place-items-center"
                                style={{ marginBottom: "10px" }}
                            >
                                <span
                                    className="bg-[#000000] text-[#FFF8EB] rounded-[3px]"
                                    style={{ padding: "5px 8px" }}
                                >
                                    {verbs.find((verb) => verb.verbId === selectedVerb)?.infinitive}
                                </span>

                                <span
                                    className="text-[0.4375rem] bg-[#F2B441] rounded-[3px]"
                                    style={{ padding: "5px 8px" }}
                                >
                                    {tenses.find((tense) => tense.tenseId === selectedTense)?.tenseText}
                                </span>
                            </p>

                            <section>
                                <p></p>
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
                                            <SortableContext items={order} strategy={verticalListSortingStrategy}>
                                                {order.map((answerIndex) => (
                                                    <SortableTile
                                                        key={answerIndex}
                                                        id={answerIndex}
                                                        label={currentCorrectAnswers[answerIndex]}
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
                            </section>
                        </>
                    ) : null}
                </>
            </Card>
        </>
    );
};

export default Slider;