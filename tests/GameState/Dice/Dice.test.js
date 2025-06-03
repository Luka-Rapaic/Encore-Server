const Dice = require("../../../src/GameState/Dice/Dice");
const { ColorDyeValues } = require("../../../src/GameState/Dice/ColorDye");


test("getValues() should return 6 values before roll() — all should be null", () => {
    // GIVEN
    const dice = new Dice();

    // WHEN
    const values = dice.getValues();

    // THEN
    expect(values.length).toBe(6);
    for (const val of values) {
        expect(val).toBeNull();
    }
});

test("getValues() should return 6 non-null values after roll()", () => {
    // GIVEN
    const dice = new Dice();

    // WHEN
    dice.roll();
    const values = dice.getValues();

    // THEN
    expect(values.length).toBe(6);
    for (const val of values) {
        expect(val).not.toBeNull();
    }
});

test("first 3 values should be numbers (between 0 and 5), last 3 should be valid DyeColorValues", () => {
    // GIVEN
    const dice = new Dice();

    // WHEN
    dice.roll();
    const values = dice.getValues();

    const numberValues = values.slice(0, 3);
    const colorValues = values.slice(3, 6);

    // THEN: check number dice
    for (const num of numberValues) {
        expect(typeof num).toBe("number");
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(5);
    }

    // THEN: check color dice
    const validColors = Object.values(ColorDyeValues);
    for (const color of colorValues) {
        expect(validColors).toContain(color);
    }
});