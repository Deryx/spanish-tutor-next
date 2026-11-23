"use client";

import { useState } from "react";

import Dropdown from "@/components/dropdown";
import Card from "@/components/card";
import SpeakButton from "@/components/speakButton";
import { Category, Vocabulary } from "@/types/vocabulary";

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
        className="w-full md:m-auto md:m-0 lg:m-auto lg:m-0 md:w-3/5 lg:w-3/5 flex place-items-center"
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
          <div className="flex place-items-center gap-2">
            <p
              className="text-[1.5rem] md:text-[3rem] lg:text-[3rem] px-4 pb-2 bg-[#000000] text-[#FFFAF2] rounded-[6px] font-bold"
            >
                {studySet[currentEntry]?.wordText}
            </p>
            <span className="ml-1">
              <SpeakButton text={studySet[currentEntry]?.wordText ?? ""} />
            </span>
          </div>
          <p
            className="text-[0.75rem] md:text-[1.5rem] lg:text-[1.5rem] text-[#637789]"
          >
            {studySet[currentEntry]?.pronunciation}
          </p>
          {
            !isRevealed ? (
              <button
                onClick={handleIsRevealedClick}
                className="border-[0.5px] border-gray-300 bg-[#FFF8EB] rounded-[6px] text-[1rem] md:text-[1.5rem] lg:text-1.5rem] px-4 py-3 mt-8"
              >
                Reveal meaning
              </button>
            ) : <p
                  className="text-[#637789] text-[1rem] md:text-[3rem] lg:text-[3rem] mt-8 font-bold"
                  >
                    {studySet[currentEntry]?.translation
                  }
                </p>
          }
        </div>
      </Card>
    </>
  );
}

export default Flashcard;
