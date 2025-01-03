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


wss.on("connection", ws => {
    console.log("New client connected!");
    ws.state = state.SETUP;
    ws.name = null;
    ws.room = null;
    ws.roomID = null;

    ws.on("message", message => {
        let data = JSON.parse(message);
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
        }
    })

    ws.on("close", () => {
        console.log("Client has disconnected!");
        queue.filter((el) => {return el !== ws})
    });

    ws.send('Welcome to the WebSocket server!');
});

function registerName(ws, data) {
    if (ws.state !== state.SETUP || !data.hasOwnProperty("name")) {
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
    sendMsgNewRoomId(ws, id);
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

    for (let client of room) sendMsgUpdateClients(client, room);
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

    for (let client of room) {
        
    }
}

function handleCommand(ws, data) {
    switch (data.command) {
        case "throwDice":
            throwDice(ws);
    }
}

function handleJoinQueueRequest(ws) {
    let opponent = queue.shift();
    if (opponent == null) queue.push(ws);
    else {
        opponent.opponent = ws;
        ws.opponent = opponent;

        opponent.isOnTurn = true;
        opponent.isOnDiceTurn = true;

        ws.isOnTurn = false;
        ws.isOnDiceTurn = false;

        initGame(opponent);
        initGame(ws);

        let message0 = {type: 0, isOnTurn: true};
        let message1 = {type: 0, isOnTurn: false};
        opponent.send(JSON.stringify(message0));
        ws.send(JSON.stringify(message1));
    }
}

function throwDice(ws) {
    let dice = [];
    for (let i = 0; i < 3; i++) {
        dice.push(dyeColors[Math.floor(Math.random()*5)]);
    }
    for (let i = 0; i < 3; i++) {
        dice.push(Math.ceil(Math.random()*5));
    }

    ws.diceValues = dice;
    ws.opponent.diceValues = dice;

    let message0 = {type: 2, diceValues: dice};
    let message1 = {type: 3, diceValues: dice};
    ws.send(JSON.stringify(message0));
    ws.opponent.send(JSON.stringify(message1));
}

function endTurn(ws, data) {
    if (ws.isOnTurn === false) {
        console.log("Connection closed: endTurn request when not on turn!");
        ws.close();
    }

    if (!data.hasOwnProperty("selectedTiles") || !data.hasOwnProperty("selectedDice")) return;

    if (data.selectedTiles.length === 0) {
        let message0 = {type: 4, isValidTurn: true};
        ws.send(JSON.stringify(message0));

        if (ws.isOnDiceTurn) {
            ws.isOnTurn = false;
            ws.opponent.isOnTurn = true;

            let message1 = {type: 5, unavailableDice: null};
            ws.opponent.send(JSON.stringify(message1));
        } else {
            ws.isOnDiceTurn = true;
            ws.opponent.isOnDiceTurn = false;

            ws.diceValues = null;
            ws.opponent.diceValues = null;

            message0 = {type: 6};
            let message1 = {type: 7};
            ws.send(JSON.stringify(message0));
            ws.opponent.send(JSON.stringify(message1));
        }
        return;
    }

    if (isValidTurn(ws, data)) {
        for (let tile of data.selectedTiles) {
            ws.crossedMatrix[tile.y][tile.x] = 1;
            updateColumn(ws, tile);

            if (starMatrix[tile.y][tile.x]) updateStars(ws);
        }
        updateColor(ws, ws.diceValues[data.selectedDice.color], ws.diceValues[data.selectedDice.number]);

        let message0 = {type: 4, isValidTurn: true};
        ws.send(JSON.stringify(message0));

        if (ws.isOnDiceTurn) {
            ws.isOnTurn = false;
            ws.opponent.isOnTurn = true;

            ws.opponent.diceValues[data.selectedDice.color] = null;
            ws.opponent.diceValues[data.selectedDice['number']] = null;

            let message1 = {type: 5, unavailableDice: data.selectedDice};
            ws.opponent.send(JSON.stringify(message1));
        } else {
            ws.isOnDiceTurn = true;
            ws.opponent.isOnDiceTurn = false;

            ws.diceValues = null;
            ws.opponent.diceValues = null;

            message0 = {type: 6};
            let message1 = {type: 7};
            ws.send(JSON.stringify(message0));
            ws.opponent.send(JSON.stringify(message1));
        }
    } else {
        let message0 = {type: 4, isValidTurn: false};
        ws.send(JSON.stringify(message0));
    }
}

function isValidTurn(ws, data) {
    if (!data.hasOwnProperty("selectedDice") || !data.hasOwnProperty("selectedTiles")) return false;

    if (ws.diceValues[data.selectedDice.number] > data.selectedTiles.length) return false;

    return isValidPlacement(ws.crossedMatrix, data.selectedTiles, ws.diceValues[data.selectedDice.color]);
}

function initGame(ws) {
    ws.crossedMatrix = [];
    for (let i = 0; i < 7; i++) {
        let row = [];
        for (let j = 0; j < 15; j++) {
            row.push(0);
        }
        ws.crossedMatrix.push(row);
    }

    ws.crossedColumns = [];
    for (let i = 0; i < 15; i++) ws.crossedColumns.push(0);

    ws.crossedColors = {"red": 0, "green": 0, "blue": 0, "orange": 0, "yellow": 0};

    ws.unusedJokers = 8;

    ws.starPoints = -30

    ws.columns = [];
    for (let i = 0; i < 15; i++) ws.columns.push(7);

    ws.colors = {"green": 21, "yellow": 21, "blue": 21, "red": 21, "orange": 21};
}

function isValidPlacement(crossedMatrix, tiles, color) {
    for (let tile of tiles) {
        if (colorMatrix[tile.y][tile.x] !== color[0]) return false;
    }

    if (!isClumped(tiles)) return false;

    for (let tile of tiles) {
        if (tile.x === 7) return true;
    }

    for (let tile of tiles) {
        if (isAdjacent(crossedMatrix, tile)) return true;
    }

    return false;
}

function isClumped(tiles) {
    let cnt = 0;
    for (let tile1 of tiles) for (let tile2 of tiles) {
        if ((tile1.x === tile2.x && tile1.y === tile2.y-1) ||
            (tile1.x === tile2.x && tile1.y === tile2.y+1) ||
            (tile1.x === tile2.x-1 && tile1.y === tile2.y) ||
            (tile1.x === tile2.x+1 && tile1.y === tile2.y)) {
            cnt++;
            break;
        }
    }

    return cnt === tiles.length || tiles.length <= 1;
}
function isAdjacent(crossedMatrix, coords) {
    if (coords.x-1 >= 0 && crossedMatrix[coords.y][coords.x-1]) return true;
    if (coords.x+1 <= 14 && crossedMatrix[coords.y][coords.x+1]) return true;
    if (coords.y-1 >= 0 && crossedMatrix[coords.y-1][coords.x]) return true;
    if (coords.y+1 <= 6 && crossedMatrix[coords.y+1][coords.x]) return true;
    return false;
}

function updateColumn(ws, tile) {
    ws.columns[tile.x]--;
    if (ws.columns[tile.x] === 0) {
        if (ws.opponent.columns[tile.x] !== 0) {
            ws.crossedColumns[tile.x] = columnPoints[0][tile.x];

            let message0 = {type: 8, column: tile.x, maxPoints: true};
            ws.send(JSON.stringify(message0));

            let message1 = {type: 9, column: tile.x};
            ws.opponent.send(JSON.stringify(message1));
        } else {
            ws.crossedColumns[tile.x] = columnPoints[1][tile.x];

            let message = {type: 8, column: tile.x, maxPoints: false};
            ws.send(JSON.stringify(message));
        }
    }
}

function updateColor(ws, color, number) {
    ws.colors[color] -= number;
    if (ws.colors[color] === 0) {
        if (ws.opponent.colors[color] !== 0) {
            ws.crossedColors[color] = colorPoints[0];

            let message0 = {type: 10, color: color, maxPoints: true};
            ws.send(JSON.stringify(message0));

            let message1 = {type: 11, color: color};
            ws.opponent.send(JSON.stringify(message1));
        } else {
            ws.crossedColors[color] = colorPoints[1];

            let message = {type: 10, color: color, maxPoints: false};
            ws.send(JSON.stringify(message));
        }

        if (checkForGameEnd(ws)) {
            ws.totalPoints = countPoints(ws);
            ws.opponent.totalPoints = countPoints(ws.opponent);

            let message0, message1;
            if (ws.totalPoints > ws.opponent.totalPoints) {
                message0 = {type: 12, won: true};
                message1 = {type: 12, won: false};
            } else if (ws.opponent.totalPoints > ws.totalPoints) {
                message0 = {type: 12, won: false};
                message1 = {type: 12, won: true};
            } else {
                message0 = {type: 13};
                message1 = {type: 13};
            }


            ws.send(JSON.stringify(message0));
            ws.opponent.send(JSON.stringify(message1));
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

    for (let client of room) if (client !== ws) clients.push(client.name);

    let message = {type: 203, clients: clients};
    ws.send(JSON.stringify(message));
}

//TYPE 204
function sendMsgNewOwner(ws) {
    let message = {type: 204};
    ws.send(JSON.stringify(message));
}

//TYPE 205
function sendMsgNewRoomId(ws, id) {
    let message = {type: 205, id: id};
    ws.send(JSON.stringify((message)));
}