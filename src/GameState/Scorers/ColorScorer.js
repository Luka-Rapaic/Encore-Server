const Color = require("../../Color");
const Message = require("../../Message");

class ColorScorer {
    #isFirstScore = {}
    #hasScoredThisTurn = {}
    #players;

    constructor(players) {
        this.#players = players;

        for (const color of Color) {
            this.#isFirstScore[color] = true;
            this.#hasScoredThisTurn[color] = Set();
        }
    }

    getScore(player, color) {
        if (this.#isFirstScore[color]) {
            Message.crossColor(player, color, true);
            this.#hasScoredThisTurn[color].add(player);
            return 5;
        }
        Message.crossColor(player, color, false);
        return 3;
    }

    endTurn() {
        for (const color of Color)
            if (this.#hasScoredThisTurn[color].size !== 0) {
                this.#sendUpdates(color);
                this.#isFirstScore[color] = false;
                this.#hasScoredThisTurn[color] = Set();
            }
    }

    #sendUpdates(color) {
        for (const player of this.#players)
            if (!this.#hasScoredThisTurn[color].has(player))
                Message.circleColor(player, color);
    }
}

module.exports = ColorScorer;