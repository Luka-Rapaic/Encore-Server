class TileMap {
    #map;

    constructor(map) {
        this.#map = map;
    }

    has(tile) {
        if (this.#map.has(tile.row)) return this.#map.get(tile.row).has(tile.column);
        return false;
    }

    delete(tile) {
        this.#map.get(tile.row).delete(tile.column)
    }

    size() {
        let size = 0;
        for (const [, value] of this.#map)
            size += value.size;
        return size;
    }
}

module.exports = TileMap;