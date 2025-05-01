const ColumnOverflowError = require("../Errors/ColumnOverflowError");

class Columns {
    constructor() {
        for (let i = 0; i < 15; i++)
            this.#column.push(0)
    }

    crossColumn(column) {
        this.#column[column]++;

        if (this.#column[column] > 7)
            throw new ColumnOverflowError(column, this.#column[column]);

        return this.#column[column] === 7;
    }

    #column = [];
}

module.exports = Columns;