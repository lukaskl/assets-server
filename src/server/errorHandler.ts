import uuid from 'uuid/v4';
import { UserError } from '~/modules/common';

export function errorHandler(err, req, res, next) {
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
}
