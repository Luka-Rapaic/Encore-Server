class verifyData {
    static turnSubmission(data): [any, any, any] {
        if (!data.hasOwnProperty("selectedTiles") || !data.hasOwnProperty("selectedDice")) throw new InvalidMessageError();

        let selectedTiles = data.selectedTiles;
        if (!selectedTiles instanceof Array) throw new InvalidMessageError();

        for (let tile of selectedTiles) {
            if (!tile.hasOwnProperty("x") || !tile.hasOwnProperty("y") ||
                !tile.x instanceof Number || !tile.y instanceof Number) throw new InvalidMessageError();
        }

        let selectedDice = data.selectedDice;
        if (!selectedDice instanceof Object ||
            !selectedDice.hasOwnProperty("number") || !selectedDice.hasOwnProperty("color") ||
            !selectedDice.number instanceof Number || !selectedDice.color instanceof String) throw new InvalidMessageError();

        let number = selectedDice.number;
        let color = selectedDice.color;

        if (number < 0 || number > 2 || color < 3 || color > 5) throw new InvalidMessageError();

        return [selectedTiles, number, color];
    }
}
