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
        className="border-y-[0.5px] border-gray-300"
        style={{ padding: "15px 0" }}
      >
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VOCABULARY · STUDY</p>
        <h1 className="text-[1rem] font-bold">Vocabulary flashcards</h1>
        <p className="text-[0.5rem] text-[#637789]">Build recognition one useful word at a time.</p>
      </section>

      <div style={{ paddingTop: "15px" }}>
      <Flashcard
        categories={categories}
        entries={entries}
      />
      </div>
    </>
  );
};

export default FlashcardPage;