const PREFERRED_LANG = "es-ES"; // use "es-MX" or "es-US" if you prefer a Latin American voice

const normalizeLang = (lang: string): string => lang.replace("_", "-");

export const speechSupported = (): boolean =>
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

const score = (voice: SpeechSynthesisVoice): number => {
    let points = 0;

    if (normalizeLang(voice.lang) === PREFERRED_LANG) points += 4;
    if (/natural|neural|online/i.test(voice.name)) points += 3; // Edge / Windows neural voices
    if (/google/i.test(voice.name)) points += 2;

    return points;
};

export const bestSpanishVoice = (): SpeechSynthesisVoice | null => {
    const spanish = window.speechSynthesis
        .getVoices()
        .filter((voice) => normalizeLang(voice.lang).toLowerCase().startsWith("es"));

    if (spanish.length === 0) return null;

    return spanish.reduce((best, voice) => (score(voice) > score(best) ? voice : best));
};

export const warmUp = (): void => {
    if (speechSupported()) window.speechSynthesis.getVoices();
};

// Browsers load voices asynchronously and sometimes in stages (local ones first, online ones later),
// so when no Spanish voice is there yet, wait for the next update before giving up.
const findSpanishVoice = async (): Promise<SpeechSynthesisVoice | null> => {
    const synth = window.speechSynthesis;
    let voice = bestSpanishVoice();
    if (voice) return voice;

    await new Promise<void>((resolve) => {
        let timer: ReturnType<typeof setTimeout>;

        const done = () => {
            clearTimeout(timer);
            synth.removeEventListener("voiceschanged", done);
            resolve();
        };

        timer = setTimeout(done, 2500);
        synth.addEventListener("voiceschanged", done);
    });

    voice = bestSpanishVoice();

    if (!voice) {
        console.info(
            "No Spanish voice available. Voices this browser can see:",
            synth.getVoices().map((v) => `${v.name} (${v.lang})`)
        );
    }

    return voice;
};

/**
 * Speaks the text with a Spanish voice. Returns false (and says nothing) when the
 * device has no Spanish voice, rather than reading Spanish with an English voice.
 */
export const speak = async (text: string): Promise<boolean> => {
    if (!speechSupported() || !/\p{L}/u.test(text)) return false;

    const voice = await findSpanishVoice();
    if (!voice) return false;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;

    synth.speak(utterance);

    return true;
};