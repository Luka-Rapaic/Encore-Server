const ColorNotFoundError = require("../Errors/ColorNotFoundError");
const AmountNotValidError = require("../Errors/AmountNotValidError");
const ColorUnderflowError = require("../Errors/ColorUnderflowError");

class Colors {
    #colors = {"green": 21, "yellow": 21, "blue": 21, "red": 21, "orange": 21};

    crossTiles(color, amount) {
        if (
            color !== Colors.GREEN &&
            color !== Colors.YELLOW &&
            color !== Colors.BLUE &&
            color !== Colors.RED &&
            color !== Colors.ORANGE
        )
            throw new ColorNotFoundError(color);

        if (amount < 0 || amount > 5)
            throw new AmountNotValidError(amount);

        this.#colors[color] -= amount;

        if (this.#colors[color] < 0)
            throw new ColorUnderflowError(color, this.#colors[color]);

        return this.#colors[color] === 0;
    }

    static GREEN = "green";
    static YELLOW = "yellow";
    static BLUE = "blue";
    static RED = "red";
    static ORANGE = "orange";
}

module.exports = Colors;
