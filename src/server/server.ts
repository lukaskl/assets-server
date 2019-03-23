import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import logger from 'morgan';

import { errorHandler } from './errorHandler';
import { RegisterRoutes } from './routes';

const app = express();

function initServer() {
  app.use(logger('dev'));
  app.use(cors());
  app.use(express.json());
  RegisterRoutes(app);
  app.use(express.urlencoded({ extended: false }));

  app.use(errorHandler);
  return app;
}

export default initServer;
