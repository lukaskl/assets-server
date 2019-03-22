import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import routes from '~/modules/routers';

import { errorHandler } from './errorHandler';
import { IDbConnection } from './database';

const app = express();

function initServer(dbConnection: IDbConnection) {
  app.use(logger('dev'));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  routes(dbConnection).forEach(r => app.use(r.route, r.router));
  app.use(errorHandler);
  return app;
}

export default initServer;
