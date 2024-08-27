import { Logger } from 'pino';
import {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import { IHealthService } from '../service/HealthService';
import { apiError } from '../middleware/ApiErrorMiddleware';
import { IAuthService } from '../service/AuthService';

export class HealthController {
  logger: Logger;

  authService: IAuthService;

  healthService: IHealthService;

  constructor(
    logger: Logger,
    app: Express,
    authService: IAuthService,
    healthService: IHealthService,
  ) {
    logger.info('Constructing Helth Controller.');
    this.logger = logger;
    this.authService = authService;
    this.healthService = healthService;

    app.get('/health', this.health, apiError);
  }

  public health = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.info('Health API hit.');

    try {
      await this.authService.validateToken(req);
    } catch (e) {
      next(e);
      return;
    }

    let status = 'Healthy';
    const response = await this.healthService.getHealth()
      .catch(() => { status = 'Unhealthy'; });

    res.status(200).json({
      Service: status,
      ...response,
    });
    this.logger.info('Returning 200 status.');
  };
}
