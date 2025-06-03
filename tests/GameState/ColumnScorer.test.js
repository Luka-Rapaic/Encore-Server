const ColumnScorer = require("../../src/GameState/Scorers/ColumnScorer");

test("getScore() should return the correct first-time score for a column", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const score = scorer.getScore(0); // First time scoring column 0

    // THEN
    expect(score).toBe(5); // First-time score for column 0
});

test("getScore() should return the first-time score on repeated calls in the same turn", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const firstCall = scorer.getScore(1);
    const secondCall = scorer.getScore(1); // Same turn
    // No endTurn() yet

    // THEN
    expect(firstCall).toBe(3);   // First-time score
    expect(secondCall).toBe(3);  // Still first-time score (same turn)
});

test("getScore() should return the reduced score only after endTurn()", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    scorer.getScore(2);    // First-time score
    scorer.endTurn();      // End turn
    const secondTurnScore = scorer.getScore(2); // New turn

    // THEN
    expect(secondTurnScore).toBe(2); // Reduced score after first turn
});

test("getScore() should handle multiple columns correctly across turns", () => {
    // GIVEN
    const scorer = new ColumnScorer();

    // WHEN
    const score7a = scorer.getScore(7); // First-time column 7
    const score14a = scorer.getScore(14); // First-time column 14
    scorer.endTurn();
    const score7b = scorer.getScore(7); // Subsequent score
    const score14b = scorer.getScore(14); // Subsequent score
    scorer.endTurn();

    // THEN
    expect(score7a).toBe(1); // First-time score
    expect(score14a).toBe(5); // First-time score
    expect(score7b).toBe(0); // Reduced score
    expect(score14b).toBe(3); // Reduced score
});