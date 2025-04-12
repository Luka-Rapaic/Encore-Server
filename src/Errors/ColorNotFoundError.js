class ColorNotFoundError extends Error {
    constructor(color) {
        super(`Color ${color} doesn't exist!`);
    }
}

module.exports = ColorNotFoundError;