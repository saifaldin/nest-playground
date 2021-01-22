import * as winston from 'winston';
import * as config from 'config';

export const winstonLoggerOptions: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service-development' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxsize: config.get('logging.log_rotation_limit'),
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      maxsize: config.get('logging.log_rotation_limit'),
    }),
  ],
};
