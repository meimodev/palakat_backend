import { HttpException, HttpStatus } from '@nestjs/common';

export function unauthorized(message = 'Unauthorized') {
  throw new HttpException(
    {
      errorCode: HttpStatus.UNAUTHORIZED,
      message,
    },
    HttpStatus.UNAUTHORIZED,
  );
}
