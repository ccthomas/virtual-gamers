import bcrypt from 'bcrypt';
import { Logger } from 'pino';
import { v4 as uuid } from 'uuid';
import { IAuth, IUserAccount } from '../models/IUserAccount';
import { IUserAccountRepository } from '../repository/UserAccountRepository';

export interface IUserAccountService {
  getUserAccount(id: string): Promise<IUserAccount>;
  saveUserAuth(credentials: Omit<IAuth, 'passwordHash'> & { password: string }): Promise<void>;
  saveUserAccount(userAccount: { id?: string; iconName: string; }): Promise<IUserAccount>;
}

export class UserAccountServiceImpl implements IUserAccountService {
  logger: Logger;

  userAccountRepository: IUserAccountRepository;

  saltRounds: number;

  constructor(
    logger: Logger,
    userAccountRepository: IUserAccountRepository,
  ) {
    logger.debug('Constructing User Account Service.');
    this.logger = logger;
    this.userAccountRepository = userAccountRepository;
    this.saltRounds = process.env.SALT_ROUNDS !== undefined ? Number(process.env.SALT_ROUNDS) : 10;
  }

  private hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  };

  public getUserAccount = async (id: string): Promise<IUserAccount | null> => {
    const userAccount: IUserAccount | null = await this.userAccountRepository
      .findUserAccountById(id);

    if (userAccount === null) {
      throw new Error('Not Found');
    }

    return userAccount;
  };

  public saveUserAuth = async (credentials: Omit<IAuth, 'passwordHash'> & { password: string }): Promise<void> => {
    const passwordHash = await this.hashPassword(credentials.password);
    await this.userAccountRepository.saveAuth({
      id: credentials.id,
      username: credentials.username,
      passwordHash,
    });
  };

  public saveUserAccount = async (
    userAccount: { id?: string; iconName: string; },
  ): Promise<IUserAccount> => {
    const userId = userAccount.id || uuid();
    const persisted: IUserAccount = {
      id: userId,
      iconName: userAccount.iconName,
      preferences: {},
    };

    await this.userAccountRepository.saveUserAccount(persisted);

    return persisted;
  };
}
