class AmountNotValidError extends Error {
    constructor(amount) {
        super(`Amount ${amount} is not valid!`);
    }
}

module.exports = AmountNotValidError;