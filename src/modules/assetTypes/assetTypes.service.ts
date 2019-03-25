import { DeepPartial, Repository } from 'typeorm';
import { injectRepository, provide } from '~/ioc';
import { BaseService } from '~/modules/common';

import { AssetType } from './assetType.entity';

@provide(AssetTypeService)
export class AssetTypeService extends BaseService<AssetType> {
  private baseCreate: AssetTypeService['create'] = this.create;
  private baseUpdate: AssetTypeService['update'] = this.update;
  constructor(@injectRepository(AssetType) repository: Repository<AssetType>) {
    super(repository);
  }

  create = async (model: DeepPartial<AssetType>) => {
    return await this.baseCreate(model);
  };

  update = async (uuid: string, model: DeepPartial<AssetType>) => {
    return await this.baseUpdate(uuid, model);
  };
}
