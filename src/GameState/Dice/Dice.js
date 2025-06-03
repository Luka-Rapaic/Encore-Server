const NumberDye = require("./NumberDye");
const {ColorDye} = require("./ColorDye");

class Dice {
    #numberDice = [new NumberDye(), new NumberDye(), new NumberDye()]
    #colorDice = [new ColorDye(), new ColorDye(), new ColorDye()]

    roll() {
        for (const dye of this.#colorDice) dye.roll()
        for (const dye of this.#numberDice) dye.roll()
    }

    getValues() {
        const values = [];
        for (const dye of this.#colorDice) values.push(dye.getValue());
        for (const dye of this.#numberDice) values.push(dye.getValue());
        return values;
    }

    getValue(dyeIndex) {
        if (dyeIndex < 3)
            return this.#colorDice[dyeIndex];
        else
            return this.#numberDice[dyeIndex - 3];
    }

    makeDyeUnavailable(dyeIndex) {
        if (dyeIndex < 3)
            this.#colorDice[dyeIndex] = null;
        else
            this.#numberDice[dyeIndex - 3] = null;
    }
}

module.exports = Dice