import axios from 'axios';
import { initServer } from '~/server/server.hmr';

export const initTestServer = async () => ({
  ...(await initServer(
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
  )),
  client: axios.create({
    baseURL: `http://localhost:${process.env.TESTS_SERVER_PORT}`,
  }),
});
