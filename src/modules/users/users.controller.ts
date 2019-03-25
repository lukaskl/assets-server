import { inject } from 'inversify';
// eslint has a trouble to see that 'Query' is actually used ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Delete, Get, Post, Put, Query, Route, Security } from 'tsoa';
import { provideSingleton } from '~/ioc/container';
import { assertIsValid, UserError } from '~/modules/common';

import { UserCreateRequest, UserResponse, UserUpdateRequest } from './users.dto';
import { UserService } from './users.service';
@Route('users')
@provideSingleton(UsersController)
export class UsersController {
  constructor(@inject(UserService) private readonly service: UserService) {}

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
  public async getAll(@Query() skip: number = 0, @Query() take: number = 100): Promise<UserResponse[]> {
    return await this.service.readAll({ take, skip });
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Get('{uuid}')
  @Security('jwt')
  public async get(uuid: string): Promise<UserResponse> {
    const result = await this.service.read(uuid);
    if (!result) {
      throw new UserError(404, `User with uuid '${uuid}' was not found`);
    }
    return result;
  }

  @Post()
  @Security('jwt')
  public async create(@Body() request: UserCreateRequest): Promise<UserResponse> {
    await assertIsValid(Object.assign(new UserCreateRequest(), request));
    const result = await this.service.create(request, request.password);
    return result;
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Put('{uuid}')
  @Security('jwt')
  public async update(uuid: string, @Body() request: UserUpdateRequest): Promise<UserResponse> {
    await assertIsValid(Object.assign(new UserUpdateRequest(), request));
    const result = await this.service.update(uuid, request, {}, {}, request.password);
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
      throw new UserError(404, `User with uuid '${uuid}' was not found`);
    }
    return result.affected;
  }
}
