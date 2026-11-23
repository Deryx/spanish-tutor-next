import Flashcard from "./components/flashcard";
import { getDatabaseData } from "../../../lib/database";
import { Tense, Verb } from "../../../types/verbs";

const FlashcardPage = async() => {
  const [verbs, tenses] = await Promise.all([
    getDatabaseData<Verb[]>("Verbs"),
    getDatabaseData<Tense[]>("Tenses")
  ]);
  return (
    <>
      <section
        className="p-4 w-full border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] font-bold">VERB · STUDY</p>
        <h1 className="text-[1.5rem] md:text-[2.25rem] lg:text-[2.25rem] font-bold">Verb flashcards</h1>
        <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.25rem] text-[#637789]">Explore each verb across five essential tenses.</p>
      </section>

      <div className="w-full p-4">
        <Flashcard
          tenses={tenses}
          verbs={verbs}
        />
      </div>
    </>
  );
}

export default FlashcardPage;
