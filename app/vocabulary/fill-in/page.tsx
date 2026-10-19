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
        className="border-y-[0.5px] border-gray-300"
        style={{ padding: "15px 0" }}
      >
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VOCABULARY · RECALL</p>
        <h1 className="text-[1rem] font-bold">Fill-in</h1>
        <p className="text-[0.5rem] text-[#637789]">Translate each English prompt into Spanish.</p>
      </section>

      <div style={{ paddingTop: "15px" }}>
        <Fillin
          categories={categories}
          entries={entries}
        />
      </div>
    </>
  );
}

export default FillInPage;
