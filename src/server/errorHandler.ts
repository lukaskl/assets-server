/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express';
import { ValidateError } from 'tsoa';
import uuid from 'uuid/v4';
import { UserError, ValidationError, HttpStatus } from '~/modules/common';

// Error-handling middleware always takes four arguments
// https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errId = uuid();

  if (err.constructor.name === 'TokenExpiredError') {
    console.error(`ERROR (${errId}):`, err.message);
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: err.message,
      trackingId: errId,
      expiredAt: (err as any).expiredAt,
    });
  }

  if (err.constructor.name === 'UserError') {
    const error = err as UserError;

    console.error(`ERROR (${errId}):`, error.message);
    return res.status(error.responseCode).json({
      message: error.message,
      trackingId: errId,
    });
  }

  if (err.constructor.name === 'ValidationError') {
    const error = err as ValidationError;

    console.error(`ERROR (${errId}):`, error.message);
    return res.status(error.responseCode).json({
      message: 'Validation error',
      fields: error.errors.map(x => ({
        [x.property]: {
          constraints: x.constraints,
          value: x.value,
        },
      })),
      trackingId: errId,
    });
  }
  if (err.constructor.name === 'ValidateError') {
    const error = err as ValidateError;

    console.error(`ERROR (${errId}):`, error.message);
    return res.status(error.status).json({
      message: 'Validation error',
      fields: error.fields,
      trackingId: errId,
    });
  }

  console.error(`ERROR (${errId}):`, err);
  return res.status(500).json({
    message: 'Internal server Error',
    trackingId: errId,
  });
};
