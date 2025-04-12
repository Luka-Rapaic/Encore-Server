class ColorUnderflowError extends Error {
    constructor(color, value) {
        super(`Color ${color} underflowed! New value: ${value}`);
    }
}

module.exports = ColorUnderflowError;