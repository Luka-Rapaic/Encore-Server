const ColorScorer = require("./Scorers/ColorScorer")
const ColumnScorer = require("./Scorers/ColumnScorer")
const Dice = require("./Dice/Dice")
const PlayerState = require("../PlayerState/PlayerState")
const Response = require("../Response")
const Message = require("../Message")
const InvalidChoiceError = require("../PlayerState/Color/InvalidChoiceError");

class GameState {
    #colorScorer;
    #columnScorer;
    #dice = new Dice();
    #players;
    #playerStates = new Map();
    #awaitingResponse = new Set();
    #turnStep = TurnStep.ROLL_DICE;
    #isWinConditionAchieved = false;

    constructor(webSockets) {
        this.#players = webSockets;

        this.#colorScorer = new ColorScorer(webSockets);
        this.#columnScorer = new ColumnScorer(webSockets);

        for (const player of webSockets) {
            this.#playerStates[player] = new PlayerState(player, this.#columnScorer, this.#colorScorer);
        }

        this.#awaitingResponse.add(webSockets[0]);
        Message.rollDice(webSockets[0]);
    }

    rollDice(webSocket) {
        if (this.#turnStep !== TurnStep.ROLL_DICE) webSocket.close();
        if (!webSocket in this.#awaitingResponse) webSocket.close();

        const index = this.#awaitingResponse.indexOf(webSocket);
        delete this.#awaitingResponse[index];

        this.#dice.roll();
        const diceValues = this.#dice.getValues();

        for (const player in this.#players) Message.rolledDice(player, diceValues);

        this.#turnStep = TurnStep.ACTIVE_CHOOSE;
        this.#awaitingResponse.push(webSocket);
        Message.choose(webSocket);
    }

    choice(webSocket, coloredDyeIndex, numberedDyeIndex, tiles) {
        if (!webSocket in this.#awaitingResponse ||
            this.#turnStep !== TurnStep.ACTIVE_CHOOSE &&
            this.#turnStep !== TurnStep.OTHERS_CHOOSE
        ) {
            Response.invalidRequestResponse(webSocket, "Invalid state");
            webSocket.close();
            return;
        }

        this.#awaitingResponse.delete(webSocket);

        const color = this.#dice.getValue(coloredDyeIndex);
        const number = this.#dice.getValue(numberedDyeIndex);

        if (tiles.size !== number) {
            Response.invalidRequestResponse(webSocket, "Invalid move");
            webSocket.close();
            return;
        }

        try {
            if (this.#turnStep === TurnStep.ACTIVE_CHOOSE)
                this.#activeChoice(webSocket, coloredDyeIndex, numberedDyeIndex, color, tiles);
            else if (this.#turnStep === TurnStep.OTHERS_CHOOSE)
                this.#othersChoice(webSocket, coloredDyeIndex, numberedDyeIndex, tiles);
        } catch {
            Response.invalidRequestResponse(webSocket, "Invalid move");
            webSocket.close();
        }
    }

    #activeChoice(webSocket, coloredDyeIndex, numberedDyeIndex, color, tiles) {
        const playerState = this.#playerStates[webSocket];

        playerState.cross(tiles, color);

        if (playerState.countCompletedColors() === 2)
            this.#isWinConditionAchieved = true;

        this.#dice.makeDyeUnavailable(coloredDyeIndex);
        this.#dice.makeDyeUnavailable(numberedDyeIndex);

        for (const player of this.#players) {
            Message.unavailableDice(player, coloredDyeIndex, numberedDyeIndex);
        }

        this.#colorScorer.endTurn();
        this.#columnScorer.endTurn();

        this.#turnStep = TurnStep.OTHERS_CHOOSE;
        for (const player of this.#players) {
            this.#awaitingResponse.add(player);
            Message.choose(player);
        }
    }

    #othersChoice(webSocket, color, tiles) {
        const playerState = this.#playerStates[webSocket];

        playerState.cross(tiles, color);

        if (playerState.countCompletedColors() === 2)
            this.#isWinConditionAchieved = true;

        if (this.#awaitingResponse.size === 0) {
            this.#colorScorer.endTurn();
            this.#columnScorer.endTurn();

            if (this.#isWinConditionAchieved === true) {
                this.#endGame();
                return;
            }

            this.#turnStep = TurnStep.ROLL_DICE;
            //Implement the algorhitm for choosing the next player;
        }
    }

    #endGame() {
        let count = 0;
        let highScore = -30;

        for (const [player, playerState] of this.#playerStates) {
            const score = playerState.getScore();

            if (score > highScore) {
                highScore = score;
                count = 1;
            } else if (score === highScore)
                count++;
        }

        for (const [player, playerState] of this.#playerStates) {
            if (playerState.getScore() === highScore)
                if (count === 1)
                    Message.declareWinner(player);
                else
                    Message.declareDraw(player);
            else
                Message.declareLoser(player);

            delete player.gameState;
        }
    }
}

const TurnStep = {
    ROLL_DICE: "rollDice",
    ACTIVE_CHOOSE: "activeChoose",
    OTHERS_CHOOSE: "othersChoose",
    NEXT_TURN: "nextTurn",
}