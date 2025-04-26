const ColumnScorer = require("../../src/GameState/ColumnScorer");

test("getScore() should return the correct first-time score for a column", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const score = scorer.getScore(0); // First time scoring column 0

    // THEN
    expect(score).toBe(5); // 5 is the first-time score for column 0
});

test("getScore() should return the reduced score when the same column is scored again", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const firstScore = scorer.getScore(1);
    const secondScore = scorer.getScore(1);

    // THEN
    expect(firstScore).toBe(3);  // First-time score
    expect(secondScore).toBe(2); // Subsequent score
});

test("getScore() should return correct scores for multiple different columns", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const scoreA = scorer.getScore(7); // First score of column 7
    const scoreB = scorer.getScore(7); // Second score of column 7
    const scoreC = scorer.getScore(14); // First score of column 14

    // THEN
    expect(scoreA).toBe(1); // First-time score for column 7
    expect(scoreB).toBe(0); // Second-time score for column 7
    expect(scoreC).toBe(5); // First-time score for column 14
});