/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { initServer } from '~/server/server.hmr';
import { IDbConnection } from '~/server/database';
import * as jwt from 'jsonwebtoken';
import { User, UserService } from '~/modules/users';
import { Asset, AssetService, AssetBaseService } from '~/modules/assets';
import { AssetType, AssetTypeService } from '~/modules/assetTypes';
import { Allocation } from '~/modules/allocations';
import { Connection } from 'typeorm';
import { AllocationService, AllocationBaseService } from '~/modules/allocations/allocations.service';
import { buildDbTestContext } from './dbMethods';
import { buildTestEntities } from './baseFixture';

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

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type TestRepositories = ReturnType<typeof buildRepositories>;
const buildRepositories = (getRepo: Connection['getRepository']) => ({
  user: getRepo(User),
  asset: getRepo(Asset),
  assetType: getRepo(AssetType),
  allocation: getRepo(Allocation),
  getRepository: getRepo,
});

const buildServices = (repositories: ReturnType<typeof buildRepositories>) => {
  const userService = new UserService(repositories.user);
  const assetTypeService = new AssetTypeService(repositories.assetType);
  const assetService = new AssetService(repositories.asset, new AssetBaseService(repositories.asset), assetTypeService);
  const allocationService = new AllocationService(
    repositories.allocation,
    new AllocationBaseService(repositories.allocation),
    assetService,
    userService,
  );
  return {
    user: userService,
    assetType: assetTypeService,
    asset: assetService,
    allocation: allocationService,
  };
};

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type TestContext = Unpacked<ReturnType<typeof initTestContext>>;

export const initTestContext = async () => {
  // optimization to prevent server rebuilding every time watch mode reloads the tests
  if (global['testContext']) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return global['testContext'] as typeof context;
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

  const client = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
  });
  const authClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: { authorization: jwt.sign({ email: TEST_AUTH_EMAIL }, process.env.SECRET, { expiresIn: 60 * 60 }) },
  });
  const repository = buildRepositories(entity => getRepository(server.dbConnection, entity));
  const service = buildServices(repository);

  const dbTestContext = buildDbTestContext(server.dbConnection, repository);
  const context = {
    server: server.server,
    db: dbTestContext,
    client,
    authClient,
    repository,
    service,
    fixture: buildTestEntities,
  };

  global['testContext'] = context;

  return context;
};
