class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // pass message to the Error constructor
        this.statusCode = statusCode;
        this.message=message;
    }
}

module.exports = ExpressError;
