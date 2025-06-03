class InvalidChoiceError extends Error {
    constructor(message = "Invalid choice") {
        super(message);
        this.name = "InvalidChoice";
    }
}

module.exports = InvalidChoiceError;