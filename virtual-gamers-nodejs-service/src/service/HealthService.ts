import { Client, QueryResult } from 'pg';
import { Logger } from 'pino';

export interface IHealthService {
  getHealth(): Promise<Record<string, string>>;
}

export class HealthServiceImpl implements IHealthService {
  logger: Logger;

  pgClient: Client;

  constructor(logger: Logger, pgClient: Client) {
    logger.info('Constructing Health Service Implemenation.');
    this.logger = logger;
    this.pgClient = pgClient;
  }

  public getHealth = async (): Promise<Record<string, string>> => {
    this.logger.debug('Get Health function hit.');

    const status: string = await this.pgClient.query('SHOW server_version;')
      .then((result: QueryResult<{ server_version: string }>) => {
        this.logger.trace({ result }, 'Query result for show server version.');
        if (result.rows.length !== 1) {
          return 'Unknown status';
        }

        return result.rows[0].server_version;
      })
      .catch((e: unknown) => {
        this.logger.error({ err: e }, 'Error occured getting version from postgres server.');
        return 'Database Error';
      });

    this.logger.debug({ status }, 'Health function returning status.');
    return { PostgresSql: status };
  };
}
