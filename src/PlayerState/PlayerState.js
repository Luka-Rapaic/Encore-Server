const ColorBlue = require("./Color/ColorBlue");
const ColorGreen = require("./Color/ColorGreen");
const ColorRed = require("./Color/ColorRed");
const ColorOrange = require("./Color/ColorOrange");
const ColorYellow = require("./Color/ColorYellow");
const Stars = require("./Stars");
const Columns = require("./Columns");
const Response = require("./../Response");

class PlayerState {
    #blueTiles = new ColorBlue();
    #greenTiles = new ColorGreen();
    #redTiles = new ColorRed();
    #orangeTiles = new ColorOrange();
    #yellowTiles = new ColorYellow();
    #stars = new Stars();
    #columns = new Columns();

    #completedColorCount = 0;
    #points = -30;

    #player;
    #columnScorer;
    #colorScorer;

    constructor(player, columnScorer, colorScorer) {
        this.#player = player;
        this.#columnScorer = columnScorer;
        this.#colorScorer = colorScorer;
    }


    cross(tiles, color) {
        const points =
            this.#crossColor(tiles, color) +
            this.#crossColumns(tiles) +
            this.#stars.crossTiles(tiles);

        this.#points += points;
        Response.choose(this.#player, points);
    }

    #crossColor(tiles, color) {
        let coloredTiles;

        switch (color) {
            case "blue":
                coloredTiles = this.#blueTiles;
                break;
            case "green":
                coloredTiles = this.#greenTiles;
                break;
            case "red":
                coloredTiles = this.#redTiles;
                break;
            case "orange":
                coloredTiles = this.#orangeTiles;
                break;
            case "yellow":
                coloredTiles = this.#yellowTiles;
                break;
        }

        coloredTiles.crossTiles(tiles);

        if (coloredTiles.areAllCrossed()) {
            this.#completedColorCount++;
            return this.#colorScorer.getScore(this.#player, color);
        }

        return 0;
    }

    #crossColumns(tiles) {
        let points = 0;

        for (const tile of tiles)
            if (this.#columns.crossColumn(tile.column))
                points += this.#columnScorer.getScore(this.#player, tile.column);

        return points;
    }

    countCompletedColors() {
        return this.#completedColorCount;
    }

    getScore() {
        return this.#points;
    }
}

module.exports = PlayerState;