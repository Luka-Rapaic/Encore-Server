class ColorScorer {
    // Tracks whether each color has been scored at least once
    #isFirstScore = {
        "green": true,
        "blue": true,
        "red": true,
        "orange": true,
        "yellow": true
    }

    #scoredThisTurn = {
        "green": false,
        "blue": false,
        "red": false,
        "orange": false,
        "yellow": false
    }

    getScore(color) {
        this.#scoredThisTurn[color] = true;
        if (this.#isFirstScore[color]) {
            return 5; // First-time score
        }
        return 3; // Subsequent score
    }

    endTurn() {
        const colors = ["green", "blue", "red", "orange", "yellow"]

        for (const color of colors) {
            if (this.#scoredThisTurn[color]) {
                this.#scoredThisTurn[color] = false;
                if (this.#isFirstScore[color])
                    this.#isFirstScore[color] = false;
            }
        }
    }
}

module.exports = ColorScorer;