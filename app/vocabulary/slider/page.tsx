import Slider from './components/slider';
import { getDatabaseData } from "@/lib/database";
import { Category, Vocabulary } from "@/types/vocabulary";

const SliderPage = async() => {
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
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VOCABULARY · MATCH</p>
        <h1 className="text-[1rem] font-bold">Vocabulary Slider</h1>
        <p className="text-[0.5rem] text-[#637789]">Match each Spanish word with its English meaning.</p>
      </section>

      <div style={{ padding: "15px 0" }}>
      <Slider
        categories={categories}
        entries={entries}
      />
      </div>
    </>
  );
}

export default SliderPage;
