class Color {
    #tileMap;

    constructor(colorMap) {
        this.#tileMap = colorMap
    }

    crossTiles(tiles) {
        if (this.#checkTiles(tiles)) {
            for (let tile of tiles) this.#tileMap.delete(tile)
            return true
        }
        return false;
    }

    areAllCrossed() {
        return this.#tileMap.size() === 0;
    }

    #checkTiles(tiles) {
        for (let tile of tiles)
            if (!this.#tileMap.has(tile))
                return false;
        return true;
    }
}

module.exports = Color;
