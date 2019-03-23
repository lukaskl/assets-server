import { inject } from 'inversify';
// eslint has a trouble to see that 'Query' is actually used ¯\_(ツ)_/¯
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Delete, Get, Post, Put, Query, Route } from 'tsoa';
import { provideSingleton } from '~/ioc/container';

import { UserError } from '../common';
import { IUserContent, User } from './user.entity';
import { UserService } from './users.service';

@Route('users')
@provideSingleton(UsersController)
export class UsersController {
  constructor(@inject(UserService) private readonly service: UserService) {}

  /**
   *
   * @isInt skip
   * @isInt take
   * @minimum  take 0
   * @minimum  skip 0
   * @maximum take 100
   */
  @Get()
  public async getAll(@Query() skip: number = 0, @Query() take: number = 100): Promise<User[]> {
    return await this.service.readAll({ take, skip });
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Get('{uuid}')
  public async get(uuid: string): Promise<User> {
    const result = await this.service.read(uuid);
    if (!result) {
      throw new UserError(404, `User with uuid '${uuid}' was not found`);
    }
    return result;
  }

  @Post()
  public async create(@Body() content: IUserContent): Promise<User> {
    const result = await this.service.create(content);
    return result;
  }

  /**
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Put('{uuid}')
  public async update(uuid: string, @Body() content: Partial<IUserContent>): Promise<User> {
    const result = await this.service.update(uuid, content);
    return result;
  }

  /**
   * @returns {number} Number of affected rows/documents
   * @param uuid
   * @pattern uuid [0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}
   */
  @Delete('{uuid}')
  public async delete(uuid: string): Promise<number> {
    const result = await this.service.delete(uuid);
    if (result.affected === 0) {
      throw new UserError(404, `User with uuid '${uuid}' was not found`);
    }
    return result.affected;
  }
}
