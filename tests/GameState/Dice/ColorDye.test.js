const { ColorDye, ColorDyeValues } = require("../../../src/GameState/Dice/ColorDye");

test("get() should return null before any roll", () => {
    // GIVEN
    const dye = new ColorDye();

    // WHEN
    const value = dye.getValue();

    // THEN
    expect(value).toBeNull();
});

test("roll() should set get() to a valid color or joker", () => {
    // GIVEN
    const dye = new ColorDye();

    // WHEN
    dye.roll();
    const value = dye.getValue();

    // THEN
    const validValues = [
        ColorDyeValues.GREEN,
        ColorDyeValues.BLUE,
        ColorDyeValues.RED,
        ColorDyeValues.ORANGE,
        ColorDyeValues.YELLOW,
        ColorDyeValues.JOKER
    ];
    expect(validValues).toContain(value);
});