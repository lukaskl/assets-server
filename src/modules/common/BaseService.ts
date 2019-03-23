/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator';
import { injectable } from 'inversify';
import _ from 'lodash';
import { Repository } from 'typeorm';
import uuid from 'uuid/v4';

import { IModel, UserError, ValidationError } from '../common';

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
    take = Math.min(Math.max(0, take), MAX_PAGINATION);
    const result = await this.repository.find({
      skip,
      take,
    });
    return result;
  };

  read = async (uuid: string) => {
    return this.repository.findOne({
      where: {
        uuid,
      },
    });
  };

  create = async (model: Partial<TEntity>): Promise<TEntity> => {
    const entity = (this.repository.create(model as any) as any) as TEntity;
    entity.uuid = uuid();

    const errors = await validate(entity);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    const result = await this.repository.insert(entity as any);
    return await this.repository.findOne(result.identifiers[0]);
  };

  delete = async (uuid: string) => {
    if (!uuid) {
      throw new UserError(400, 'uuid field is missing');
    }
    return await this.repository.delete({ uuid } as any);
  };

  update = async (uuid: string, model: Partial<TEntity>) => {
    model = _.omit(model, 'id', 'uuid');
    const entity = (this.repository.create(model as any) as any) as TEntity;

    const errors = await validate(entity, { skipMissingProperties: true });
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    await this.repository.update({ uuid } as any, entity as any);
    return await this.read(uuid);
  };
}
