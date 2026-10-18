export type Tense = {
    tenseId: number;
    tenseText: string;
};

export type Verb = {
    verbId: number;
    infinitive: string;
    translation: string;
    pronunciation: string;
};

export type Subject = {
    subjectId: number;
    subjectPronoun: string;
    subjectTranslation: string;
};

export type Conjugation = {
    id: number;
    conjugation: string;
    subject: number;
    tense: number;
    verb: number;
};

export type ConjugationSet = {
    id: number;
    verb: number;
    verbId: number;
    tense: number;
    tenseId: number;
    yo: string;
    tu: string;
    el: string;
    nosotros: string;
    vosotros: string;
    ellos: string;
};