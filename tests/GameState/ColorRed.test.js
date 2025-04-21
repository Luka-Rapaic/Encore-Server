const ColorRed = require("../../src/GameState/Color/ColorRed");
const Tile = require("../../src/Tile");

const tiles = [
    new Tile(1, 8),

    new Tile(2, 2),
    new Tile(2, 7),
    new Tile(2, 8),
    new Tile(2, 9),

    new Tile(3, 1),
    new Tile(3, 2),
    new Tile(3, 13),

    new Tile(4, 0),
    new Tile(4, 5),
    new Tile(4, 11),
    new Tile(4, 12),
    new Tile(4, 13),
    new Tile(4, 14),

    new Tile(5, 0),
    new Tile(5, 3),
    new Tile(5, 4),
    new Tile(5, 5),
    new Tile(5, 6),
    new Tile(5, 10),

    new Tile(6, 6)
];

test("Check if crossTiles() returns true for every red tile", () => {
    // GIVEN
    const colorRed = new ColorRed();

    // WHEN I cross the red tiles
    let result = colorRed.crossTiles(tiles);

    // THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() returns false when tile is not red", () => {
    // GIVEN
    const colorRed = new ColorRed();
    const tile = new Tile(0, 0); // Tile not in the red set

    // WHEN I try to cross the tile
    let result = colorRed.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() returns false when you try to cross the same red tile twice", () => {
    // GIVEN
    const colorRed = new ColorRed();
    const tile = new Tile(2, 7); // A tile in the red set

    // WHEN I try to cross the same red tile twice
    colorRed.crossTiles([tile]);
    let result = colorRed.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});
