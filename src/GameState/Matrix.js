class Matrix {
    #matrix = [];

    constructor() {
        for (let i = 0; i < 7; i++) {
            let row = [];
            for (let j = 0; j < 15; j++) {
                row.push(0);
            }
            this.#matrix.push(row);
        }
    }

    crossTile(column, row) {

    }
}