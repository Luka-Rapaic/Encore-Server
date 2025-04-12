const Columns = require("../../src/GameState/Columns");
const ColumnOverflowError = require("../../src/Errors/ColumnOverflowError");

test("Returns false when only a single tile in a column gets crossed", () => {
    //GIVEN
    let column = new Columns();

    //WHEN I cross a tile
    let result = column.crossTile(0);

    //THEN
    expect(result).toBe(false);
});

test("Returns true only when all seven tiles in a column get crossed", () => {
    //GIVEN
    let column = new Columns();

    //WHEN I cross a tile
    for (let i = 0; i < 6; i++) {
        let result = column.crossTile(0);

        //THEN
        expect(result).toBe(false);
    }

    //WHEN I cross the 7th tile
    let result = column.crossTile(0);

    //THEN
    expect(result).toBe(true);
});

test("Returns ColumnOverflowError when you try to cross more than 7 tiles in a column", () => {
    //GIVEN
    let column = new Columns();

    //WHEN I cross 8 tiles
    for (let i = 0; i < 7; i++)
        column.crossTile(0);

    expect(() => {column.crossTile(0)}).toThrow(new ColumnOverflowError(0, 8));
})