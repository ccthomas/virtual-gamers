import { NextFunction, Request, Response } from 'express';
import { getLogger } from '../utils/LoggingUtil';

// Error handling middleware function
export const apiError = async (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const logger = getLogger();
  logger.error({ err }, 'API Error Middleware hit.');

  if (err.message === 'Unauthorized') {
    logger.trace('Unautorized error.');
    res.header('Content-Type', 'application/json');
    res.status(401).json({
      message: 'Unauthorized',
    });
  } else if (err.message.includes('Invalid Credentials')) {
    logger.trace('Invalid Credentials error.');
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: 'Invalid Credentials',
    });
  } else if (err.message.includes('duplicate key value violates unique constraint')) {
    logger.trace('Duplicate key constraint error.');
    if (err.message.includes('auth_username_key')) {
      logger.trace('Duplicate username constraint.');
      res.header('Content-Type', 'application/json');
      res.status(400).json({
        message: 'Username is alreay taken',
      });
    }
  } else {
    // Respond with a generic error message
    logger.trace('Internal error occurred.');
    res.header('Content-Type', 'application/json');
    res.status(500).json({
      message: 'An unexpected error occurred.',
      // Optionally include the error message for development (not recommended for production)
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
  next();
};
