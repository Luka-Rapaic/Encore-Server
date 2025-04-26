const Color = require("./Color");
const TileMap = require("../TileMap");

class ColorOrange extends Color {
    constructor() {
        let orangeMap = new TileMap(
            new Map([
                [0, new Set([11])],
                [1, new Set([0, 6, 7, 11, 12])],
                [2, new Set([12])],
                [3, new Set([4, 5, 12])],
                [4, new Set([1, 2, 3, 4, 8, 9, 10])],
                [5, new Set([9, 14])],
                [6, new Set([13, 14])]
            ])
        );
        super(orangeMap);
    }
}

module.exports = ColorOrange;
