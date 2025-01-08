class GenerateMessage {
    static newDice(ws, dice) {
        let message = {type: 209, dice: dice};
        ws.send(JSON.stringify((message)));
    }

    static yourTurn(ws) {

    }
}

module.exports = GenerateMessage;