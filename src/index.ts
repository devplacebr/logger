import {createLogger, format, transports} from 'winston';
import 'winston-daily-rotate-file';
import SlackHook from 'winston-slack-webhook-transport';

const {
  APP_NAME = 'CHANGE_ME',
  NODE_ENV = 'development',
  LOCAL_LOG_ENABLED = 0,
  LOCAL_LOG_LEVEL = 'info',
  SLACK_ENABLED = 1,
  SLACK_LEVEL = 'error',
  SLACK_URL = '',
} = process.env;
const transportsToApply = [];

/**
 * STDOUT logger type (console.log like)
 */
transportsToApply.push(
  new transports.Console({
    level: 'info',
  })
);

const timezoned = () => {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
};

/**
 * Rotate file logs (dont use inside containers). Used for stand-alone instances (EC2, VMs, etc.)
 * DOCS:  https://www.npmjs.com/package/winston-daily-rotate-file
 */
if (+LOCAL_LOG_ENABLED > 0) {
  transportsToApply.push(
    new transports.DailyRotateFile({
      filename: `logs/${APP_NAME}-%DATE%.log`,
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '10d',
      level: LOCAL_LOG_LEVEL,
    })
  );
}

/**
 * Slack config
 */
if (+SLACK_ENABLED > 0 && SLACK_URL !== '') {
  transportsToApply.push(
    new SlackHook({
      webhookUrl: SLACK_URL,
      level: SLACK_LEVEL,
      formatter: info => {
        const {message, stack = null, timestamp = timezoned()} = info;
        return {
          text: `[${APP_NAME}][${NODE_ENV}][${timestamp}]: ${stack ?? message}`,
        };
      },
    })
  );
}

export const logger = createLogger({
  format: format.combine(
    format.timestamp({format: timezoned}),
    format.errors({stack: true}),
    format.json()
  ),
  transports: transportsToApply,
});
