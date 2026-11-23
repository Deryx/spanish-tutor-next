import Link from 'next/link';

import Logo from '../components/logo';
import HomeCard from '../components/homeCard'

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen md:w-3/5 lg:w-3/5 md:mx-auto bg-[#fff8eb] text-black">
      <header
        className="p-4 w-full flex justify-between place-items-center border-y-[0.5px] border-gray-300"
      >
        <div className="flex w-1/2 md:w-1/3 lg:w-1/3">
          <Logo />
        </div>

        <div
          className="hidden flex md:visible lg:visible md:w-1/3 lg:w-1/3 lg:justify-center md:justify-center"
        >
          <a
            className="text-[1rem]"
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
          <Link
            className="text-[1rem]"
            style={{
              padding: "5px 8px",
              color: "#84929f"
            }}
            href="/stats"
          >
              Progress
          </Link>
        </div>

        <div
           className="flex w-1/2 md:w-1/3 lg:w-1/3 justify-end"
          >
          <a
            className="bg-[#f2b441] text-[1rem] font-semibold rounded-[3px]"
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
              className="text-[2.5rem] md:text-[3.75rem] lg:text-[3.75rem] font-bold"
            >
              Your Spanish, one card at a time
            </h1>
            <h3
              className="text-[1.25rem] text-[#637789]"
            >
              A tidy library of verbs and words built for daily practice. Pick an activity and begin in a minute.
            </h3>

            <div
              className="flex gap-2 mt-8"
            >
              <a
                href="#Verbs"
                className="bg-[#17324D] text-[1.25rem] font-semibold rounded-[6px] py-2 px-8"
                style={{
                  color: "#fff8eb"
                }}
              >
                  Browse verbs
              </a>
              <a
                href="#Vocabulary"
                className="text-[1.25rem] bg-[#FFFaF2] border-[0.5px] border-[#84929f] font-semibold rounded-[6px] py-2 px-8"
                style={{
                  color: "#17324D",
                }}
              >
                Browse vocabulary
              </a>
            </div>

            <div
              className="grid grid-cols-3 gap-1 mt-5"
            >
              <div className="border-r border-[#84929f]">
                <p className="text-[2rem] font-bold">106</p>
                <p className="text-[1rem] text-[#637789] font-semibold">COMMON VERBS</p>
              </div>
              <div
                className="border-r border-[#84929f]"
                style={{ paddingLeft: "5px" }}
              >
                <p className="text-[2rem] font-bold">1,000+</p>
                <p className="text-[1rem] text-[#637789] font-semibold">COMMON WORDS</p>
              </div>
              <div
                style={{ paddingLeft: "5px" }}
              >
                <p className="text-[2rem] font-bold">9</p>
                <p className="text-[1rem] text-[#637789] font-semibold">ACTIVITIES</p>
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
                className="text-[0.8rem] font-semibold bg-[#f2b441] rounded-[6px] pt-2 pb-2 pl-3 pr-3"
              >
                PRACTICE NOW
              </div>
              <div className="text-[0.8rem] text-[#637789]">
                Present tense
              </div>
            </div>

            <section>
              <h2 className="font-bold text-[2rem]">Ser</h2>
              <h3 className="text-[1rem] text-[#637789]">to be &#8212; identify, time, origin</h3>
            </section>

            <div
              className="grid grid-cols-2 gap-3 mt-5 mb-5"
            >
              <div>
                <div
                  className=" text-[1rem] rounded-[3px] border-[0.5px] border-gray-300 bg-[#FFF9EE] mb-3 p-2"
                >
                  <p className="text-[#637789]">yo</p>
                  <p className="font-bold">soy</p>
                </div>
                <div
                  className="text-[1rem] rounded-[6px] border-[0.5px] border-gray-300 bg-[#FFF9EE] mb-3 p-2"
                >
                  <p className="text-[#637789]">tú</p>
                  <p className="font-bold">eres</p>
                </div>
              </div>
              <div>
                <div
                  className=" text-[1rem] rounded-[6px] border-[0.5px] border-gray-300 bg-[#FFF9EE] mb-3 p-2"
                >
                  <p className="text-[#637789]">él/ella</p>
                  <p className="font-bold">es</p>
                </div>
                <div
                  className=" text-[1rem] rounded-[6px] border-[0.5px] border-gray-300 bg-[#FFF9EE] mb-3 p-2"
                >
                  <p className="text-[#637789]">nosotros</p>
                  <p className="font-bold">somos</p>
                </div>
              </div>
            </div>

            <Link
              href="/verbs/flashcard"
              className="w-full text-center bg-[#c9362b] text-[1.25rem] text-[#fff8eb] font-semibold rounded-[3px] py-2"
              style={{ color: "#fff8eb" }}
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
                className="text-[1rem] font-semibold"
                style={{ color: "#c9362b" }}
              >
                (A) VERBS
              </a>
              <h2 className="text-[1rem] font-bold">106 common verbs</h2>
            </div>
            <div>
              <p className="text-[1rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="mt-[-15px] md:mt-[0] text-[1rem] text-[#637789]"
              >
                Present · preterite · imperfect · conditional · future
              </div>
            </div>
          </div>

          <div
            className="mb-0 md:mb-10 lg:mb-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-4 md:h-full lg:h-full mt-3 md:mt-5 lg:mt-5"
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

        <section className="w-full p-4 md:mt-[-40px] lg:mt-[-40px]">
          <div
            className="grid grid-cols-1 gap-3 lg:flex w-full justify-between border-b-[0.5px] border-gray-300"
          >
            <div>
              <a
                id="Vocabulary"
                className="text-[1rem] font-semibold"
                style={{ color: "#c9362b"}}
              >
                (B) VOCABULARY
              </a>
              <h2 className="text-[1rem] font-bold">1000+ words</h2>
            </div>
            <div>
              <p className="text-[1rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="mt-[-15px] md:mt-[0] text-[1rem] text-[#637789]"
              >
                Choose a category or practice everything
              </div>
            </div>
          </div>

          <div
            className="md:mb-10 lg:mb-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-4 md:h-full lg:h-full mt-3 md:mt-5 lg:mt-5"
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

        <section className="w-full p-4 md:mt-[-20px] lg:mt-[-20px]">
          <div className="grid grid-cols-1 gap-3 lg:flex w-full justify-between border-b-[0.5px] border-gray-300">
            <div>
              <span
                className="text-[1rem] font-semibold"
                style={{ color: "#c9362b" }}
              >
                (C) PROGRESS
              </span>
              <h2 className="text-[1rem] font-bold">Your results</h2>
            </div>
            <div>
              <p className="text-[1rem] text-[#c9362b] font-semibold">&nbsp;</p>
              <div
                className="mt-[-15px] md:mt-[0] text-[1rem] text-[#637789]"
              >
                Accuracy, words due for review, and the ones you miss most
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-3 lg:gap-4 mt-5"
          >
            <HomeCard
              buttonColor='red'
              buttonText='01'
              title='Progress'
              tagline='See what you have mastered and what is due for review.'
              href='/stats'
              hrefColor='red'
              label='STATS'
              cta='View'
            />
          </div>
        </section>
      </main>

      <footer
        className="w-full shrink-0 px-4 pt-5 pb-5 md:mt-5 border-gray-300 border-t-[0.5px]"
      >
        <div>
          <Logo />
        </div>

        <div
          className="w-full md:flex md:justify-between lg:flex lg:justify-between text-[1rem] text-[#84929f]"
        >
          <p className="mt-2 mb-2">Verbs, words, and focused practice at your own pace</p>
          <p>106 verbs · 1000+ words · 9 activities</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
