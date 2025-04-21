const ColorOrange = require("../../src/GameState/Color/ColorOrange");
const Tile = require("../../src/Tile");

const tiles = [
    new Tile(0, 11),

    new Tile(1, 0),
    new Tile(1, 6),
    new Tile(1, 7),
    new Tile(1, 11),
    new Tile(1, 12),

    new Tile(2, 12),

    new Tile(3, 4),
    new Tile(3, 5),
    new Tile(3, 12),

    new Tile(4, 1),
    new Tile(4, 2),
    new Tile(4, 3),
    new Tile(4, 4),
    new Tile(4, 8),
    new Tile(4, 9),
    new Tile(4, 10),

    new Tile(5, 9),
    new Tile(5, 14),

    new Tile(6, 13),
    new Tile(6, 14)
];

test("Check if crossTiles() returns true for every orange tile", () => {
    // GIVEN
    const colorOrange = new ColorOrange();

    // WHEN I cross the orange tiles
    let result = colorOrange.crossTiles(tiles);

    // THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() returns false when tile is not orange", () => {
    // GIVEN
    const colorOrange = new ColorOrange();
    const tile = new Tile(0, 0); // Tile not in the orange set

    // WHEN I try to cross the tile
    let result = colorOrange.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() returns false when you try to cross the same orange tile twice", () => {
    // GIVEN
    const colorOrange = new ColorOrange();
    const tile = new Tile(1, 7); // A tile in the orange set

    // WHEN I try to cross the same orange tile twice
    colorOrange.crossTiles([tile]);
    let result = colorOrange.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});
