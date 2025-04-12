const Colors = require("../../src/GameState/Colors");
const ColorNotFoundError = require("../../src/Errors/ColorNotFoundError");
const AmountNotValidError = require("../../src/Errors/AmountNotValidError");
const ColorUnderflowError = require("../../src/Errors/ColorUnderflowError");

test("Check if crossTiles() returns false if only 1 tile gets crossed", () => {
    //GIVEN
    let colors = new Colors();

    //WHEN I cross a tile
    let result = colors.crossTiles(Colors.GREEN, 1);

    //THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() throws AmountNotValidError on amount <= 0 or amount > 5", () => {
    //GIVEN
    let colors = new Colors();

    //WHEN I set amount to -1
    //THEN
    expect(() => {colors.crossTiles(Colors.GREEN, -1)}).toThrow(new AmountNotValidError(-1));

    //WHEN I set amount to 6
    //THEN
    expect(() => {colors.crossTiles(Colors.GREEN, 6)}).toThrow(new AmountNotValidError(6));
});

test("Check if crossTiles() throws ColorNotFoundError on undefined color", () => {
    //GIVEN
    let colors = new Colors();

    //WHEN I set color to pink
    //THEN
    expect(() => {colors.crossTiles("pink", 1)}).toThrow(new ColorNotFoundError("pink"));
});

test("Check if crossTiles() returns true when all 21 tiles of a single color get crossed", () => {
    //GIVEN
    let colors = new Colors();

    //WHEN I cross the first 20 tiles
    for (let i = 0; i < 20; i++) {
        let result = colors.crossTiles(Colors.GREEN, 1);
        //THEN
        expect(result).toBe(false);
    }

    //WHEN I cross the 21st tile
    let result = colors.crossTiles(Colors.GREEN, 1);

    //THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() throws ColorUnderflowError when you try to cross more than 21 tile", () => {
    //GIVEN
    let colors = new Colors();

    for (let i = 0; i < 21; i++)
        colors.crossTiles(Colors.GREEN, 1);

    //WHEN I try to cross the 22nd tile
    //THEN
    expect(() => { colors.crossTiles(Colors.GREEN, 1) }).toThrow(new ColorUnderflowError(Colors.GREEN, -1));
})