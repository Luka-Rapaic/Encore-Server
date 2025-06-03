class Message {
    static rollDice(ws) {
        const message = {
            code: MessageCodes.ROLL_DICE
        };
        ws.send(JSON.stringify(message));
    }

    static rolledDice(ws, diceValues) {
        const message = {
            code: MessageCodes.ROLLED_DICE,
            diceValues: diceValues
        };
        ws.send(JSON.stringify(message));
    }

    static choose(ws) {
        const message = {
            code: MessageCodes.CHOOSE
        };
        ws.send(JSON.stringify(message));
    }

    static unavailableDice(ws, colorDyeIndex, numberDyeIndex) {
        const message = {
            code: MessageCodes.UNAVAILABLE_DICE,
            colorDyeIndex: colorDyeIndex,
            numberDyeIndex: numberDyeIndex
        };
        ws.send(JSON.stringify(message));
    }

    static circleColor(ws, color) {
        const message = {
            code: MessageCodes.CIRCLE_COLOR,
            color: color
        };
        ws.send(JSON.stringify(message));
    }

    static crossColor(ws, color, firstScore) {
        const message = {
            code: MessageCodes.CROSS_COLOR,
            color: color,
            firstScore: firstScore
        };
        ws.send(JSON.stringify(message));
    }

    static circleColumn(ws, column) {
        const message = {
            code: MessageCodes.CIRCLE_COLUMN,
            column: column
        };
        ws.send(JSON.stringify(message));
    }

    static crossColumn(ws, column, firstScore) {
        const message = {
            code: MessageCodes.CROSS_COLUMN,
            column: column,
            firstScore: firstScore
        };
        ws.send(JSON.stringify(message));
    }

    static declareWinner(ws) {
        const message = {
            code: MessageCodes.DECLARE_WINNER
        };
        ws.send(JSON.stringify(message));
    }

    static declareDraw(ws) {
        const message = {
            code: MessageCodes.DECLARE_DRAW
        };
        ws.send(JSON.stringify(message));
    }

    static declareLoser(ws) {
        const message = {
            code: MessageCodes.DECLARE_LOSER
        };
        ws.send(JSON.stringify(message));
    }
}

const MessageCodes = {
    ROLL_DICE: 100,
    ROLLED_DICE: 101,
    CHOOSE: 102,
    UNAVAILABLE_DICE: 103,
    CIRCLE_COLOR: 104,
    CROSS_COLOR: 105,
    CIRCLE_COLUMN: 106,
    CROSS_COLUMN: 107,
    DECLARE_WINNER: 108,
    DECLARE_DRAW: 109,
    DECLARE_LOSER: 110
}

module.exports = Message;