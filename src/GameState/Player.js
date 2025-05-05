const PlayerState = require("../PlayerState/PlayerState");

class Player {
    #webSocket;
    #playerState;

    constructor(webSocket, columnScorer, colorScorer) {
        this.#webSocket = webSocket;
        this.#playerState = new PlayerState(columnScorer, colorScorer);
    }

    #cross(tiles, color) {
        if (!this.#playerState.cross(tiles, color)) {
            //Send message that the turn was not valid
            return false;
        }

        //Check if all tiles of that color have been crossed...

    }

    send(message) {
        this.#webSocket.send(JSON.stringify(message));
    }
}