// const HttpsServer = require('https').createServer;
// const fs = require("fs");
// const WebSocket = require('ws');
//
// // Create an HTTPS server
// const server = HttpsServer({
//     cert: fs.readFileSync("certificate.pem"),
//     key: fs.readFileSync("key.pem")
// });
//
// // Create a WebSocket server on top of the HTTPS server
// const wss = new WebSocket.Server({ server: server });
//
// // WebSocket connection event
//
// // Start the HTTPS server
// server.listen(443, () => console.log('Listening on port 443'));

// import * as crypto from "node:crypto";

const VerifyData = require("./verifyData");
const Response = require("./src/Response");
const {Request, RequestCodes} = require("./src/Request");
const GenerateMessage = require("./GenerateMessage");
const InvalidStateError = require("./CustomErrors")[0];
const InvalidMessageError = require("./CustomErrors")[1];
const crypto = require("crypto");
const WebSocket = require("ws");


const wss = new WebSocket.Server({port: 8080});

const colorMatrix = [
    ['g', 'g', 'g', 'y', 'y', 'y', 'y', 'g', 'b', 'b', 'b', 'o', 'y', 'y', 'y'],
    ['o', 'g', 'y', 'g', 'y', 'y', 'o', 'o', 'r', 'b', 'b', 'o', 'o', 'g', 'g'],
    ['b', 'g', 'r', 'g', 'g', 'g', 'g', 'r', 'r', 'r', 'y', 'y', 'o', 'g', 'g'],
    ['b', 'r', 'r', 'g', 'o', 'o', 'b', 'b', 'g', 'g', 'y', 'y', 'o', 'r', 'b'],
    ['r', 'o', 'o', 'o', 'o', 'r', 'b', 'b', 'o', 'o', 'o', 'r', 'r', 'r', 'r'],
    ['r', 'b', 'b', 'r', 'r', 'r', 'r', 'y', 'y', 'o', 'r', 'b', 'b', 'b', 'o'],
    ['y', 'y', 'b', 'b', 'b', 'b', 'r', 'y', 'y', 'y', 'g', 'g', 'g', 'o', 'o']
]

const starMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
];

const columnPoints = [
    [5, 3, 3, 3, 2, 2, 2, 1, 2, 2, 2, 3, 3, 3, 5],
    [3, 2, 2, 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 2, 3]
];

const colorPoints = [5, 3];

const dyeColors = ["green", "yellow", "blue", "red", "orange"];

const queue = [];

const rooms = new Map();

const state = {
    "SETUP": 0,
    "LOBBY": 1,
    "ROOM": 2,
    "GAME": 3
}

const stage = {
    "THROWING": 0,
    "PLAYER": 1,
    "OTHERS": 2
}


wss.on("connection", ws => {
    console.log("New client connected!");
    ws.state = state.SETUP;
    ws.name = null;
    ws.room = null;
    ws.roomID = null;

    ws.on("message", message => {
        try {
            const data = JSON.parse(message);

            switch (data.code) {
                case RequestCodes.ROLL_DICE:
                    Request.rollDice(ws);
                    break;
                case RequestCodes.CHOICE:
                    Request
                default:
                    Response.invalidRequestResponse(ws, "Invalid code");
                    ws.close();
            }
        } catch {
            Response.invalidJsonResponse(ws);
            ws.close();
        }
        let data = JSON.parse(message);
        if (!data.hasOwnProperty("type")) ws.close();
        console.log(data);

        switch(data.type) {
            case "command":
                handleCommand(ws, data);
                break;
            case 0:
                handleJoinQueueRequest(ws);
                break;
            case 2:
                throwDice(ws);
                break;
            case 3:
                endTurn(ws,data);
                break;
            case 100:
                registerName(ws, data);
                break;
            case 101:
                createRoom(ws);
                break;
            case 102:
                joinRoom(ws, data);
                break;
            case 103:
                leaveRoom(ws);
                break;
            case 104:
                startGame(ws);
                break;
            case 105:
                throwDice(ws);
                break;
            case 106:
                endTurn(ws, data);
        }
    })

    ws.on("close", () => {
        if (ws.state === state.ROOM) leaveRoom(ws);
        else if (ws.state === state.GAME) leaveGame(ws);

        console.log("Client has disconnected!");
        queue.filter((el) => {return el !== ws})
    });

    ws.send('Welcome to the WebSocket server!');
});

function registerName(ws, data) {
    if (ws.state !== state.SETUP && ws.state !== state.LOBBY || !data.hasOwnProperty("name")) {
        ws.close();
        return;
    }

    ws.name = data.name;
    sendMsgNameAccepted(ws);

    ws.state = state.LOBBY;
}

function createRoom(ws) {
    if (ws.state !== state.LOBBY) {
        ws.close();
        return;
    }

    let room = {"owner": ws, "clients": [ws]};
    let id;
    do {
        id = crypto.randomBytes(10).toString('hex');
    } while (id in rooms);

    rooms.set(id, room);
    ws.room = room;
    ws.roomID = id;
    ws.state = state.ROOM;
    sendMsgRoomId(ws, id);
    sendMsgNewOwner(ws);
    sendMsgUpdateClients(ws, room);
}

function joinRoom(ws, data) {
    if (ws.state !== state.LOBBY || !data.hasOwnProperty("roomID")) {
        ws.close();
        return;
    }

    let roomID = data.roomID;
    let room = rooms.get(roomID);
    if (room === undefined) {
        sendMsgInvalidRoomId(ws);
        return;
    }

    room.clients.push(ws);
    ws.room = room;
    ws.roomID = roomID;
    ws.state = state.ROOM;

    sendMsgRoomId(ws, roomID);
    for (let client of room.clients) sendMsgUpdateClients(client, room);
}

function leaveRoom(ws) {
    if (ws.state !== state.ROOM) {
        ws.close();
        return;
    }

    let room = ws.room;
    let roomID = ws.roomID;
    ws.room = null;
    ws.roomID = null;

    room.clients.splice(room.clients.indexOf(ws), 1);
    if (room.clients.length === 0) rooms.delete(roomID);
    else if (room.owner === ws) {
        room.owner = room.clients[0];
        sendMsgNewOwner(room.owner);
    }

    ws.state = state.LOBBY;
    for (let client of room.clients) sendMsgUpdateClients(client, room);
}

function startGame(ws) {
    if (ws.state !== state.ROOM) {
        ws.close();
        return;
    }

    let room = ws.room;
    if (room.owner !== ws) {
        ws.close();
        return;
    }

    initGame(room);

    for (let client of room.clients) {
        client.state = state.GAME;
        sendMsgGameStarted(client);
    }

    room.pendingResponse.add(room.clients[0]);
    sendMsgCanThrowDice(room.clients[0]);
}

function initGame(room) {

    let crossedMatrix = [];
    for (let i = 0; i < 7; i++) {
        let row = [];
        for (let j = 0; j < 15; j++) {
            row.push(0);
        }
        crossedMatrix.push(row);
    }

    let crossedColumns = [];
    for (let i = 0; i < 15; i++) crossedColumns.push(0);

    let crossedColors = {"red": 0, "green": 0, "blue": 0, "orange": 0, "yellow": 0};

    let columns = [];
    for (let i = 0; i < 15; i++) columns.push(7);

    for (let client of room.clients) {
        client.crossedMatrix = crossedMatrix;
        client.crossedColumns = crossedColumns;
        client.crossedColors = crossedColors;
        client.unusedJokers = 8;
        client.starPoints = -30;
        client.columns = columns;
        client.colors = {"green": 21, "yellow": 21, "blue": 21, "red": 21, "orange": 21};
    }

    room.crossedColumns = crossedColumns;
    room.crossedColors = crossedColors;
    room.turnIterator = 0;
    room.turnStage = stage.THROWING;
    room.dice = null;
    room.pendingResponse = new Set();
}

function handleCommand(ws, data) {
    switch (data.command) {
        case "throwDice":
            throwDice(ws);
    }
}

function leaveGame(ws) {
    let room = ws.room;

    let index = room.clients.indexOf(ws);
    room.clients.splice(index, 1);
    if (index <= room.turnIterator) room.turnIterator--;

    if (room.clients.length === 0) {
        //TODO unisti sobu
        return;
    }

    if (room.owner === ws) {
        room.owner = room.clients[0];
        //TODO posalji poruku da je novi owner
    }

    if (room.pendingResponse.has(ws)) {
        room.pendingResponse.delete(ws);
        if (room.turnStage === stage.THROWING || room.turnStage === stage.PLAYER) nextTurn(); //TODO: implement next turn;
    }
}

function throwDice(ws) {
    if (ws.state !== state.GAME) throw new InvalidStateError();

    let room = ws.room;
    if (room.turnStage !== stage.THROWING || !room.pendingResponse.has(ws)) throw new InvalidStateError();

    let dice = [];
    for (let i = 0; i < 3; i++) {
        dice.push(dyeColors[Math.floor(Math.random()*5)]);
    }

    for (let i = 0; i < 3; i++) {
        dice.push(Math.ceil(Math.random()*5));
    }

    room.dice = dice;

    for (let client of room.clients) {
        GenerateMessage.newDice(client, dice);
    }

    nextStage(room);
}

function endTurn(ws, data) {
    // GenerateMessage.invalidTurn(ws);
    // return;
    //TEMPORARY

    if (ws.state !== state.GAME) ws.close();

    let room = ws.room;
    if (room.turnStage !== stage.PLAYER && room.turnStage !== stage.OTHERS) ws.close();

    let tiles, numberIndex, colorIndex;
    [tiles, numberIndex, colorIndex] = VerifyData.turnSubmission(data);

    let dice = room.dice;
    let number = dice[numberIndex];
    let color = dice[colorIndex];
    let crossedMatrix = ws.crossedMatrix;

    if (room.turnStage === stage.PLAYER) {
        if (room.pendingResponse.has(ws)) {
            if (checkTurn(crossedMatrix, tiles, number, color)) {
                GenerateMessage.validTurn(ws);
                room.pendingResponse.delete(ws);

                saveTurn(ws, crossedMatrix, room, tiles, number, color);
                updateDice(room, numberIndex, colorIndex);
                nextStage(room);
            } else {
                GenerateMessage.invalidTurn(ws);
            }
        } else ws.close();
    }
    else if (room.turnStage === stage.OTHERS) {
        if (room.pendingResponse.has(ws)) {
            if (checkTurn(crossedMatrix, tiles, number, color)) {
                GenerateMessage.validTurn(ws);
                room.pendingResponse.delete(ws);

                saveTurn(ws, crossedMatrix, room, tiles, number, color);
                if (room.pendingResponse.length === 0) {
                    nextStage(room);
                }
            } else {
                GenerateMessage.invalidTurn(ws);
            }
        }
    }
}

function nextStage(room) {
    switch (room.turnStage) {
        case stage.THROWING:
            {
                console.log("STAGE THROWING");
                let player = room.clients[room.turnIterator];
                room.pendingResponse.add(player);
                GenerateMessage.yourTurn(player);
                room.turnStage = stage.PLAYER;
            }
            break;
        case stage.PLAYER:
            {
                console.log("STAGE PLAYER");
                for (let i = 0; i < room.clients.length; i++) if (i !== room.turnIterator) {
                    room.pendingResponse.add(room.clients[i]);
                    GenerateMessage.yourTurn(room.clients[i]);
                }
                room.turnStage = stage.OTHERS;
            }
            break;
        default:
            {
                console.log("STAGE OTHERS");
                room.turnIterator = room.turnIterator === room.clients.length-1 ? 0 : room.turnIterator + 1;
                let player = room.clients[room.turnIterator];
                room.pendingResponse.add(player);
                GenerateMessage.throwDice(player);
                room.turnStage = stage.THROWING;
            }
            break;
    }
}

function checkTurn(crossedMatrix, tiles, number, color) {
    if (number !== tiles.length) return false;
    console.log("number === tiles.length")
    for (let tile of tiles) if (colorMatrix[tile.y][tile.x] !== color[0]) return false;
    console.log("All tiles of color")
    if (!isClumped(tiles)) return false;
    console.log("All tiles are clumped!")
    for (let tile of tiles) if (tile.x === 7) return true;
    console.log("No tiles on column 7")
    for (let tile of tiles) if (isAdjacent(crossedMatrix, tile)) return true;
    console.log("No adjescent tiles")
    return false;
}

//Turns should only be saved after being checked using checkTurn!
function saveTurn(ws, crossedMatrix, room, tiles, number, color) {
    for (let tile of tiles) {
        crossedMatrix[tile.y][tile.x] = 1;
        updateColumn(ws, room, tile);
        if (starMatrix[tile.y][tile.x]) updateStars(ws);
    }

    updateColor(ws, room, color, number);
}

function isClumped(tiles) {
    let adjacent = [];
    for (let tile1 of tiles) {
        if (adjacent.length === 0) {
            adjacent.push(tile1);
        } else for (let tile2 of adjacent) {
            if ((tile1.x === tile2.x && tile1.y === tile2.y-1) ||
                (tile1.x === tile2.x && tile1.y === tile2.y+1) ||
                (tile1.x === tile2.x-1 && tile1.y === tile2.y) ||
                (tile1.x === tile2.x+1 && tile1.y === tile2.y)) {
                adjacent.push(tile1);
                break;
            }
        }
    }

    // return adjacent.length === tiles.length || tiles.length <= 1;
    return adjacent.length === tiles.length;
}

function isAdjacent(crossedMatrix, coords) {
    if (coords.x-1 >= 0 && crossedMatrix[coords.y][coords.x-1]) return true;
    if (coords.x+1 <= 14 && crossedMatrix[coords.y][coords.x+1]) return true;
    if (coords.y-1 >= 0 && crossedMatrix[coords.y-1][coords.x]) return true;
    if (coords.y+1 <= 6 && crossedMatrix[coords.y+1][coords.x]) return true;
    return false;
}

function updateColumn(ws, room, tile) {
    ws.columns[tile.x]--;
    if (ws.columns[tile.x] === 0) {
        if (!room.crossedColumns.includes(tile.x)) {
            room.crossedColumns.push(tile.x);
            ws.crossedColumns[tile.x] = columnPoints[0][tile.x];

            //TODO: Message player to cross the column;
            //TODO: Message others to circle the column;
        } else {
            ws.crossedColumns[tile.x] = columnPoints[1][tile.x];
            //TODO: Message player to cross the column;
        }
    }
}

function updateColor(ws, room, color, number) {
    ws.colors[color] -= number;
    if (ws.colors[color] === 0) {
        if (room.crossedColors[color] === 0) {
            ws.crossedColors[color] = colorPoints[0];

            //TODO: Message player to cross the color;
            //TODO: Message others to circle the color;
        } else {
            ws.crossedColors[color] = colorPoints[1];

            //TODO: Message player to cross the color;
        }

        if (checkForGameEnd(ws)) {
            declareWinner(room);
        }
    }
}

function updateStars(ws) {
    ws.starPoints += 2;
}

function checkForGameEnd(ws) {
    let cnt = 0;
    for (let dyeColor of dyeColors) {
        if (ws.crossedColors[dyeColor] !== 0) cnt++;
    }
    return cnt >= 2;
}

function declareWinner(room) {
    let clientsPoints = [];
    let maxPoints = -100; //This value should be lower than the lowest possible score!

    for (let client of room.clients) {
        let points = countPoints(client);
        clientsPoints.push([client, points]);
        if (points > maxPoints) maxPoints = points;
    }

    let winners = [];
    for (let clientPoints of clientsPoints) {
        if (clientPoints[1] === maxPoints) winners.push(clientPoints);
    }

    if (winners.length === 1) for (let client of room.clients) sendMsgWinner(client, winners[0]);
    else for (let client of room.clients) sendMsgDraw(client, winners);
}

function countPoints(ws) {
    let totalPoints = 0;
    for (let column of ws.crossedColumns) {
        totalPoints += column;
    }
    for (let color in ws.crossedColors) {
        totalPoints += ws.crossedColors[color];
    }
    totalPoints += ws.unusedJokers;
    totalPoints += ws.starPoints;

    return totalPoints;
}

function updateDice(room, numberIndex, colorIndex) {
    room.dice[numberIndex] = -1;
    room.dice[colorIndex] = 'taken';
    for (let client of room.clients) GenerateMessage.newDice(client, room.dice);
}


//TYPE 200
function sendMsgNameAccepted(ws) {
    let message = {type: 200};
    ws.send(JSON.stringify(message));
}

//TYPE 201
function sendMsgNameRefused(ws, reason) {
    let message = {type: 201, reason: reason}
    ws.send(JSON.stringify(message));
}

//TYPE 202
function sendMsgInvalidRoomId(ws) {
    let message = {type: 202};
    ws.send(JSON.stringify(message));
}

//TYPE 203
function sendMsgUpdateClients(ws, room) {
    let clients = [];

    // for (let client of room) if (client !== ws) clients.push(client.name);
    for (let client of room.clients) clients.push(client.name);

    let message = {type: 203, clients: clients};
    ws.send(JSON.stringify(message));
}

//TYPE 204
function sendMsgNewOwner(ws) {
    let message = {type: 204};
    ws.send(JSON.stringify(message));
}

//TYPE 205
function sendMsgRoomId(ws, id) {
    let message = {type: 205, id: id};
    ws.send(JSON.stringify((message)));
}

//TYPE 206
function sendMsgGameStarted(ws) {
    let message = {type: 206};
    ws.send(JSON.stringify((message)));
}

//TYPE 207
function sendMsgNewTurn(ws) {
    let message = {type: 207};
    ws.send(JSON.stringify((message)));
}

//TYPE 208
function sendMsgCanThrowDice(ws) {
    let message = {type: 208};
    ws.send(JSON.stringify((message)));
}


//TYPE 210
function sendMsgUpdateDice(ws) {

}

function sendMsgPlayTurn(ws) {

}