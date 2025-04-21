const ColorYellow = require("../../src/GameState/Color/ColorYellow");
const Tile = require("../../src/Tile");

const tiles = [
    new Tile(0, 3),
    new Tile(0, 4),
    new Tile(0, 5),
    new Tile(0, 6),
    new Tile(0, 12),
    new Tile(0, 13),
    new Tile(0, 14),

    new Tile(1, 2),
    new Tile(1, 4),
    new Tile(1, 5),

    new Tile(2, 10),
    new Tile(2, 11),

    new Tile(3, 10),
    new Tile(3, 11),

    new Tile(5, 7),
    new Tile(5, 8),

    new Tile(6, 0),
    new Tile(6, 1),
    new Tile(6, 7),
    new Tile(6, 8),
    new Tile(6, 9)
];

test("Check if crossTiles() returns true for every yellow tile", () => {
    // GIVEN
    const colorYellow = new ColorYellow();

    // WHEN I cross the yellow tiles
    let result = colorYellow.crossTiles(tiles);

    // THEN
    expect(result).toBe(true);
});

test("Check if crossTiles() returns false when tile is not yellow", () => {
    // GIVEN
    const colorYellow = new ColorYellow();
    const tile = new Tile(0, 0); // Tile not in the yellow set

    // WHEN I try to cross the tile
    let result = colorYellow.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});

test("Check if crossTiles() returns false when you try to cross the same yellow tile twice", () => {
    // GIVEN
    const colorYellow = new ColorYellow();
    const tile = new Tile(0, 4); // A tile in the yellow set

    // WHEN I try to cross the same yellow tile twice
    colorYellow.crossTiles([tile]);
    let result = colorYellow.crossTiles([tile]);

    // THEN
    expect(result).toBe(false);
});
