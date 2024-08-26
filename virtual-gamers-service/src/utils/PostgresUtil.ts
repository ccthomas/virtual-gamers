import { Client } from 'pg';
import { Logger } from 'pino';

let client: Client | undefined;

export const connectPsql = async (logger: Logger): Promise<Client> => {
  logger.debug('Connecting to PostgrsSQL.');
  if (client === undefined) {
    logger.trace('Client is not defined.');

    // TODO get from ssm or other secure storage. goal is to not store this as env vars.
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const database = process.env.DB_NAME || 'postgres';
    const user = process.env.DB_USER || 'myuser';
    const password = process.env.DB_PASSWORD || 'mypassword';

    logger.trace('Constructing client.');
    client = new Client({
      host,
      port: Number(port),
      database,
      user,
      password,
    });

    logger.trace('Connecting to client.');
    await client.connect();
  }

  logger.debug('Returning client.');
  return client;
};
