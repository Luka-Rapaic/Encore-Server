class Players {
    #players;

    constructor(webSockets) {
        this.#players = webSockets;
    }

    everyOtherPlayer(webSocket, predicate) {
        for (const player in this.#players) if (player !== webSocket) predicate(player);
    }

    everyPlayer(webSocket, predicate) {
        for (const player in this.#players) predicate(player);
    }
}