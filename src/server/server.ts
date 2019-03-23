import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './errorHandler';
import { RegisterRoutes } from './routes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('./swagger.json');

const app = express();

function initServer() {
  app.use(logger('dev'));
  app.use(cors());
  app.use(express.json());
  RegisterRoutes(app);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.urlencoded({ extended: false }));

  app.use(errorHandler);
  return app;
}

export default initServer;
