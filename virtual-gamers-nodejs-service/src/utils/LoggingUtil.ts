import pino, { Logger } from 'pino';

let logger: Logger<never>;

export const getLogger = (): Logger => {
  if (logger === undefined) {
    logger = pino({
      name: process.env.SERVICE || 'virtual-gamers-service',
      level: process.env.LOG_LEVEL || 'trace',
    });
  }

  return logger;
};
