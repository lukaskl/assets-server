import { DeepPartial, Repository } from 'typeorm';
import { injectRepository, provide } from '~/ioc';
import { BaseService } from '~/modules/common';

import { Allocation } from './allocation.entity';

@provide(AllocationService)
export class AllocationService extends BaseService<Allocation> {
  private baseCreate: AllocationService['create'] = this.create;
  private baseUpdate: AllocationService['update'] = this.update;
  constructor(@injectRepository(Allocation) repository: Repository<Allocation>) {
    super(repository);
  }

  create = async (model: DeepPartial<Allocation>) => {
    return await this.baseCreate(model);
  };

  update = async (uuid: string, model: DeepPartial<Allocation>) => {
    return await this.baseUpdate(uuid, model);
  };
}
