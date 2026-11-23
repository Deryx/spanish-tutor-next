import Flashcard from "./components/flashcard";
import { getDatabaseData } from "@/lib/database";
import { Category, Vocabulary } from "@/types/vocabulary";

const FlashcardPage = async() => {
  const [categories, entries] = await Promise.all([
    getDatabaseData<Category[]>("Categories"),
    getDatabaseData<Vocabulary[]>("Dictionary")
  ]);

  return (
    <>
      <section
        className="p-4 border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] font-bold">VOCABULARY · STUDY</p>
        <h1 className="text-[1.5rem] md:text-[2.25rem] lg:text-[2.25rem] font-bold">Vocabulary flashcards</h1>
        <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.25rem] text-[#637789]">Build recognition one useful word at a time.</p>
      </section>

      <div className="p-4">
        <Flashcard
          categories={categories}
          entries={entries}
        />
      </div>
    </>
  );
};

export default FlashcardPage;