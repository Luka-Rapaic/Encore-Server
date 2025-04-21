const Color = require("./Color");
const ColorMap = require("./ColorMap");

class ColorRed extends Color {
    constructor() {
        let redMap = new ColorMap(
            new Map([
                [1, new Set([8])],
                [2, new Set([2, 7, 8, 9])],
                [3, new Set([1, 2, 13])],
                [4, new Set([0, 5, 11, 12, 13, 14])],
                [5, new Set([0, 3, 4, 5, 6, 10])],
                [6, new Set([6])]
            ])
        );
        super(redMap);
    }
}

module.exports = ColorRed;
