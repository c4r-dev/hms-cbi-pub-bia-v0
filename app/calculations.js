
const calculateProbability = (d, b, n, criticalValue) => {
    const iterations = 1000;
    let significantCount = 0;

    for (let i = 0; i < iterations; i++) {
        const sampleMean = d + b + Math.random() * Math.sqrt(1 / n);
        const tStatistic = sampleMean / (1 / Math.sqrt(n));

        if (tStatistic > criticalValue) {
            significantCount++;
        }
    }

    return significantCount / iterations;
};


const effectSizes = Array.from({ length: 21 }, (_, i) => -1 + i * 0.1);
const probabilities05 = effectSizes.map((d) =>
    calculateProbability(d, biasAmount, sampleSize, 1.645)
);
const probabilities01 = effectSizes.map((d) =>
    calculateProbability(d, biasAmount, sampleSize, 2.33)
);
const probabilities001 = effectSizes.map((d) =>
    calculateProbability(d, biasAmount, sampleSize, 3.09)
);