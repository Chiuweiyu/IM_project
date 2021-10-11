let BadRequestError = function (message, error) {
    Error.call(this, message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
    this.name = 'BadRequestError';
    this.message = message;
    this.status = 400;
    if (error) this.inner = error;
}

BadRequestError.prototype = Object.create(Error.prototype);

BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;