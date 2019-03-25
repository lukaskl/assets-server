/* eslint-disable no-console */
import { Http2Server } from 'http2';
import { iocContainer, TYPES } from '~/ioc';

import { IDbConnection, IDbInitConfig } from './database';

export const initServer = async (dbConfig: IDbInitConfig, serverPort: number) => {
  // These next imports are necessary for HMR
  let dbConnection: IDbConnection = await require('./database').initDb(dbConfig);
  iocContainer.bind(TYPES.DB).toConstantValue(dbConnection);

  let app = require('./server').default();

  const server = app.listen(serverPort, () =>
    console.log(`API Server is now running on http://localhost:${serverPort}`),
  ) as Http2Server;

  // Hot module reloading exists only during the development build
  if (module.hot) {
    module.hot.accept(['./server', './database'], async () => {
      try {
        // replace the connection
        dbConnection.db.close();
        dbConnection = await require('./database').initDb(dbConfig);
        iocContainer.unbind(TYPES.DB);
        iocContainer.bind(TYPES.DB).toConstantValue(dbConnection);
        // replace the server
        server.removeListener('request', app);
        const { default: nextApp } = await import('./server');
        app = nextApp();
        server.on('request', app);
      } catch (err) {
        console.error(err);
      }
    });
  }
  return {
    dbConnection,
    server,
  };
};
