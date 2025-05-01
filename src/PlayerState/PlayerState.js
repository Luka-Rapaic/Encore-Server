const ColorBlue = require("./Color/ColorBlue");
const ColorGreen = require("./Color/ColorGreen");
const ColorRed = require("./Color/ColorRed");
const ColorOrange = require("./Color/ColorOrange");
const ColorYellow = require("./Color/ColorYellow");
const Stars = require("./Stars");
const Columns = require("./Columns");

class PlayerState {
    #blueTiles = new ColorBlue();
    #greenTiles = new ColorGreen();
    #redTiles = new ColorRed();
    #orangeTiles = new ColorOrange();
    #yellowTiles = new ColorYellow();
    #stars = new Stars();
    #columns = new Columns();

    #completedColorCount = 0;
    #points = 0;

    #columnScorer;
    #colorScorer;

    constructor(columnScorer, colorScorer) {
        this.#columnScorer = columnScorer;
        this.#colorScorer = colorScorer;
    }


    cross(tiles, color) {
        if (!this.#crossColor(tiles, color)) return false;

        this.#crossColumns(tiles);
        this.#stars.crossTiles(tiles);

        return true;
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

        if (coloredTiles.crossTiles(tiles)) {
            if (coloredTiles.areAllCrossed()) {
                this.#completedColorCount++;
                this.#points += this.#colorScorer.getScore(color);
            }
            return true;
        }
        return false;
    }

    #crossColumns(tiles) {
        for (const tile of tiles)
            if (this.#columns.crossColumn(tile.column))
                this.#points += this.#columnScorer.getScore(tile.column);
    }

    countCompletedColors() {
        return this.#completedColorCount;
    }

    getScore() {
        return this.#points - this.#stars.getLeftoverCount() * 2;
    }
}