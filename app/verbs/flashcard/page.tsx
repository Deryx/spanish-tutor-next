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
        className="border-y-[0.5px] border-gray-300"
        style={{ padding: "15px 0" }}
      >
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VERB · STUDY</p>
        <h1 className="text-[1rem] font-bold">Verb flashcards</h1>
        <p className="text-[0.5rem] text-[#637789]">Explore each verb across five essential tenses.</p>
      </section>

      <div style={{ paddingTop: "15px" }}>
        <Flashcard
          tenses={tenses}
          verbs={verbs}
        />
      </div>
    </>
  );
}

export default FlashcardPage;
