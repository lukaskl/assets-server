import { TestRepositories } from './testContext';
import { IDbConnection } from '~/server/database';
import { buildTestEntities } from './baseFixture';

const insertBaseFixture = async (repository: TestRepositories, keyPrefix?: string) => {
  const fixture = buildTestEntities(keyPrefix);
  const user = await repository.user.save(fixture.user);
  const assetType = await repository.assetType.save(fixture.assetType);
  const asset = await repository.asset.save(Object.assign(fixture.asset, { type: assetType }));
  const allocation = await repository.allocation.save(
    Object.assign(fixture.allocation, {
      asset,
      allocatedTo: user,
    }),
  );
  return {
    user,
    assetType,
    asset,
    allocation,
  };
};

export const buildDbTestContext = (connection: IDbConnection, repositories: TestRepositories) => {
  type Keys = keyof Omit<typeof repositories, 'getRepository'>;
  type ClearTableMethods = { [key in Keys]: () => Promise<void> };
  const clear = (Object.keys(repositories)
    .filter(x => x !== 'getRepository')
    .map((x: Keys) => ({ [x]: () => repositories[x].query(`DELETE FROM "${repositories[x].metadata.tableName}"`) }))
    .reduce((l, r) => ({ ...l, ...r }), {}) as unknown) as ClearTableMethods;

  const clearAll = async () => {
    for (let key of Object.keys(clear)) {
      await clear[key]();
    }
  };
  return {
    connection: connection.db,
    insertBaseFixture: (keyPrefix?: string) => insertBaseFixture(repositories, keyPrefix),
    clear: {
      ...clear,
      all: clearAll,
    },
  };
};

export type DbClearMethods = ReturnType<typeof buildDbTestContext>;
