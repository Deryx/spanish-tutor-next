export type Category = {
    categoryId: number;
    categoryText: string;
};

export type Vocabulary = {
    wordId: number;
    wordText: string;
    translation: string;
    pronunciation: string;
    categoryId: number;
};