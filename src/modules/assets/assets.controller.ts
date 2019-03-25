import { inject } from 'inversify';
// eslint has a trouble to see that 'Query' is actually used ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Delete, Get, Post, Put, Query, Route, Security } from 'tsoa';
import { provideSingleton } from '~/ioc/container';
import { assertIsValid, UserError } from '~/modules/common';

import { AssetService } from './assets.service';
import { AssetCreateRequest, AssetUpdateRequest, AssetResponse } from './assets.dto';

@Route('assets')
@provideSingleton(AssetsController)
export class AssetsController {
  constructor(@inject(AssetService) private readonly service: AssetService) {}

  /**
   *
   * @isInt skip
   * @isInt take
   * @minimum  take 0
   * @minimum  skip 0
   * @maximum take 100
   */
  @Get()
  @Security('jwt')
  public async getAll(@Query() skip: number = 0, @Query() take: number = 100): Promise<AssetResponse[]> {
    return await this.service.readAll({ take, skip });
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Get('{uuid}')
  @Security('jwt')
  public async get(uuid: string): Promise<AssetResponse> {
    const result = await this.service.read(uuid);
    if (!result) {
      throw new UserError(404, `Asset with uuid '${uuid}' was not found`);
    }
    return result;
  }

  @Post()
  @Security('jwt')
  public async create(@Body() request: AssetCreateRequest): Promise<AssetResponse> {
    await assertIsValid(Object.assign(new AssetCreateRequest(), request));
    const result = await this.service.create(request);
    return result;
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Put('{uuid}')
  @Security('jwt')
  public async update(uuid: string, @Body() request: AssetUpdateRequest): Promise<AssetResponse> {
    await assertIsValid(Object.assign(new AssetUpdateRequest(), request));
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
      throw new UserError(404, `Asset with uuid '${uuid}' was not found`);
    }
    return result.affected;
  }
}
