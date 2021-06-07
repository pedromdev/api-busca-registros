import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Error } from 'mongoose';
import { Response } from 'express';
import ValidationError = Error.ValidationError;

@Catch(ValidationError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(400)
      .send({
        statusCode: 400,
        message: Object.values(exception.errors).map((item) => item.message),
        error: 'Bad Request',
      });
  }
}
