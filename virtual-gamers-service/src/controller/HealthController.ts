import { Logger } from 'pino';
import {
  Express,
  Request,
  Response,
} from 'express';
import { IHealthService } from '../service/HealthService';
import { createApiErrorMiddleware } from '../middleware/ApiErrorMiddleware';

export class HealthController {
  logger: Logger;

  healthService: IHealthService;

  constructor(logger: Logger, app: Express, healthService: IHealthService) {
    logger.info('Constructing Helth Controller.');
    this.logger = logger;
    this.healthService = healthService;

    const apiError = createApiErrorMiddleware(this.logger);

    app.get('/health', this.health, apiError);
  }

  public health = async (req: Request, res: Response) => {
    this.logger.info('Health API hit.');

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
