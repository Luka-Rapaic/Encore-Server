const Color = require("./Color");
const TileMap = require("../TileMap");

class ColorYellow extends Color {
    constructor() {
        let yellowMap = new TileMap(
            new Map([
                [0, new Set([3, 4, 5, 6, 12, 13, 14])],
                [1, new Set([2, 4, 5])],
                [2, new Set([10, 11])],
                [3, new Set([10, 11])],
                [5, new Set([7, 8])],
                [6, new Set([0, 1, 7, 8, 9])]
            ])
        );
        super(yellowMap);
    }
}

module.exports = ColorYellow;
