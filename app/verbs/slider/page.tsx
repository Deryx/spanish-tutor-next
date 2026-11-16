import Slider from "./components/slider";
import { getDatabaseData } from "@/lib/database";
import { Tense, Verb } from "@/types/verbs";

const SliderPage = async () => {
  const [verbs, tenses] = await Promise.all([
    getDatabaseData<Verb[]>("Verbs"),
    getDatabaseData<Tense[]>("Tenses")
  ]);

  return (
    <>
      <section
        className="p-4 border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VERB · MATCH</p>
        <h1 className="text-[1rem] font-bold">Verb Slider</h1>
        <p className="text-[0.5rem] tqext-[#637789]">Match each pronoun to the correct conjugation.</p>
      </section>

      <div className="p-4">
        <Slider
          tenses={tenses}
          verbs={verbs}
        />
      </div>
    </>
  );
}

export default SliderPage;
