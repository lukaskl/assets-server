import uuid from 'uuid/v4';
import { UserError, ValidationError, HttpStatus } from '~/modules/common';
import { ErrorRequestHandler } from 'express';
import { ValidateError } from 'tsoa';

// Error-handling middleware always takes four arguments
// https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errId = uuid();

  if (err.constructor.name === 'UserError') {
    const error = err as UserError;
    // eslint-disable-next-line no-console
    console.error(`ERROR (${errId}):`, error.message);
    return res.status(error.responseCode).json({
      message: error.message,
      trackingId: errId,
    });
  }

  if (err.constructor.name === 'ValidationError') {
    const error = err as ValidationError;
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.error(`ERROR (${errId}):`, error.message);
    return res.status(error.status).json({
      message: 'Validation error',
      fields: error.fields,
      trackingId: errId,
    });
  }

  // eslint-disable-next-line no-console
  console.error(`ERROR (${errId}):`, err);
  return res.status(500).json({
    message: 'Internal server Error',
    trackingId: errId,
  });
};
