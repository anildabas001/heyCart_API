class OpeartionalError extends Error {
    constructor(name, statusCode, status, message) {
        this.name = name;
        this.status = status || 'error';
        this.statusode = statusCode;
        super(message);
        Error.captureStackTrace(this, this.constructor)
    }
}