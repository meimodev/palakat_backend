import { HttpException, HttpStatus } from '@nestjs/common';

// 400 Bad Request
export function badRequest(message = 'Bad Request') {
    throw new HttpException(
        {
            errorCode: HttpStatus.BAD_REQUEST,
            message,
        },
        HttpStatus.BAD_REQUEST,
    );
}

// 401 Unauthorized
export function unauthorized(message = 'Unauthorized') {
    throw new HttpException(
        {
            errorCode: HttpStatus.UNAUTHORIZED,
            message,
        },
        HttpStatus.UNAUTHORIZED,
    );
}

// 403 Forbidden
export function forbidden(message = 'Forbidden') {
    throw new HttpException(
        {
            errorCode: HttpStatus.FORBIDDEN,
            message,
        },
        HttpStatus.FORBIDDEN,
    );
}

// 404 Not Found
export function notFound(message = 'Not Found') {
    throw new HttpException(
        {
            errorCode: HttpStatus.NOT_FOUND,
            message,
        },
        HttpStatus.NOT_FOUND,
    );
}

// 500 internal Server Error
export function internalServerError(message = 'Internal Server Error') {
    throw new HttpException(
        {
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}

