import _ from 'lodash';
import { Repository } from 'typeorm';
import { inject, injectRepository, provide } from '~/ioc';
import { AssetTypeService } from '~/modules/assetTypes';
import { BaseService, HttpStatus, UserError } from '~/modules/common';

import { Asset } from './asset.entity';
import { AssetCreateRequest, AssetUpdateRequest } from './assets.dto';

@provide(AssetBaseService)
export class AssetBaseService extends BaseService<Asset> {
  constructor(@injectRepository(Asset) repository: Repository<Asset>) {
    super(repository);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AssetBaseServiceKeys = { [key in keyof AssetBaseService]: any };

@provide(AssetService)
export class AssetService implements AssetBaseServiceKeys {
  constructor(
    @injectRepository(Asset) private readonly repository: Repository<Asset>,
    @inject(AssetBaseService) private readonly baseService: AssetBaseService,
    @inject(AssetTypeService) private readonly assetTypes: AssetTypeService,
  ) {}
  getColumns = this.baseService.getColumns;
  delete = this.baseService.delete;
  read = this.baseService.read;
  readAll = this.baseService.readAll;

  create = async (model: AssetCreateRequest): Promise<Asset> => {
    const type = await this.assetTypes.readByCode(model.typeCode);
    if (!type) {
      throw new UserError(HttpStatus.NOT_FOUND, `Asset Type with code '${model.typeCode}' was not found`);
    }
    const entity = new Asset();
    entity.attributeValues = _.pick(model.attributeValues, type.attributes);
    entity.type = type;
    entity.name = model.name;

    return await this.baseService.create(entity);
  };

  update = async (uuid: string, model: AssetUpdateRequest): Promise<Asset> => {
    const entity = await this.read(uuid);
    if (model.typeCode) {
      const type = await this.assetTypes.readByCode(model.typeCode);
      if (!type) {
        throw new UserError(HttpStatus.NOT_FOUND, `Asset Type with code '${model.typeCode}' was not found`);
      }
      entity.type = type;
    }

    if (model.attributeValues && Object.keys(model.attributeValues).length > 0) {
      entity.attributeValues = _.pick(model.attributeValues, entity.type.attributes);
    }

    Object.assign(entity, _.pick(model, 'name'));

    return await this.baseService.update(uuid, entity);
  };
}
