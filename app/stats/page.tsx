import StatsView from "./components/stats";
import { getDatabaseData } from "@/lib/database";
import { Tense, Verb } from "@/types/verbs";
import { Vocabulary } from "@/types/vocabulary";

const StatsPage = async () => {
  const [words, verbs, tenses] = await Promise.all([
    getDatabaseData<Vocabulary[]>("Dictionary"),
    getDatabaseData<Verb[]>("Verbs"),
    getDatabaseData<Tense[]>("Tenses")
  ]);

  return (
    <>
      <section
        className="p-4 w-full border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[1.25rem] font-bold">PROGRESS</p>
        <h1 className="text-[2.5rem] font-bold">Your results</h1>
        <p className="text-[1.25rem] text-[#637789]">Words and verbs move up a box each time you get them right.</p>
      </section>

      <div className="w-full p-4">
        <StatsView
          words={words}
          verbs={verbs}
          tenses={tenses}
        />
      </div>
    </>
  );
};

export default StatsPage;
