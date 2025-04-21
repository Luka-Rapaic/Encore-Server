const Color = require("./Color");
const ColorMap = require("./ColorMap");

class ColorGreen extends Color {
    constructor() {
        let greenMap = new ColorMap(
            new Map([
                [0, new Set([0, 1, 2, 7])],
                [1, new Set([1, 3, 13, 14])],
                [2, new Set([1, 3, 4, 5, 6, 13, 14])],
                [3, new Set([3, 8, 9])],
                [6, new Set([10, 11, 12])]
            ])
        );
        super(greenMap);
    }
}

module.exports = ColorGreen;
