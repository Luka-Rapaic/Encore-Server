const Response = require("./Response");

class Request {
    static rollDice(ws) {
        if (ws.gameState === undefined) {
            Response.invalidRequestResponse("Invalid state");
            ws.close();
            return;
        }
        const gameState = ws.gameState;
        gameState.rollDice(ws);
    }

    static choice(ws, data) {
        if (ws.gameState === undefined) {
            Response.invalidRequestResponse("Invalid state");
            ws.close();
            return;
        }
        const gameState = ws.gameState;

        if (typeof data.coloredDyeIndex !== 'number' ||
            data.coloredDyeIndex < 0 ||
            data.coloredDyeIndex > 2
        ) {
            Response.invalidRequestResponse(ws, "Invalid coloredDyeIndex");
            ws.close();
            return;
        }
        const coloredDyeIndex = data.coloredDyeIndex;

        if (typeof data.numberedDyeIndex !== 'number' ||
            data.numberedDyeIndex < 3 ||
            data.numberedDyeIndex > 5
        ) {
            Response.invalidRequestResponse(ws, "Invalid numberedDyeIndex");
            ws.close();
            return;
        }
        const numberedDyeIndex = data.numberedDyeIndex;

        if (!('tiles' in data && this.#isValidTiles(data.tiles))) {
            Response.invalidRequestResponse(ws, "Invalid tiles");
            ws.close();
            return;
        }
        const tiles = data.tiles;

        gameState.choice(ws, coloredDyeIndex, numberedDyeIndex, tiles);
    }

    static activeTurnEndRequest(ws, data) {
        if (ws.gameState === null) {
            ws.send(JSON.stringify({code: 200, message: "Invalid state"}));
            ws.close();
        }


        if (!('tiles' in data && this.#isValidTiles(data.tiles))) {
            ws.send(JSON.stringify({code: 200, message: "Invalid tiles"}));
            ws.close();
        }
        const gameState = ws.gameState;
        const colorIndex = data.dyeColorIndex;
        const numberIndex = data.dyeNumberIndex;
        const tiles = data.tiles;

        gameState.activeTurnEnd(ws, colorIndex, numberIndex, tiles);
    }

    static #isValidTiles(tiles) {
        if (!Array.isArray(tiles)) return false;

        return tiles.every(tile =>
            Array.isArray(tile) &&
            tile.length === 2 &&
            typeof tile[0] === 'number' &&
            typeof tile[1] === 'number'
        );
    }
}

const RequestCodes = {
    ROLL_DICE: 100,
    CHOICE: 101
}

module.exports = {Request, RequestCodes};