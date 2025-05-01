const Stars = require("../../src/PlayerState/Stars");
const Tile = require("../../src/Tile");

const starArray = [
    new Tile(0, 7),
    new Tile(0, 11),

    new Tile(1, 2),
    new Tile(1, 4),
    new Tile(1, 9),

    new Tile(2, 0),
    new Tile(2, 6),

    new Tile(3, 5),
    new Tile(3, 13),

    new Tile(5, 1),
    new Tile(5, 3),
    new Tile(5, 8),
    new Tile(5, 10),
    new Tile(5, 14),

    new Tile(6, 12)
];

test("Check if getLeftoverCount() returns 0 after all star tiles are crossed", () => {
    // GIVEN
    const stars = new Stars();

    // WHEN I cross all the star tiles
    stars.crossTiles(starArray);

    // THEN
    expect(stars.getLeftoverCount()).toBe(0);
});

test("Check if getCrossedCount() returns correct number after partial cross", () => {
    // GIVEN
    const stars = new Stars();
    const tiles = [
        new Tile(0, 7),
        new Tile(1, 2),
        new Tile(3, 13)
    ];

    // WHEN I cross a few star tiles
    stars.crossTiles(tiles);

    // THEN
    expect(stars.getLeftoverCount()).toBe(12);
});

test("Check if getCrossedCount() returns 15 when no tile is crossed", () => {
    // GIVEN
    const stars = new Stars();
    const tile = new Tile(0, 8); // Not in star set

    // WHEN I try to cross a non-star tile
    stars.crossTiles([tile]);

    // THEN
    expect(stars.getLeftoverCount()).toBe(15);
});