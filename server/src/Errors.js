class NotFoundError extends Error { // HTTP status code 404
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class BadRequestError extends Error { // HTTP status code 400
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
    }
}

class UnauthorizedError extends Error { // HTTP status code 401
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

class ForbiddenError extends Error { // HTTP status code 403
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
    }
}

class ConflictError extends Error { // HTTP status code 409
    constructor(message) {
        super(message);
        this.name = "ConflictError";
    }
}

const getHttpStatusCode = (error) => {
    if (error instanceof NotFoundError) {
        return 404;
    } else if (error instanceof BadRequestError) {
        return 400;
    } else if (error instanceof UnauthorizedError) {
        return 401;
    } else if (error instanceof ForbiddenError) {
        return 403;
    } else if (error instanceof ConflictError) {
        return 409;
    } else {
        return 500;
    }
};

export {getHttpStatusCode, ConflictError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError};