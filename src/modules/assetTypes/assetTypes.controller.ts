import { inject } from 'inversify';
// eslint has a trouble to see that 'Query' is actually used ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Delete, Get, Post, Put, Query, Route, Security } from 'tsoa';
import { provideSingleton } from '~/ioc/container';
import { assertIsValid, UserError, isUuid } from '~/modules/common';

import { AssetTypeService } from './assetTypes.service';
import { AssetTypeCreateRequest, AssetTypeUpdateRequest, AssetTypeResponse } from './assetTypes.dto';

@Route('assetTypes')
@provideSingleton(AssetTypesController)
export class AssetTypesController {
  constructor(@inject(AssetTypeService) private readonly service: AssetTypeService) {}

  /**
   *
   * @isInt skip
   * @isInt take
   * @minimum take 0
   * @minimum skip 0
   * @maximum take 100
   */
  @Get()
  @Security('jwt')
  public async getAll(@Query() skip: number = 0, @Query() take: number = 100): Promise<AssetTypeResponse[]> {
    return await this.service.readAll({ take, skip });
  }

  /**
   * @param uuidOrCode
   * @minLength uuidOrCode 2
   */
  @Get('{uuidOrCode}')
  @Security('jwt')
  public async get(uuidOrCode: string): Promise<AssetTypeResponse> {
    let result = isUuid(uuidOrCode) ? await this.service.read(uuidOrCode) : await this.service.readByCode(uuidOrCode);

    if (!result) {
      throw new UserError(404, `AssetType with uuid or code '${uuidOrCode}' was not found`);
    }
    return result;
  }

  @Post()
  @Security('jwt')
  public async create(@Body() request: AssetTypeCreateRequest): Promise<AssetTypeResponse> {
    await assertIsValid(Object.assign(new AssetTypeCreateRequest(), request));
    const result = await this.service.create(request);
    return result;
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Put('{uuid}')
  @Security('jwt')
  public async update(uuid: string, @Body() request: AssetTypeUpdateRequest): Promise<AssetTypeResponse> {
    await assertIsValid(Object.assign(new AssetTypeUpdateRequest(), request));
    const result = await this.service.update(uuid, request);
    return result;
  }

  /**
   * @returns {number} Number of affected rows/documents
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Delete('{uuid}')
  @Security('jwt')
  public async delete(uuid: string): Promise<number> {
    const result = await this.service.delete(uuid);
    if (result.affected === 0) {
      throw new UserError(404, `AssetType with uuid '${uuid}' was not found`);
    }
    return result.affected;
  }
}
