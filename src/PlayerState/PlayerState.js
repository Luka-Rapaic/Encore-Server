const ColorBlue = require("./Color/ColorBlue");
const ColorGreen = require("./Color/ColorGreen");
const ColorRed = require("./Color/ColorRed");
const ColorOrange = require("./Color/ColorOrange");
const ColorYellow = require("./Color/ColorYellow");
const Stars = require("./Stars");

class PlayerState {
    #blueTiles = new ColorBlue();
    #greenTiles = new ColorGreen();
    #redTiles = new ColorRed();
    #orangeTiles = new ColorOrange();
    #yellowTiles = new ColorYellow();
    #stars = new Stars();

    #completedColorCount = 0;

    cross(tiles, color) {
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
            this.#stars.crossTiles(tiles);
            if (coloredTiles.areAllCrossed()) this.#completedColorCount++;
            return true;
        }
        return false;
    }

    countCompletedColors() {
        return this.#completedColorCount;
    }

    countCrossedStars() {
        return this.#stars.getCrossedCount();
    }
}