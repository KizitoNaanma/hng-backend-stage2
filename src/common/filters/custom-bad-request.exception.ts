import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(message: string, statusCode?: number) {
    super({
      status: 'Bad request',
      message: message,
      statusCode: statusCode || HttpStatus.BAD_REQUEST,
    }, statusCode || HttpStatus.BAD_REQUEST);
  }
}
