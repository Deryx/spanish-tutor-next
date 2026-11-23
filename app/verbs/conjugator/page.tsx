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
        <p className="text-[#c9362b] text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] font-bold">VERB · RECALL</p>
        <h1 className="text-[1.5rem] md:text-[2.25rem] lg:text-[2.25rem] font-bold">Conjugator</h1>
        <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.25rem] text-[#637789]">Write the form that belongs with each pronoun.</p>
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
