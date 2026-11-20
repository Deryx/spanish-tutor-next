import Link from 'next/link';

import Logo from '../components/logo';
import HomeCard from '../components/homeCard'

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen md:w-4/5 lg:w-4/5 md:mx-auto bg-[#fff8eb] text-black">
      <header
        className="p-4 w-full flex justify-between place-items-center border-y-[0.5px] border-gray-300"
      >
        <div className="flex w-1/2 md:w-1/3 lg:w-1/3">
          <Logo />
        </div>

        <div
          className="hidden flex md:w-1/3 lg:w-1/3 lg:justify-center md:justify-center"
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
           className="flex w-1/2 md:w-1/3 lg:w-1/3 justify-end"
          >
          <a
            className="bg-[#f2b441] text-[0.45rem] font-semibold rounded-[3px]"
            style={{ padding: "3px 10px" }}
            href="#">
              Start practicing
            </a>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-3 md:flex md:flex-col lg:gap-3 md:gap-3 shrink-0">
        <div
          className="p-4 grid grid-cols-1 gap-3 md:flex md:flex lg:flex w-full md:gap-15"
        >
          <section className="w-full md:w-1/2 lg:w-1/2">
            <h1
              className="text-[1.85rem] font-bold"
            >
              Your Spanish, one card at a time
            </h1>
            <h3
              className="text-[0.5rem] text-[#637789]"
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
                <p className="text-[1rem] font-bold">106</p>
                <p className="text-[0.4375rem] text-[#637789] text-[] font-semibold">COMMON VERBS</p>
              </div>
              <div
                className="border-r border-[#84929f]"
                style={{ paddingLeft: "5px" }}
              >
                <p className="text-[1rem] font-bold">1,000+</p>
                <p className="text-[0.4375rem] text-[#637789] font-semibold">COMMON WORDS</p>
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
            className="w-full p-4 md:w-1/2 lg:w-1/2 md:flex lg:flex md:flex-col lg:flex-col grid grid-cols-1 gap-3 bg-[#fffaf2] border border-[0.5px] border-gray-300"
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

            <section>
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

        <section className="w-full p-4 md:mt-[-20px] lg:mt-[-20px]">
          <div className="grid grid-cols-1 gap-3 lg:flex w-full justify-between border-b-[0.5px] border-gray-300">
            <div>
              <a
                id="Verbs"
                className="text-[0.4375rem] font-semibold"
                style={{ color: "#c9362b" }}
              >
                (A) VERBS
              </a>
              <h2 className="text-[1rem] font-bold">106 common verbs</h2>
            </div>
            <div>
              <p className="text-[0.4375rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="mt-[-15px] md:mt-[-20px] text-[0.45rem] text-[#637789]"
              >
                Present · preterite · imperfect · conditional · future
              </div>
            </div>
          </div>

          <div
            className="mb-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-4 h-full mt-5"
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

        <section className="w-full p-4 mt-15 md:mt-[-40px] lg:mt-[-40px]">
          <div
            className="grid grid-cols-1 gap-3 lg:flex w-full justify-between border-b-[0.5px] border-gray-300"
          >
            <div>
              <a
                id="Vocabulary"
                className="text-[0.4375rem] font-semibold"
                style={{ color: "#c9362b"}}
              >
                (B) VOCABULARY
              </a>
              <h2 className="text-[1rem] font-bold">1000+ words</h2>
            </div>
            <div>
              <p className="text-[0.4375rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="mt-[-15px] md:mt-[-20px] text-[0.45rem] text-[#637789]"
              >
                Choose a category or practice everything
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-4 h-full mt-5"
          >
            <HomeCard
              buttonColor='yellow'
              buttonText='01'
              title='Vocabulary flashcards'
              tagline='Build recognition with Spanish-to-English study cards.'
              href='/vocabulary/flashcard'
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
        className="w-full shrink-0 px-4 pt-5 pb-5 mt-20 md:mt-5 border-gray-300 border-t-[0.5px]"
      >
        <div>
          <Logo />
        </div>

        <div
          className="w-full md:flex md:justify-between lg:flex lg:justify-between text-[0.4375rem] text-[#84929f]"
        >
          <p className="mt-2 mb-2">Verbs, words, and focused practice at your own pace</p>
          <p>106 verbs · 1000+ words · 9 activities</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
