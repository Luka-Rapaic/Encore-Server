class Color {
    #colorMap;

    constructor(colorMap) {
        this.#colorMap = colorMap
    }

    crossTiles(tiles) {
        if (this.#checkTiles(tiles)) {
            for (let tile of tiles) this.#colorMap.delete(tile)
            return true
        }
        return false;
    }

    #checkTiles(tiles) {
        for (let tile of tiles)
            if (!this.#colorMap.has(tile))
                return false;
        return true;
    }
}

module.exports = Color;
