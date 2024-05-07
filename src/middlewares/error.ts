import { ErrorMessages } from '@/errors/error-messages';
import { HTTPStatusCode } from '@/errors/http-status-codes';
import { NextFunction, Request, Response } from 'express';

interface IHTTPError extends Error {
  // because default Error class does not have status code
  statusCode: number;
}

export const exceptionHandler = (
  error: IHTTPError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) {
    let statusCode = error.statusCode || 500;
    const message = error.message || ErrorMessages.Generic;

    if (message === 'Validation error') {
      statusCode = HTTPStatusCode.BadRequest;
    }

    return res.status(statusCode).json({ ...error, message });
  }

  next();
};
