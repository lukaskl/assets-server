/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import _ from 'lodash';
import { DeepPartial, Repository } from 'typeorm';
import uuid from 'uuid/v4';

import { IModel, UserError } from '../common';
import { assertIsValid } from './ValidationError';
import { isUuid } from './utils';

export interface IPagination {
  skip?: number;
  take?: number;
}

const MAX_PAGINATION = 100;

@injectable()
export class BaseService<TEntity extends IModel> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  readAll = async ({ skip = 0, take = MAX_PAGINATION }: IPagination = {}) => {
    skip = Math.max(0, skip);
    take = Math.min(take <= 0 ? MAX_PAGINATION : take, MAX_PAGINATION);
    const result = await this.repository.find({
      skip,
      take,
    });
    return result;
  };

  read = async (uuid: string) => {
    if (!isUuid(uuid)) {
      throw new UserError(400, 'invalid uuid');
    }
    return this.repository.findOne({
      where: {
        uuid,
      },
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

  update = async (uuid: string, model: Partial<TEntity>) => {
    if (!isUuid(uuid)) {
      throw new UserError(400, 'invalid uuid');
    }
    model = _.omit(model, 'id', 'uuid');
    const entity = this.repository.create((model as unknown) as DeepPartial<TEntity>);

    await assertIsValid(entity, { skipMissingProperties: true });

    await this.repository.update({ uuid } as any, entity as any);
    return await this.read(uuid);
  };

  getColumns = (): Array<keyof TEntity> => {
    return this.repository.metadata.columns.map(x => x.propertyName) as Array<keyof TEntity>;
  };
}
