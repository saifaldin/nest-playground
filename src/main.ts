import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { firebaseInitializeApp } from './firebase-admin.config';
import * as config from 'config';
import * as winston from 'winston';
import { AllExceptionsFilterLogger } from './http-exceptions-logger.filter';
import { winstonLoggerOptions } from './winston.options';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serviceAccount = resolve('config', 'service-account.json');
  firebaseInitializeApp(serviceAccount);

  const logger = winston.createLogger(winstonLoggerOptions);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilterLogger(logger));

  await app.listen(config.get('port'));
}
bootstrap();
