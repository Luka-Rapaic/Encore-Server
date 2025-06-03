const Color = require("../../Color");
const Joker = require("../../Joker");

class ColorDye {
    #value = null;

    roll() {
        const random = Math.floor(Math.random() * 6);
        switch(random) {
            case 0: { this.#value = ColorDyeValues.GREEN; break; }
            case 1: { this.#value = ColorDyeValues.BLUE; break; }
            case 2: { this.#value = ColorDyeValues.RED; break; }
            case 3: { this.#value = ColorDyeValues.ORANGE; break; }
            case 4: { this.#value = ColorDyeValues.YELLOW; break; }
            default: {this.#value = ColorDyeValues.JOKER; break; }
        }
    }

    getValue() {
        return this.#value;
    }
}

const ColorDyeValues = {
    "GREEN": Color.GREEN,
    "BLUE": Color.BLUE,
    "RED": Color.RED,
    "ORANGE": Color.ORANGE,
    "YELLOW": Color.YELLOW,
    "JOKER": "joker"
}

module.exports = {ColorDye, ColorDyeValues}