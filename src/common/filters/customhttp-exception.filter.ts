import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus(); // Get the status code from the exception

    response.status(status).json({
      statusCode: status,
      message: exception.message, // Or customize the error message here
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
