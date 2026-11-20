import Fillin from './components/fill-in';
import { getDatabaseData } from "@/lib/database";
import { Category, Vocabulary } from "@/types/vocabulary";

const FillInPage = async() => {
  const [categories, entries] = await Promise.all([
    getDatabaseData<Category[]>("Categories"),
    getDatabaseData<Vocabulary[]>("Dictionary")
  ]);

  return (
    <>
      <section
        className="p-4 border-y-[0.5px] border-gray-300"
      >
        <p className="text-[#c9362b] text-[1.25rem] font-bold">VOCABULARY · RECALL</p>
        <h1 className="text-[2.25rem] font-bold">Fill-in</h1>
        <p className="text-[1.25rem] text-[#637789]">Translate each English prompt into Spanish.</p>
      </section>

      <div className="p-4">
        <Fillin
          categories={categories}
          entries={entries}
        />
      </div>
    </>
  );
}

export default FillInPage;
