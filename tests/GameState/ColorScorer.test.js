const ColorScorer = require("../../src/GameState/Scorers/ColorScorer");

test("getScore() should return 5 for first-time scoring of a color", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const score = scorer.getScore("green");

    // THEN
    expect(score).toBe(5);
});

test("getScore() should return 5 again for scoring the same color in the same turn", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const firstScore = scorer.getScore("blue");
    const secondScore = scorer.getScore("blue"); // same turn

    // THEN
    expect(firstScore).toBe(5); // still first-time this turn
    expect(secondScore).toBe(5); // same turn → still first-time score
});

test("getScore() should return 3 for scoring the same color after endTurn()", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    scorer.getScore("blue");
    scorer.endTurn(); // marks first score as done
    const secondScore = scorer.getScore("blue"); // new turn

    // THEN
    expect(secondScore).toBe(3);
});

test("getScore() should return correct scores for multiple colors across turns", () => {
    // GIVEN
    const scorer = new ColorScorer();

    // WHEN
    const green1 = scorer.getScore("green");
    const red1 = scorer.getScore("red");
    scorer.endTurn(); // end turn 1

    const green2 = scorer.getScore("green");
    const red2 = scorer.getScore("red");
    const orange1 = scorer.getScore("orange");
    scorer.endTurn(); // end turn 2

    // THEN
    expect(green1).toBe(5);  // first-time green
    expect(red1).toBe(5);    // first-time red
    expect(green2).toBe(3);  // second-time green
    expect(red2).toBe(3);    // second-time red
    expect(orange1).toBe(5); // first-time orange
});