import { DeepPartial, Repository } from 'typeorm';
import { injectRepository, provide } from '~/ioc';
import { BaseService } from '~/modules/common';

import { Asset } from './asset.entity';

@provide(AssetService)
export class AssetService extends BaseService<Asset> {
  private baseCreate: AssetService['create'] = this.create;
  private baseUpdate: AssetService['update'] = this.update;
  constructor(@injectRepository(Asset) repository: Repository<Asset>) {
    super(repository);
  }

  create = async (model: DeepPartial<Asset>) => {
    return await this.baseCreate(model);
  };

  update = async (uuid: string, model: DeepPartial<Asset>) => {
    return await this.baseUpdate(uuid, model);
  };
}
