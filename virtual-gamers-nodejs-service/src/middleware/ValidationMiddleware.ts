import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define a type for the middleware function
type ValidationMiddleware = (
  schema: Joi.ObjectSchema
) => (req: Request, res: Response, next: NextFunction) => void;

export const validationMiddleware: ValidationMiddleware = (
  schema,
) => (req, res, next): Promise<void> => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};
