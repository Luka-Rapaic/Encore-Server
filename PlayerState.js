import GenerateMessage from "./GenerateMessage";

class PlayerState {
    static greenTiles = new Set(['0 0', '0 1', '0 2', '0 7', '1 1', '1 3', '1 13', '1 14', '2 1',
        '2 3', '2 4', '2 5', '2 6', '2 13', '2 14', '3 3', '3 8', '3 9', '6 10', '6 11', '6 12']);
    static blueTiles = new Set(['0 8', '0 9', '0 10', '1 9', '1 10', '2 0', '3 0', '3 6', '3 7',
        '3 14', '4 6', '4 7', '5 1', '5 2', '5 11', '5 12', '5 13', '6 2', '6 3', '6 4', '6 5']);
    static redTiles = new Set(['1 8', '2 2', '2 7', '2 8', '2 9', '3 1', '3 2', '3 13', '4 0',
        '4 5', '4 11', '4 12', '4 13', '4 14', '5 0', '5 3', '5 4', '5 5', '5 6', '5 10', '6 6']);
    static orangeTiles = new Set(['0 11', '1 0', '1 6', '1 7', '1 11', '1 12', '2 12', '3 4',
        '3 5', '3 12', '4 1', '4 2', '4 3', '4 4', '4 8', '4 9', '4 10', '5 9', '5 14', '6 13', '6 14']);
    static yellowTiles = new Set(['0 3', '0 4', '0 5', '0 6', '0 12', '0 13', '0 14', '1 2',
        '1 4', '1 5', '2 10', '2 11', '3 10', '3 11', '5 7', '5 8', '6 0', '6 1', '6 7', '6 8', '6 9']);

    crossedTiles = new Set();
    columnState = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    colorState = {green: 21, red: 21, orange: 21, blue: 21, yellow: 21};
    starState = 15;

    updateState(tiles, coords, color, cnt) {
        for (let coord of coords) this.columnState[coord.x]--;
        for (let tile of tiles) this.crossedTiles.add(tile);
        this.colorState[color] -= cnt;
        //Update star state;
        //This code should also update the gamestate when columnState[x] hits zero and when colorState[c] hits zero!
    }

    checkTurn(coords, color, cnt) {
        let tiles = [];
        for (let coord of coords) tiles.push(coord.x + " " + coord.y);

        if (!this.checkIfNotCrossed(tiles) || !this.checkColor(tiles, color)) {
            return false;
        }
        //this.checkIfClumped() should be added here later;

        this.updateState(tiles, coords, color, cnt);
        return true;
    }

    checkColor(tiles, color) {
        switch(color) {
            case 'green':
                for (let tile of tiles) if (!PlayerState.greenTiles.has(tile)) return false;
                break;
            case 'blue':
                for (let tile of tiles) if (!PlayerState.blueTiles.has(tile)) return false;
                break;
            case 'red':
                for (let tile of tiles) if (!PlayerState.redTiles.has(tile)) return false;
                break;
            case 'orange':
                for (let tile of tiles) if (!PlayerState.orangeTiles.has(tile)) return false;
                break;
            case 'yellow':
                for (let tile of tiles) if (PlayerState.yellowTiles.has(tile)) return false;
                break;
        }
        return true;
    }

    checkIfNotCrossed(tiles) {
        for (let tile of tiles)
            if (this.crossedTiles.has()) return false;
        return true;
    }

    checkIfClumped(tiles) {
        let unclumped = new Set(tiles.toSpliced(0, 1));
        let clumped = new Set();
        clumped.add(tiles[0].x + " " + tiles[0].y);

        let added;
        do {
            added = 0;
            for (let tile in unclumped) {
                if (clumped.has(toString(tile.x+1) + " " + toString(tile.y)) ||
                    clumped.has(toString(tile.x-1) + " " + toString(tile.y)) ||
                    clumped.has(toString(tile.x) + " " + toString(tile.y+1)) ||
                    clumped.has(toString(tile.x) + " " + toString(tile.y-1))) {
                    unclumped.delete(tile);
                    clumped.add(tile.x + " " + tile.y);
                    added++;
                }
            }
        } while (added);
        return tiles.length = clumped.size;
    }
}