import Conjugator from "./components/conjugator";
import { getDatabaseData } from "@/lib/database";
import { Tense, Verb } from "@/types/verbs";

const ConjugatorPage = async () => {
  const [verbs, tenses] = await Promise.all([
    getDatabaseData<Verb[]>("Verbs"),
    getDatabaseData<Tense[]>("Tenses")
  ]);

  return (
    <>
      <section
        className="p-4 border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VERB · RECALL</p>
        <h1 className="text-[1rem] font-bold">Conjugator</h1>
        <p className="text-[0.5rem] text-[#637789]">Write the form that belongs with each pronoun.</p>
      </section>

      <div className="p-4">
        <Conjugator
          tenses={tenses}
          verbs={verbs}
        />
      </div>
    </>
  );
}

export default ConjugatorPage;
