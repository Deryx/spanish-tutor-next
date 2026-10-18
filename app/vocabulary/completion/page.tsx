import Completion from "./components/completion";
import { getDatabaseData } from "../../../lib/database";
import { Category, Vocabulary } from "../../../types/vocabulary";

const CompletionPage = async() => {
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
        <p className="text-[#c9362b] text-[0.375rem] font-bold">VERB · SPELLING</p>
        <h1 className="text-[1rem] font-bold">Completion</h1>
        <p className="text-[0.5rem] text-[#637789]">Restore the letters missing from each Spanish word.</p>
      </section>

      <div style={{ paddingTop: "15px" }}>
        <Completion
          categories={categories}
          entries={entries}
        />
      </div>
    </>
  );
}

export default CompletionPage;
