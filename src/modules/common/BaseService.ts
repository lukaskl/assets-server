/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import _ from 'lodash';
import { DeepPartial, Repository, FindOneOptions, SaveOptions } from 'typeorm';
import uuid from 'uuid/v4';

import { IModel, UserError } from '../common';
import { assertIsValid } from './ValidationError';
import { isUuid } from './utils';

export interface IPagination {
  skip?: number;
  take?: number;
}

export const MAX_PAGINATION = 100;

export const parsePagination = ({ skip = 0, take = MAX_PAGINATION }: IPagination) => {
  skip = Math.max(0, skip);
  take = Math.min(take <= 0 ? MAX_PAGINATION : take, MAX_PAGINATION);
  return { skip, take };
};

@injectable()
export class BaseService<TEntity extends IModel> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  readAll = async (pagination: IPagination = {}, findOptions: FindOneOptions<TEntity> = {}) => {
    const result = await this.repository.find({
      ...parsePagination(pagination),
      ...findOptions,
    });
    return result;
  };

  read = async (uuid: string, options: FindOneOptions<TEntity> = {}) => {
    if (!isUuid(uuid)) {
      throw new UserError(400, 'invalid uuid');
    }
    const { where, ...rest } = options;
    return this.repository.findOne({
      where: {
        uuid,
        ...(where as {}),
      },
      ...rest,
    });
  };

  create = async (model: Partial<TEntity>): Promise<TEntity> => {
    const entity = this.repository.create((model as unknown) as DeepPartial<TEntity>);
    entity.uuid = uuid();

    await assertIsValid(entity);
    const result = await this.repository.insert(entity as any);
    return await this.repository.findOne(result.identifiers[0]);
  };

  delete = async (uuid: string) => {
    if (!isUuid(uuid)) {
      throw new UserError(400, 'invalid uuid');
    }
    return await this.repository.delete({ uuid } as any);
  };

  update = async (
    uuid: string,
    model: Partial<TEntity>,
    saveOption: SaveOptions = {},
    findOptions: FindOneOptions<TEntity> = {},
  ) => {
    if (!isUuid(uuid)) {
      throw new UserError(400, 'invalid uuid');
    }
    model = _.omit(model, 'id', 'uuid');
    const entity = this.repository.create((model as unknown) as DeepPartial<TEntity>);

    await assertIsValid(entity, { skipMissingProperties: true });

    await this.repository.update({ uuid } as any, entity as any, saveOption);
    return await this.read(uuid, findOptions);
  };

  getColumns = (): Array<keyof TEntity> => {
    return this.repository.metadata.columns.map(x => x.propertyName) as Array<keyof TEntity>;
  };
}
