import Link from 'next/link';

import Logo from '../components/logo';
import HomeCard from '../components/homeCard'

const HomePage = () => {
  return (
    <div className="flex flex-col w-3/5 bg-[#fff8eb] text-black">
      <header
        className="w-full flex place-items-center border-y-[0.5px] border-gray-300"
        style={{ padding: "10px 0" }}
      >
        <div className="w-1/3">
          <Logo />
        </div>

        <div
          className="flex w-1/3 justify-center"
        >
          <a
            className="text-[0.45rem]"
            style={{
              padding: "5px 8px",
              color: "#84929f"
            }}
            href="#Verbs">
              Verbs
          </a>
          <a
            className="text-[0.45rem]"
            style={{
              padding: "5px 8px",
              color: "#82929f"
            }}
            href="#Vocabulary"
          >
              Vocabulary
          </a>
        </div>

        <div
           className="flex w-1/3 justify-end"
          >
          <a
            className="bg-[#f2b441] text-[0.45rem] font-semibold rounded-[3px]"
            style={{ padding: "3px 10px" }}
            href="#">
              Start practicing
            </a>
        </div>
      </header>

      <main>
        <div
          className="flex w-full gap-15"
          style={{ margin: "20px 0" }}
        >
          <section className="w-1/2">
            <h1
              className="text-[1.85rem] font-bold"
            >
              Your Spanish, one card at a time
            </h1>
            <h3
              className="text-[0.5rem] text-[#637789]"
              style={{ marginBottom: "10px" }}
            >
              A tidy library of verbs and words built for daily practice. Pick an activity and begin in a minute.
            </h3>

            <div
              className="flex gap-2"
              style={{ marginTop: "20px" }}
            >
              <a
                href="#Verbs"
                className="bg-[#17324D] text-[0.45rem] font-semibold rounded-[3px]"
                style={{ 
                  padding: "6px 8px",
                  color: "#fff8eb"
                }}
              >
                  Browse verbs
              </a>
              <a
                href="#Vocabulary"
                className="text-[0.45rem] font-semibold rounded-[3px]"
                style={{
                  padding: "6px 8px",
                  backgroundColor: "#FFFaF2",
                  color: "#17324D",
                  border: "0.5px solid #84929f"
                }}
              >
                Browse vocabulary
              </a>
            </div>

            <div
              className="grid grid-cols-3 gap-1"
              style={{ marginTop: "30px" }}
            >
              <div className="border-r border-[#84929f]">
                <p className="text-[1rem] font-bold">100</p>
                <p className="text-[0.4375rem] text-[#637789] text-[] font-semibold">COMMON VERBS</p>
              </div>
              <div
                className="border-r border-[#84929f]"
                style={{ paddingLeft: "5px" }}
              >
                <p className="text-[1rem] font-bold">700+</p>
                <p className="text-[0.4375rem] text-[#637789] font-semibold">WORDS</p>
              </div>
              <div
                style={{ paddingLeft: "5px" }}
              >
                <p className="text-[1rem] font-bold">9</p>
                <p className="text-[0.4375rem] text-[#637789] font-semibold">ACTIVITIES</p>
              </div>
            </div>
          </section>

          <div
            className="w-1/2 flex flex-col bg-[#fffaf2] border border-[0.5px] border-gray-300"
            style={{ padding: "15px" }}
          >
            <div
              className="flex place-items-center w-full justify-between"
            >
              <div
                className="text-[0.3375rem] font-semibold bg-[#f2b441] rounded-[3px]"
                style={{ padding: "3px 4px" }}
              >
                PRACTICE NOW
              </div>
              <div className="text-[0.4rem] text-[#637789]">
                Present tense
              </div>
            </div>

            <section style={{ margin: "10px 0px" }}>
              <h2 className="font-bold">Ser</h2>
              <h3 className="text-[0.4375rem] text-[#637789]">to be &#8212; identify, time, origin</h3>
            </section>

            <div
              className="grid grid-cols-2 gap-1"
              style={{ marginBottom: "10px" }}
            >
              <div>
                <div
                  className=" text-[0.4375rem] rounded-[3px] border-[0.5px] border-gray-300 bg-[#FFF9EE]"
                  style={{ padding: "5px", marginBottom: "5px" }}
                >
                  <p className="text-[#637789]">yo</p>
                  <p className="font-bold">soy</p>
                </div>
                <div
                  className="text-[0.4375rem] rounded-[3px] border-[0.5px] border-gray-300 bg-[#FFF9EE]"
                  style={{ padding: "5px", marginBottom: "5px" }}
                >
                  <p className="text-[#637789]">tú</p>
                  <p className="font-bold">eres</p>
                </div>
              </div>
              <div>
                <div
                  className=" text-[0.4375rem] rounded-[3px] border-[0.5px] border-gray-300 bg-[#FFF9EE]"
                  style={{ padding: "5px", marginBottom: "5px" }}
                >
                  <p className="text-[#637789]">él/ella</p>
                  <p className="font-bold">es</p>
                </div>
                <div
                  className=" text-[0.4375rem] rounded-[3px] border-[0.5px] border-gray-300 bg-[#FFF9EE]"
                  style={{ padding: "5px", marginBottom: "5px" }}
                >
                  <p className="text-[#637789]">nosotros</p>
                  <p className="font-bold">somos</p>
                </div>
              </div>
            </div>

            <Link
              href="/verbs/flashcard"
              className="w-full text-center bg-[#c9362b] text-[0.5rem] font-semibold rounded-[3px]"
              style={{ padding: "5px 0", color: "#fff8eb" }}
            >
              Open verb flashcards
            </Link>
          </div>
        </div>

        <section>
          <div className="flex w-full justify-between border-b-[0.5px] border-gray-300">
            <div>
              <a
                id="Verbs"
                className="text-[0.4375rem] font-semibold"
                style={{ color: "#c9362b" }}
              >
                (A) VERBS
              </a>
              <h2 className="text-[1rem] font-bold">100 common verbs</h2>
            </div>
            <div>
              <p className="text-[0.4375rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="text-[0.45rem] text-[#637789]"
                style={{ marginTop: "22px" }}
              >
                Present · preterite · imperfect · conditional · future
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-4 h-full"
            style={{ marginTop: "10px" }}
          >
            <HomeCard
              buttonColor='red'
              buttonText='01'
              title='Verb flashcards'
              tagline='Study the forms before putting your recall to work.'
              href='/verbs/flashcard'
              hrefColor='red'
            />
            <HomeCard
              buttonColor='red'
              buttonText='02'
              title='Conjugator'
              tagline='Test yourself across five essential indicative tenses.'
              href='/verbs/conjugator'
              hrefColor='red'
            />
            <HomeCard
              buttonColor='red'
              buttonText='03'
              title='Verb slider'
              tagline='Match conjugations with the correct Spanish pronouns.'
              href='/verbs/slider'
              hrefColor='red'
            />
          </div>
        </section>

        <section>
          <div
            className="flex w-full justify-between border-b-[0.5px] border-gray-300"
            style={{ marginTop: "10px" }}
          >
            <div>
              <a
                id="Vocabulary"
                className="text-[0.4375rem] font-semibold"
                style={{ color: "#c9362b"}}
              >
                (B) VOCABULARY
              </a>
              <h2 className="text-[1rem] font-bold">700+ words</h2>
            </div>
            <div>
              <p className="text-[0.4375rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="text-[0.45rem] text-[#637789]"
                style={{ marginTop: "22px" }}
              >
                Choose a category or practice everything
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-4 h-full"
            style={{ marginTop: "10px" }}
          >
            <HomeCard
              buttonColor='yellow'
              buttonText='01'
              title='Vocabulary flashcards'
              tagline='Build recognition with Spanish-to-English study cards.'
              href='/vocabulary/flashcards'
              hrefColor='black'
            />

            <HomeCard
              buttonColor='yellow'
              buttonText='02'
              title='Completion'
              tagline='Fill in the missing letters, including every accent.'
              href='/vocabulary/completion'
              hrefColor='black'
            />

            <HomeCard
              buttonColor='yellow'
              buttonText='03'
              title='Fill in'
              tagline='Recall the entire Spanish word from its translation.'
              href='/vocabulary/fill-in'
              hrefColor='black'
            />

            <HomeCard
              buttonColor='yellow'
              buttonText='04'
              title='Quiz'
              tagline='Choose the right translation from six possible answers.'
              href='/vocabulary/quiz'
              hrefColor='black'
            />

            <HomeCard
              buttonColor='yellow'
              buttonText='05'
              title='Scramble'
              tagline='Put every letter back in its proper place.'
              href='/vocabulary/scramble'
              hrefColor='black'
            />

            <HomeCard
              buttonColor='yellow'
              buttonText='06'
              title='Vocabulary slider'
              tagline='Match Spanish words with ther English translations.'
              href='/vocabulary/slider'
              hrefColor='black'
            />
          </div>
        </section>
      </main>

      <footer
        className="border-gray-300 border-t-[0.5px]"
        style={{
          margin: "20px 0"
        }}
      >
        <div
          style={{ paddingTop: "20px" }}
        >
          <Logo />
        </div>

        <div 
          className="flex w-full justify-between text-[0.4375rem] text-[#84929f]"
          style={{ marginTop: "5px" }}
        >
          <p>Verbs, words, and focused practice at your own pace</p>
          <p>100 verbs · 700+ words · 9 activities</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
