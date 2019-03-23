/* eslint-disable no-console */
import { initServer } from './server.hmr';

export const startServer = async () =>
  await initServer(
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dbName: process.env.DB_DBNAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ensureDbExists: process.env.DB_ENSURE_EXISTS.toLowerCase() === 'true',
      syncSchema: process.env.DB_SYNC_SCHEMA.toLowerCase() === 'true',
    },
    Number(process.env.PORT),
  );
