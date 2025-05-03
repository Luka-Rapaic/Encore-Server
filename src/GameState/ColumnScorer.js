class ColumnScorer {
    // Points awarded the first time and subsequent times a column is scored
    #scoreMatrix = [
        [5, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 5],
        [3, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 3]
    ];

    // Tracks whether each column has been scored at least once
    #isFirstScore = new Array(15).fill(true);
    #scoredThisTurn = new Array(15).fill(false);

    getScore(column) {
        this.#scoredThisTurn[column] = true;
        if (this.#isFirstScore[column]) {
            return this.#scoreMatrix[0][column]; // First-time score
        }
        return this.#scoreMatrix[1][column]; // Subsequent score
    }

    endTurn() {
        for (let column = 0; column < 15; column++) {
            if (this.#scoredThisTurn[column]) {
                this.#scoredThisTurn[column] = false;
                if (this.#isFirstScore[column])
                    this.#isFirstScore[column] = false;
            }
        }
    }
}

module.exports = ColumnScorer;