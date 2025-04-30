const TileMap = require("./TileMap");

class Stars {
    #tileMap;

    constructor() {
        this.#tileMap = new TileMap(
            new Map([
                [0, new Set([7, 11])],
                [1, new Set([2, 4, 9])],
                [2, new Set([0, 6])],
                [3, new Set([5, 13])],
                [5, new Set([1, 3, 8, 10, 14])],
                [6, new Set([12])]
            ])
        );
    }

    crossTiles(tiles) {
        for (let tile of tiles)
            if (this.#tileMap.has(tile))
                this.#tileMap.delete(tile)
    }

    getCrossedCount() {
        return 15 - this.#tileMap.size();
    }
}

module.exports = Stars;