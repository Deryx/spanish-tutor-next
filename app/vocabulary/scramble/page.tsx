import Scramble from "./components/scramble";
import { getDatabaseData } from "@/lib/database";
import { Category, Vocabulary } from "@/types/vocabulary";

const ScramblePage = async() => {
  const [categories, entries] = await Promise.all([
    getDatabaseData<Category[]>("Categories"),
    getDatabaseData<Vocabulary[]>("Dictionary")
  ]);

  return (
    <>
      <section
        className="p-4 border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[0.75rem] md:text-[1.25rem] lg:text-[1.25rem] font-bold">VOCABULARY · SPELLING</p>
        <h1 className="text-[1.5rem] md:text-[2.25rem] lg:text-[2.25rem] font-bold">Scramble</h1>
        <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.25rem] text-[#637789]">Put the shuffled letters back in the right order.</p>
      </section>

      <div className="p-4">
        <Scramble
          categories={categories}
          entries={entries}
        />
      </div>
    </>
  );
}

export default ScramblePage;
