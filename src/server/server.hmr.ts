/* eslint-disable no-console */
import { Http2Server } from 'http2';

import { IDbInitConfig, IDbConnection } from './database';

export const initServer = async (dbConfig: IDbInitConfig, serverPort: number) => {
  // These next imports are necessary for HMR
  let dbConnection: IDbConnection = await require('./database').initDb(dbConfig);
  let app = require('./server').default(dbConnection);

  const server = app.listen(serverPort, () =>
    console.log(`API Server is now running on http://localhost:${serverPort}`),
  ) as Http2Server;

  // Hot module reloading exists only during the development build
  if (module.hot) {
    module.hot.accept(['./server', './database'], async () => {
      try {
        await dbConnection.db.close();
        const { getConnection } = await import('./database');
        dbConnection = await getConnection(dbConfig);
        // replace request handler of server
        server.removeListener('request', app);
        const { default: nextApp } = await import('./server');
        app = nextApp(dbConnection);
        server.on('request', app);
      } catch (err) {
        console.error(err);
      }
    });
  }
};
