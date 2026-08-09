const appErrorTemplate = (message, statusCode) => {
    return`

export class AppError extends Error {

    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = '${statusCode}'.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        AppError.captureStackTrace(this, this.constructor);
    }

}

export class BadRequestError extends AppError {
    constructor(message){
        super(message, 400); 
    }
}

export class NotFoundError extends AppError{
    constructor(message){
        super(message, 404);
    }
}

export class UserAlreadyExistsError extends AppError{
    constructor(message){
        super(message, 422);
    }
}

export class UnauthorizedError extends AppError{
    constructor(message){
        super(message, 401);
    }
}

export class ValidationError extends AppError{
    constructor(message){
        super(message, 400);
    }
}

export class ForbiddenError extends AppError{
    constructor(message){
        super(message, 403);
    }
}
`
}

export default appErrorTemplate;