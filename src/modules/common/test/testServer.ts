import axios from 'axios';
import { initServer } from '~/server/server.hmr';
import { IDbConnection } from '~/server/database';
import * as jwt from 'jsonwebtoken';

export const TEST_AUTH_EMAIL = 'testemail@example.com';

// there is a bug with typeorm, where it is not possible
// to retrieve a repository when tests are running with a watch mode.
// after first reload it throws an error, that entities' repository was not found
// even though debug information shows it is there.
const getRepository = ({ db }: IDbConnection, entity) => {
  const name = entity.name;
  if (!global['testRepositories']) {
    global['testRepositories'] = {};
  }
  if (!global['testRepositories'][name]) {
    global['testRepositories'][name] = db.getRepository(entity);
  }
  return global['testRepositories'][name];
};

export const initTestServer = async () => {
  // optimization to prevent server rebuilding every time watch mode reloads tests
  if (global['testServer']) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return global['testServer'] as typeof result;
  }

  const server = await initServer(
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
  const result = {
    ...server,
    client: axios.create({
      baseURL: `http://localhost:${process.env.PORT}`,
    }),
    authClient: axios.create({
      baseURL: `http://localhost:${process.env.PORT}`,
      headers: { authorization: jwt.sign({ email: TEST_AUTH_EMAIL }, process.env.SECRET, { expiresIn: 60 * 60 }) },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRepository: (entity: any) => getRepository(server.dbConnection, entity),
  };

  global['testServer'] = result;

  return result;
};
