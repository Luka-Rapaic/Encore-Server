class Response {
    static invalidJsonResponse(ws) {
        const response = {
            code: ResponseCodes.INVALID_JSON
        };
        ws.send(JSON.stringify(response));
    }

    static invalidRequestResponse(ws, message) {
        const response = {
            code: ResponseCodes.INVALID_REQUEST,
            message: message
        };
        ws.send(JSON.stringify(response));
    }

    static choose(ws, pointsAwarded) {
        const response = {
            code: ResponseCodes.CHOOSE,
            pointsAwarded: pointsAwarded
        };
        ws.send(JSON.stringify(response));
    }
}

const ResponseCodes = {
    INVALID_JSON: 200,
    INVALID_REQUEST: 201,
    CHOOSE: 202,
}

module.exports = Response;