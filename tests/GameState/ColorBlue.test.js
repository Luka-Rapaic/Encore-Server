const ColorBlue = require("../../src/GameState/Color/ColorBlue");
const Tile = require("../../src/Tile");

const tiles = [
    new Tile(0, 8),
    new Tile(0, 9),
    new Tile(0, 10),

    new Tile(1, 9),
    new Tile(1, 10),

    new Tile(2, 0),

    new Tile(3, 0),
    new Tile(3, 6),
    new Tile(3, 7),
    new Tile(3, 14),

    new Tile(4, 6),
    new Tile(4, 7),

    new Tile(5, 1),
    new Tile(5, 2),
    new Tile(5, 11),
    new Tile(5, 12),
    new Tile(5, 13),

    new Tile(6, 2),
    new Tile(6, 3),
    new Tile(6, 4),
    new Tile(6, 5)
];

test("Check if crossTiles() returns true for every blue tile", () => {
    // GIVEN
    const colorBlue = new ColorBlue();

    // WHEN I cross the blue tiles
    let result = colorBlue.crossTiles(tiles);

    // THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() returns false when tile is not blue", () => {
    // GIVEN
    const colorBlue = new ColorBlue();
    const tile = new Tile(0, 7); // Tile not in the blue set

    // WHEN I try to cross the tile
    let result = colorBlue.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() returns false when you try to cross the same blue tile twice", () => {
    // GIVEN
    const colorBlue = new ColorBlue();
    const tile = new Tile(0, 9); // A tile in the blue set

    // WHEN I try to cross the same blue tile twice
    colorBlue.crossTiles([tile]);
    let result = colorBlue.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});
