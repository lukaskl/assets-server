import uuid from 'uuid/v4';
import { UserError } from '~/modules/common';
import { ErrorRequestHandler } from 'express';

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

  // eslint-disable-next-line no-console
  console.error(`ERROR (${errId}):`, err);
  return res.status(500).json({
    message: 'Internal server Error',
    trackingId: errId,
  });
};
