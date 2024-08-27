import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import { IUserAccountRepository } from '../repository/UserAccountRepository';
import { IJwtPayload } from '../models/IJwtPayload';
import { IAuth } from '../models/IUserAccount';

export interface IAuthService {
  signIn: (credentials: { username: string; password: string }) => Promise<string | null>;
  validateToken: (req: Request) => Promise<IJwtPayload>;
}

export class AuthServiceImpl implements IAuthService {
  private JWT_EXPIRES_IN = '1h'; // 1 hour

  private jwtSecret: string;

  private logger: Logger;

  private userAccountRepository: IUserAccountRepository;

  constructor(logger: Logger, userAccountRepository: IUserAccountRepository) {
    logger.debug('Constructing User Account Service.');
    this.logger = logger;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.userAccountRepository = userAccountRepository;
  }

  public signIn = async (credentials: { username: string; password: string }): Promise<string> => {
    const { username, password } = credentials;
    const auth: IAuth | null = await this.userAccountRepository.findAuthByUsername(username);
    if (auth === null) {
      throw new Error('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(password, auth.passwordHash);
    this.logger.debug({ isMatch }, 'Passwords matching status.');

    if (isMatch === false) {
      throw new Error('Invalid Credentials');
    }

    return jwt.sign({
      id: auth.id,
      username,
    }, this.jwtSecret, { expiresIn: this.JWT_EXPIRES_IN });
  };

  public validateToken = async (req: Request): Promise<IJwtPayload> => {
    this.logger.info({ Headers: req.headers }, 'Validate token');
    const token: string | undefined = req.headers.authorization as string | undefined;
    if (token === undefined) {
      throw new Error('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as IJwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Unauthorized');
    }
  };
}
