import { Logger } from 'pino';
import {
  Express, Request, Response, NextFunction,
} from 'express';
import { IUserAccountService } from '../service/UserAccountService';
import { IAuthService } from '../service/AuthService';
import { createApiErrorMiddleware } from '../middleware/ApiErrorMiddleware';
import { IJwtPayload } from '../models/IJwtPayload';
import { IUserAccount } from '../models/IUserAccount';

export interface IUserAccountController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UserAccountControllerImpl implements IUserAccountController {
  logger: Logger;

  authService: IAuthService;

  userAccountService: IUserAccountService;

  constructor(
    logger: Logger,
    app: Express,
    authService: IAuthService,
    userAccountService: IUserAccountService,
  ) {
    logger.debug('Constructing User Account Controller.');
    this.logger = logger;
    this.authService = authService;
    this.userAccountService = userAccountService;

    // Create the authorizer middleware with the logger
    const apiError = createApiErrorMiddleware(this.logger);

    this.logger.trace('Configuring user account load api.');

    app.get('/user', this.getUser, apiError);
    app.post('/user/signup', this.signup, apiError);
    app.post('/user/signin', this.signIn, apiError);

    this.logger.trace('Configuriation of user account apis complete.');
  }

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Get User API Hit.');
    try {
      const payload: IJwtPayload = await this.authService.validateToken(req);
      const userId = payload.id;
      await this.userAccountService.getUserAccount(userId)
        .then((userAccount: IUserAccount) => {
          res.header('Content-Type', 'application/json');
          res.status(200).json(userAccount);
        });
    } catch (e) { next(e); }
  };

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Sign Up API Hit.');

    const user: { username: string; password: string; iconName: string; } = req.body;

    let userAccount: IUserAccount;
    try {
      userAccount = await this.userAccountService.saveUserAccount({ iconName: user.iconName });
    } catch (e) {
      next(e);
      return;
    }

    await this.userAccountService.saveUserAuth({
      id: userAccount.id,
      username: user.username,
      password: user.password,
    }).then(() => {
      res.status(200).json({ message: 'User created.' });
      this.logger.debug('Responding with 200 status.');
    }).catch((e) => next(e));
  };

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Sign In API Hit.');

    const credentials: { username: string; password: string } = req.body;
    await this.authService.signIn(credentials).then((accessToken: string) => {
      res.status(200).json({
        username: credentials.username,
        accessToken,
      });
      this.logger.debug('Responding with 200 status.');
    }).catch((e) => next(e));
  };
}
