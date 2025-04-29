const ColorBlue = require("./Color/ColorBlue");
const ColorGreen = require("./Color/ColorGreen");
const ColorRed = require("./Color/ColorRed");
const ColorOrange = require("./Color/ColorOrange");
const ColorYellow = require("./Color/ColorYellow");

class PlayerState {
    #blueTiles = new ColorBlue();
    #greenTiles = new ColorGreen();
    #redTiles = new ColorRed();
    #orangeTiles = new ColorOrange();
    #yellowTiles = new ColorYellow();

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
            //TODO: Finish later
        }
    }
}