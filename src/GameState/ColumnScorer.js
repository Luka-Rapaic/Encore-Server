class ColumnScorer {
    // Points awarded the first time and subsequent times a column is scored
    #scoreMatrix = [
        [5, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 5],
        [3, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 3]
    ];

    // Tracks whether each column has been scored at least once
    #isFirstScore = new Array(15).fill(true);

    getScore(column) {
        if (this.#isFirstScore[column]) {
            this.#isFirstScore[column] = false;
            return this.#scoreMatrix[0][column]; // First-time score
        }
        return this.#scoreMatrix[1][column]; // Subsequent score
    }
}

module.exports = ColumnScorer;