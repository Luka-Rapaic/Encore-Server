class InvalidStateError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidStateError";
    }
}

class InvalidMessageError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidMessageError";
    }
}
