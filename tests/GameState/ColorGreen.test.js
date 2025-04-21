const ColorGreen = require("../../src/GameState/Color/ColorGreen");
const Tile = require("../../src/Tile");

const tiles = [
    new Tile(0, 0),
    new Tile(0, 1),
    new Tile(0, 2),
    new Tile(0, 7),

    new Tile(1, 1),
    new Tile(1, 3),
    new Tile(1, 13),
    new Tile(1, 14),

    new Tile(2, 1),
    new Tile(2, 3),
    new Tile(2, 4),
    new Tile(2, 5),
    new Tile(2, 6),
    new Tile(2, 13),
    new Tile(2, 14),

    new Tile(3, 3),
    new Tile(3, 8),
    new Tile(3, 9),

    new Tile(6, 10),
    new Tile(6, 11),
    new Tile(6, 12)
];

test("Check if crossTiles() returns true for every green tile", () => {
    //GIVEN
    const colorGreen = new ColorGreen();

    //WHEN I cross the green tiles
    let result = colorGreen.crossTiles(tiles)

    //THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() returns false when tile is not green", () => {
    //GIVEN
    const colorGreen = new ColorGreen();
    const tile = new Tile(0, 3);

    //WHEN I try to cross the tile
    let result = colorGreen.crossTiles([tile]);

    //THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() returns false when you try to cross the same green tile twice", () => {
    //GIVEN
    const colorGreen = new ColorGreen();
    const tile = new Tile(0, 3);

    //WHEN I try to cross the same green tile twice
    colorGreen.crossTiles([tile]);
    let result = colorGreen.crossTiles([tile]);

    //THEN
    expect(result).toBe(false);
});
