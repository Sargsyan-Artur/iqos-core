import { createLogger, format, Logger, transports } from 'winston';
import { SPLAT } from 'triple-beam';

const alignColorsAndTime = format.combine(
  format.colorize({
    all: true
  }),
  format.label({
    label: '[LOGGER]'
  }),
  format.timestamp({
    format: 'YY-MM-DD HH:mm:ss'
  }),
  format.splat(),
  format.printf(
    (info) =>
      `[${info.namespace}]  ${info.timestamp}  ${info.level} : ${
        info.message
      } ${info[SPLAT] ? JSON.stringify(info[SPLAT][0], null, 2) : ''}`
  )
);

const getLogger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), alignColorsAndTime)
    })
  ]
});

export const logger = (namespace = 'LOGGER'): Logger =>
  getLogger.child({ namespace });

export const log = logger();
