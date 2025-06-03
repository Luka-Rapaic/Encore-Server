const NumberDye = require("../../../src/GameState/Dice/NumberDye");

test("getValue() should return null before any roll", () => {
    // GIVEN
    const dye = new NumberDye();

    // WHEN
    const value = dye.getValue();

    // THEN
    expect(value).toBeNull();
});

test("roll() should set getValue() to a number between 0 and 5", () => {
    // GIVEN
    const dye = new NumberDye();

    // WHEN
    dye.roll();
    const value = dye.getValue();

    // THEN
    expect(typeof value).toBe("number");
    expect(value).toBeGreaterThanOrEqual(-1);
    expect(value).toBeLessThanOrEqual(4);
});