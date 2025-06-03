const InvalidChoiceError = require("./InvalidChoiceError");

class Color {
    #tileMap;

    constructor(colorMap) {
        this.#tileMap = colorMap
    }

    crossTiles(tiles) {
        this.#checkTiles(tiles);
        for (let tile of tiles) this.#tileMap.delete(tile);
    }

    areAllCrossed() {
        return this.#tileMap.size() === 0;
    }

    #checkTiles(tiles) {
        for (let tile of tiles)
            if (!this.#tileMap.has(tile))
                throw new InvalidChoiceError();
    }
}

module.exports = Color;
