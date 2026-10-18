"use client";

import { useState } from "react";

import Dropdown from "../../../../components/dropdown";
import Card from "../../../../components/card";
import { Category, Vocabulary } from "../../../../types/vocabulary";

type FlashcardProps = {
    categories: Category[];
    entries: Vocabulary[];
};

const Flashcard = ({ categories, entries }: FlashcardProps ) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [currentEntry, setCurrentEntry] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
    setCurrentEntry(0);
    setIsRevealed(false);
  };

  const handleLeftButtonClick = () => {
    setCurrentEntry((i) => Math.max(i - 1, 0));
    setIsRevealed(false);
  };

  const handleRightButtonClick = () => {
    setCurrentEntry((i) => Math.min(i + 1, studySet.length - 1));
    setIsRevealed(false);
  };

  const handleIsRevealedClick = () => {
    setIsRevealed(true);
  };

  const studySet: Vocabulary[] =
      selectedCategory === 0
          ? entries
          : entries.filter((entry) => entry.categoryId === selectedCategory);

  return (
    <>
      <div
        className="w-3/5 flex place-items-center"
        style={{ margin: "0 auto" }}
      >
        <Dropdown
          type="category"
          label="Category"
          options={categories}
          firstOption="All words"
          value={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      <Card
        leftButtonLabel="Previous"
        rightButtonLabel="Next"
        onLeftButtonClick={handleLeftButtonClick}
        onRightButtonClick={handleRightButtonClick}
      >
        <div className="flex flex-col place-items-center">
          <p
            className="text-[1.5rem] bg-[#000000] text-[#FFFAF2] rounded-[3px] font-bold"
            style={{ marginTop: "20px", padding: "0 8px" }}
          >
              {studySet[currentEntry]?.wordText}
          </p>
          <p
            style={{ marginBottom: "10px" }}
          >
            {studySet[currentEntry]?.pronunciation}
          </p>
          {
            !isRevealed ? (
              <button
                onClick={handleIsRevealedClick}
                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[3px] text-[0.4375rem]"
                style={{ padding: "5px 8px", marginBottom: "25px" }}
              >
                Reveal meaning
              </button>
            ) : <p
                  className="text-[#637789] text-[0.75rem] font-bold"
                  style={{ marginBottom: "25px" }}>{studySet[currentEntry]?.translation}
                </p>
          }
        </div>
      </Card>
    </>
  );
}

export default Flashcard;
