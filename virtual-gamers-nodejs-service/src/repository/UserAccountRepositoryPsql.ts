import { Client, QueryResult } from 'pg';
import { Logger } from 'pino';
import { IUserAccountRepository } from './UserAccountRepository';
import { IAuth, IUserAccount } from '../models/IUserAccount';

export class UserAccountRepositoryPsql implements IUserAccountRepository {
  logger: Logger;

  client: Client;

  constructor(logger: Logger, pgClient: Client) {
    logger.debug('Constructing User Account Respository PSQL implementation.');
    this.logger = logger;
    this.client = pgClient;
  }

  async findAuthByUsername(username: string): Promise<IAuth | null> {
    this.logger.debug({ username }, 'Find Auth.');
    const response: QueryResult<IAuth> = await this.client.query(`
      SELECT
          id,
          username,
          password_hash as "passwordHash"
      FROM user_account.auth
      WHERE
        username = $1
    `, [
      username,
    ]);
    this.logger.debug({ count: response.rowCount }, 'Queried auth completed with response row count.');
    return response.rowCount === 1 ? response.rows[0] : null;
  }

  async saveAuth(auth: IAuth): Promise<void> {
    this.logger.trace('Saving Auth.');
    await this.client.query(`
      INSERT INTO user_account.auth (
          id,
          username,
          password_hash
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (id) 
      DO UPDATE SET
          username = EXCLUDED.username,
          password_hash = EXCLUDED.password_hash;
        `, [
      auth.id,
      auth.username,
      auth.passwordHash,
    ]);
    this.logger.debug('Saving auth completed successfully.');
  }

  public findUserAccountById = async (id: string): Promise<IUserAccount | null> => {
    this.logger.trace({ id }, 'Find User Account by Id.');
    const response: QueryResult<IUserAccount> = await this.client.query(`
      SELECT
          id,
          icon_name as "iconName",
          preferences
      FROM user_account.user_account
      WHERE id = $1
    `, [
      id,
    ]);
    this.logger.debug({ count: response.rowCount }, 'Queried user account completed with response row count.');
    return response.rowCount === 1 ? response.rows[0] : null;
  };

  public saveUserAccount = async (user: IUserAccount): Promise<void> => {
    this.logger.trace('Save User Account.');
    await this.client.query(`
      INSERT INTO user_account.user_account (
          id,
          icon_name,
          preferences
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (id) 
      DO UPDATE SET
          icon_name = EXCLUDED.icon_name,
          preferences = EXCLUDED.preferences;
        `, [
      user.id,
      user.iconName,
      JSON.stringify(user.preferences),
    ]);
    this.logger.debug('Saving user account completed successfully.');
  };
}
