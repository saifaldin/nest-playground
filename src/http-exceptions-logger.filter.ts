import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from 'winston';
import { formatISO } from 'date-fns';

@Catch()
export class AllExceptionsFilterLogger implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { headers, method, originalUrl, url } = ctx.getRequest();
    delete headers.authorization;
    const { message, stack } = exception;

    this.logger.error({
      message,
      request: {
        headers,
        method,
        originalUrl,
      },
      stack,
      timestamp: formatISO(Date.now()),
    });

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: message,
      timestamp: formatISO(Date.now()),
      path: url,
    });
  }
}
