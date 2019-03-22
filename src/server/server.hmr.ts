/* eslint-disable no-console */
import { Http2Server } from 'http2';

import { IDbInitConfig, initDb } from './database';

export const initServer = (dbConfig: IDbInitConfig, serverPort: number) =>
  initDb(dbConfig).then(dbConnection => {
    // The next import is necessary for HRM
    let app = require('./server').default(dbConnection);

    const server = app.listen(serverPort, () =>
      console.log(`API Server is now running on http://localhost:${serverPort}`),
    ) as Http2Server;

    // Hot module reloading exists only during the development build
    if (module.hot) {
      module.hot.accept('./server', async () => {
        // replace request handler of server
        server.removeListener('request', app);
        try {
          const { default: nextApp } = await import('./server');
          app = nextApp(dbConnection);
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
  });
