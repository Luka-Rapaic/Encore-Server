class GenerateMessage {
    static throwDice(ws) {
        let message = {type: 208}
        ws.send(JSON.stringify(message));
    }

    static newDice(ws, dice) {
        let message = {type: 209, dice: dice};
        ws.send(JSON.stringify(message));
    }

    static usedDice(ws, indices) {
        let message = {type: 210, indices: indices};
        ws.send(JSON.stringify(message));
    }

    static validTurn(ws) {
        let message = {type: 211}
        ws.send(JSON.stringify(message));
    }

    static invalidTurn(ws) {
        let message = {type: 212}
        ws.send(JSON.stringify(message));
    }

    static yourTurn(ws) {
        let message = {type: 213}
        ws.send(JSON.stringify(message));
    }
}

module.exports = GenerateMessage;