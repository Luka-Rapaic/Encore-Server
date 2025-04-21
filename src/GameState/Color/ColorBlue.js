const Color = require("./Color");
const TileMap = require("../TileMap");

class ColorBlue extends Color {
    constructor() {
        let blueMap = new TileMap(
            new Map([
                [0, new Set([8, 9, 10])],
                [1, new Set([9, 10])],
                [2, new Set([0])],
                [3, new Set([0, 6, 7, 14])],
                [4, new Set([6, 7])],
                [5, new Set([1, 2, 11, 12, 13])],
                [6, new Set([2, 3, 4, 5])]
            ])
        );
        super(blueMap);
    }
}

module.exports = ColorBlue;
