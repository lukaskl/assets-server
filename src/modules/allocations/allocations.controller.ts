import { inject } from 'inversify';
// eslint has a trouble to see that 'Query' is actually used ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Delete, Get, Post, Put, Query, Route, Security } from 'tsoa';
import { provideSingleton } from '~/ioc/container';
import { assertIsValid, UserError, isUuid, HttpStatus, isEmail } from '~/modules/common';

import { AllocationService } from './allocations.service';
import { AllocationCreateRequest, AllocationUpdateRequest, AllocationResponse } from './allocations.dto';

@Route('allocations')
@provideSingleton(AllocationsController)
export class AllocationsController {
  constructor(@inject(AllocationService) private readonly service: AllocationService) {}

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
  public async getAll(
    @Query() userEmail?: string,
    @Query() assetUuid?: string,
    @Query() onlyCurrent = false,
    @Query() skip: number = 0,
    @Query() take: number = 100,
  ): Promise<AllocationResponse[]> {
    if (userEmail && !isEmail(userEmail)) {
      throw new UserError(HttpStatus.BAD_REQUEST, `userEmail '${userEmail}' is a not valid email`);
    }
    if (assetUuid && !isUuid(assetUuid)) {
      throw new UserError(HttpStatus.BAD_REQUEST, `assetUuid '${assetUuid}' is a not valid uuid`);
    }
    return await this.service.readAll({
      assetUuid,
      userEmail,
      onlyCurrent,
      pagination: { skip, take },
    });
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Get('{uuid}')
  @Security('jwt')
  public async get(uuid: string): Promise<AllocationResponse> {
    const result = await this.service.read(uuid);
    if (!result) {
      throw new UserError(HttpStatus.NOT_FOUND, `Allocation with uuid '${uuid}' was not found`);
    }
    return result;
  }

  @Post()
  @Security('jwt')
  public async create(@Body() request: AllocationCreateRequest): Promise<AllocationResponse> {
    await assertIsValid(Object.assign(new AllocationCreateRequest(), request));
    const result = await this.service.create(request);
    return result;
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Put('{uuid}')
  @Security('jwt')
  public async update(uuid: string, @Body() request: AllocationUpdateRequest): Promise<AllocationResponse> {
    await assertIsValid(Object.assign(new AllocationUpdateRequest(), request));
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
      throw new UserError(404, `Allocation with uuid '${uuid}' was not found`);
    }
    return result.affected;
  }
}
