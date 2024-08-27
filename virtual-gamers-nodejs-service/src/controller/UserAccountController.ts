import { Logger } from 'pino';
import {
  Express, Request, Response, NextFunction,
} from 'express';
import Joi from 'joi';
import { IUserAccountService } from '../service/UserAccountService';
import { IAuthService } from '../service/AuthService';
import { IJwtPayload } from '../models/IJwtPayload';
import { validationMiddleware } from '../middleware/ValidationMiddleware';
import { apiError } from '../middleware/ApiErrorMiddleware';

export interface IUserAccountController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
}

// Validation Schemas
export const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  iconName: Joi.string().optional(),
});

export const signInSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

// Controller Implementation
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

    // Apply validation middleware
    const validateSignup = validationMiddleware(signupSchema);
    const validateSignIn = validationMiddleware(signInSchema);

    this.logger.trace('Configuring user account load api.');

    app.get('/user', this.getUser, apiError);
    app.post('/user/signup', validateSignup, this.signup, apiError);
    app.post('/user/signin', validateSignIn, this.signIn, apiError);

    this.logger.trace('Configuration of user account apis complete.');
  }

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Get User API Hit.');
    try {
      const payload: IJwtPayload = await this.authService.validateToken(req);
      const userId = payload.id;
      const userAccount = await this.userAccountService.getUserAccount(userId);
      res.header('Content-Type', 'application/json');
      res.status(200).json(userAccount);
    } catch (e) {
      this.logger.error({ error: e }, 'Error getting user');
      next(e);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Sign Up API Hit.');

    const user: { username: string; password: string; iconName: string; } = req.body;

    try {
      // First, save the user account
      const userAccount = await this.userAccountService.saveUserAccount(
        { iconName: user.iconName },
      );
      this.logger.trace('User account saved.');

      // Then, save the user authentication details
      await this.userAccountService.saveUserAuth({
        id: userAccount.id,
        username: user.username,
        password: user.password,
      });

      res.status(200).json({ message: 'User created.' });
      this.logger.debug('Responding with 200 status.');
    } catch (e) {
      this.logger.error({ error: e }, 'Error occurred saving user authentication.');
      next(e);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    this.logger.info('User Account Sign In API Hit.');

    const credentials: { username: string; password: string } = req.body;
    try {
      const accessToken = await this.authService.signIn(credentials);
      res.status(200).json({
        username: credentials.username,
        accessToken,
      });
      this.logger.debug('Responding with 200 status.');
    } catch (e) {
      this.logger.error({ error: e }, 'Error occurred during sign in.');
      next(e);
    }
  };
}
