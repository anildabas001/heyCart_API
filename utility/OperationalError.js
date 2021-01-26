module.exports = class OpeartionalError extends Error {
    constructor(name, statusCode, status, message) {
        super(message);
        this.name = name;
        this.status = status || 'error';
        this.statusCode = statusCode;
        this.stackTrace = Error.captureStackTrace(this, this.constructor);
        this.isOpertaional = true;
    }
}