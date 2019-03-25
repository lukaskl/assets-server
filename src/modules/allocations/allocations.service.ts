import { Repository } from 'typeorm';
import { inject, injectRepository, provide } from '~/ioc';
import { AssetService } from '~/modules/assets';
import { BaseService, HttpStatus, IPagination, parsePagination, UserError } from '~/modules/common';
import { UserService } from '~/modules/users';

import { Allocation } from './allocation.entity';
import { AllocationCreateRequest, AllocationUpdateRequest } from './allocations.dto';

@provide(AllocationBaseService)
export class AllocationBaseService extends BaseService<Allocation> {
  constructor(@injectRepository(Allocation) repository: Repository<Allocation>) {
    super(repository);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AllocationBaseServiceKeys = { [key in keyof AllocationBaseService]: any };

export interface IReadAllFilters {
  userEmail?: string;
  assetUuid?: string;
  onlyCurrent?: boolean;
  withingRange?: { from?: Date; to?: Date };
  pagination?: IPagination;
  excludeUuid?: string;
}

@provide(AllocationService)
export class AllocationService implements AllocationBaseServiceKeys {
  constructor(
    @injectRepository(Allocation) private readonly repository: Repository<Allocation>,
    @inject(AllocationBaseService) private readonly baseService: AllocationBaseService,
    @inject(AssetService) private readonly assets: AssetService,
    @inject(UserService) private readonly users: UserService,
  ) {}
  getColumns = this.baseService.getColumns;
  delete = this.baseService.delete;
  read = this.baseService.read;

  readAll = async ({
    userEmail,
    assetUuid,
    onlyCurrent = false,
    withingRange = {},
    pagination = {},
    excludeUuid,
  }: IReadAllFilters) => {
    pagination = parsePagination(pagination);
    let builder = this.repository.createQueryBuilder('allocation');

    builder = builder.innerJoinAndSelect('allocation.allocatedTo', 'user');
    const whereClauses = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereParams: { [key: string]: any } = {};
    if (userEmail) {
      whereClauses.push('user.email = :email');
      whereParams.email = userEmail;
    }

    builder = builder.innerJoinAndSelect('allocation.asset', 'asset');
    if (assetUuid) {
      whereClauses.push('asset.uuid = :assetUuid');
      whereParams.assetUuid = assetUuid;
    }

    if (onlyCurrent) {
      whereClauses.push('allocation.from < now() AND (allocation.to IS NULL OR allocation.to > now())');
    }

    if (excludeUuid) {
      whereClauses.push(`allocation.uuid <> :excludeUuid`);
      whereParams.excludeUuid = excludeUuid;
    }

    if (withingRange.from || withingRange.to) {
      const { from, to } = withingRange;
      if (from) {
        whereClauses.push(`allocation.to IS NULL OR allocation.to >= :from`);
        whereParams.from = from.toISOString();
      }
      if (to) {
        whereClauses.push(`allocation.from <= :to`);
        whereParams.to = to.toISOString();
      }
    }

    if (whereClauses.length > 0) {
      builder = builder.where(`(${whereClauses.join(') AND (')})`, whereParams);
    }

    const result = await builder
      .skip(pagination.skip)
      .take(pagination.take)
      .orderBy('allocation.from', 'DESC')
      .getMany();
    return result;
  };

  create = async (model: AllocationCreateRequest): Promise<Allocation> => {
    const entity = await this.validateAllocation(model);
    const inserted = await this.baseService.create(entity);
    return Object.assign(new Allocation(), entity, inserted);
  };

  update = async (uuid: string, model: AllocationUpdateRequest): Promise<Allocation> => {
    const entityBefore = await this.read(uuid, { relations: ['allocatedTo', 'asset'] });
    const propsToUpdate: AllocationUpdateRequest = Object.keys(model)
      .filter(x => !!model[x])
      .map(x => ({ [x]: model[x] }))
      .reduce((l, r) => ({ ...l, ...r }), {});
    if (model.to === null) {
      propsToUpdate.to = null;
    }

    const entity = await this.validateAllocation(
      {
        allocatedTo: entityBefore.allocatedTo.email,
        assetUuid: entityBefore.asset.uuid,
        from: entityBefore.from,
        to: entityBefore.to,
        ...propsToUpdate,
      },
      entityBefore.uuid,
    );

    const updated = await this.baseService.update(uuid, entity, {}, { relations: ['allocatedTo', 'asset'] });
    return Object.assign(new Allocation(), entity, updated);
  };

  private validateAllocation = async (model: AllocationCreateRequest, excludeUuid?: string) => {
    const { from, to } = model;
    if (to && from.getTime() >= to.getTime()) {
      throw new UserError(
        HttpStatus.BAD_REQUEST,
        `'From' date must be before 'to' date, ` + `'${from.toISOString()}' must be before ${to.toISOString()}`,
      );
    }

    const user = await this.users.readByEmail(model.allocatedTo);
    if (!user) {
      throw new UserError(HttpStatus.NOT_FOUND, `User with email '${model.allocatedTo}' was not found`);
    }

    const asset = await this.assets.read(model.assetUuid);
    if (!asset) {
      throw new UserError(HttpStatus.NOT_FOUND, `Asset with uuid '${model.assetUuid}' was not found`);
    }

    const currentAllocation = (await this.readAll({
      assetUuid: asset.uuid,
      withingRange: { from, to },
      excludeUuid,
    }))[0];
    if (currentAllocation) {
      throw new UserError(
        HttpStatus.CONFLICT,
        `Asset with uuid '${model.assetUuid}' is already allocated ` +
          `from '${currentAllocation.from.toISOString()}' to ${
            currentAllocation.to ? currentAllocation.to.toISOString() : 'infinity'
          }`,
      );
    }

    return Object.assign(new Allocation(), {
      allocatedTo: user,
      asset: asset,
      from: model.from,
      to: model.to,
    });
  };
}
