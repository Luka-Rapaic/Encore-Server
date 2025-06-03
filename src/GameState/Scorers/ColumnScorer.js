const Message = require("../../Message");

class ColumnScorer {
    // Points awarded the first time and subsequent times a column is scored
    #scoreMatrix = [
        [5, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 5],
        [3, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 3]
    ];

    // Tracks whether each column has been scored at least once
    #isFirstScore = new Array(15).fill(true);
    #hasScoredThisTurn = new Array(15).fill(Set());

    #players;

    constructor(players) {
        this.#players = players;
    }

    getScore(player, column) {
        if (this.#isFirstScore[column]) {
            this.#hasScoredThisTurn[column].add(player);
            return this.#scoreMatrix[0][column]; // First-time score
        }
        Message.crossColumn(player, column, false);
        return this.#scoreMatrix[1][column]; // Subsequent score
    }

    endTurn() {
        for (let column = 0; column < 15; column++) {
            if (this.#hasScoredThisTurn[column].size !== 0) {
                this.#sendUpdates(column);
                this.#isFirstScore[column] = false;
                this.#hasScoredThisTurn[column] = Set();
            }
        }
    }

    #sendUpdates(column) {
        for (const player of this.#players)
            if (this.#hasScoredThisTurn[column].has(player))
                Message.crossColumn(player, column, true);
            else
                Message.circleColumn(player, column);
    }
}

module.exports = ColumnScorer;