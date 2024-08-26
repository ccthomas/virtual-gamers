import { Request, Response } from 'express';
import { Logger } from 'pino';

// Error handling middleware function
export const createApiErrorMiddleware = (
  logger: Logger,
) => async (err: Error, _req: Request, res: Response): Promise<void> => {
  logger.error({ err }, 'API Error Middleware hit.');

  // Respond with a generic error message
  res.status(500).json({
    message: 'An unexpected error occurred.',
    // Optionally include the error message for development (not recommended for production)
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
