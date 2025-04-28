const ColorScorer = require("../../src/GameState/ColorScorer");

test("getScore() should return 5 for first-time scoring of a color", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const score = scorer.getScore("green");

    // THEN
    expect(score).toBe(5);
});

test("getScore() should return 3 for scoring the same color again", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const firstScore = scorer.getScore("blue");
    const secondScore = scorer.getScore("blue");

    // THEN
    expect(firstScore).toBe(5);
    expect(secondScore).toBe(3);
});

test("getScore() should return correct scores for multiple colors", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const green1 = scorer.getScore("green");
    const green2 = scorer.getScore("green");
    const red1 = scorer.getScore("red");

    // THEN
    expect(green1).toBe(5);
    expect(green2).toBe(3);
    expect(red1).toBe(5);
});