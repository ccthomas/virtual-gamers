/* eslint-disable no-new */
import express, { Express } from 'express';
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
import cors from 'cors';
import pino, { Logger } from 'pino';
import { connectPsql } from './utils/PostgresUtil';
import { HealthServiceImpl } from './service/HealthService';
import { HealthController } from './controller/HealthController';

// eslint-disable-next-line no-console
console.log('Starting Dungeon Duel Backend...');
// configure logger for app.
const logger: Logger<never> = pino({
  name: process.env.SERVICE || 'dungeon-duel-service',
  level: process.env.LOG_LEVEL || 'trace',
});

logger.info({ environment: process.env.NODE_ENV }, 'Constructing express app');
const app = express();
const port = process.env.PORT || 3000;

logger.debug('Configure middleware.');
app.use(cors({
  origin: [`http://localhost:${process.env.REACT_APP_PORT}`], // Allow requests from this origin
}));
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-shadow
const configure = async (logger: Logger, app: Express) => {
  logger.info('Configuring service...');

  // database

  logger.debug('Attmepting to create PSQL connection.');
  const pgClient = await connectPsql(logger);

  // services

  const healthService = new HealthServiceImpl(logger, pgClient);

  // controllers

  new HealthController(logger, app, healthService);

  app.listen(port, () => {
    logger.info({ host: 'http://localhost', port }, 'Server is running...');
  });

  logger.debug('Configuring service completed.');
};

configure(logger, app);
