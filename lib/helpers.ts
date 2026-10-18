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
