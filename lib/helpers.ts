export const RandomNumberArrayGenerator = (min: number, max: number, length: number): number[] => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!randomNumbers.includes(randomIndex)) {
            randomNumbers.push(randomIndex);
        } else {
            i--;
        }
    }

    return randomNumbers;
};

export const shuffleArray = <T,>(items: T[]): T[] => {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
};
