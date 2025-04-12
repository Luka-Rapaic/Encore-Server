class ColumnOverflowError extends Error {
    constructor(column, value) {
        super(`Column ${column} overflowed! New value: ${value}`);
    }
}

module.exports = ColumnOverflowError;