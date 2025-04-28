class ColorScorer {
    // Tracks whether each color has been scored at least once
    #isFirstScore = {
        "green": true,
        "blue": true,
        "red": true,
        "orange": true,
        "yellow": true
    }

    getScore(color) {
        if (this.#isFirstScore[color]) {
            this.#isFirstScore[color] = false;
            return 5; // First-time score
        }
        return 3; // Subsequent score
    }
}

module.exports = ColorScorer;