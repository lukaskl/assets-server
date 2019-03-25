/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import { Asset } from '~/modules/assets';
import { AssetType } from '~/modules/assetTypes';
import { User } from '~/modules/users';
import { Allocation } from '~/modules/allocations';

export const buildTestEntities = (keyPrefix: string = '') => {
  const salt = bcrypt.genSaltSync();
  const user = Object.assign(new User(), {
    email: keyPrefix + 'test@test.com',
    firstName: 'test first name',
    lastName: 'test last name',
    uuid: uuid(),
    salt,
    passwordHash: bcrypt.hashSync('password' + salt, 1),
    allocations: [],
  } as User);

  const assetType = Object.assign(new AssetType(), {
    code: keyPrefix + 'car',
    attributes: ['plate', 'color', 'doors'],
    uuid: uuid(),
    assets: [],
  } as AssetType);

  const asset = Object.assign(new Asset(), {
    attributeValues: {
      plate: '123abc',
      color: 'red',
      doors: '4.5',
    },
    uuid: uuid(),
    name: 'jeep',
    type: undefined,
    allocations: [],
    id: undefined,
  } as Asset);

  const allocation = Object.assign(new Allocation(), {
    allocatedTo: undefined,
    asset: undefined,
    from: new Date(Date.parse('2019-03-25T15:00:00z')),
    to: new Date(Date.parse('2019-03-26T15:00:00z')),
    uuid: uuid(),
  } as Allocation);

  return {
    user,
    asset,
    assetType,
    allocation,
  };
};

export type BaseFixture = ReturnType<typeof buildTestEntities>;
