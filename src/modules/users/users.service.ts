import bcrypt from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
import { injectRepository, provide } from '~/ioc';
import { BaseService } from '~/modules/common';

import { User } from './user.entity';

@provide(UserService)
export class UserService extends BaseService<User> {
  private baseCreate: UserService['create'] = this.create;
  private baseUpdate: UserService['update'] = this.update;
  constructor(@injectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  readByEmail = async (email: string, includeHiddenColumns: boolean = false) => {
    return this.repository.findOne({
      where: {
        email,
      },
      ...(includeHiddenColumns ? { select: this.getColumns() } : {}),
    });
  };

  create = async (model: DeepPartial<User>, password?: string) => {
    const entity = this.repository.create(model);
    entity.salt = await bcrypt.genSalt();
    entity.passwordHash = await this.getHash(password, entity.salt);
    return await this.baseCreate(entity);
  };

  update = async (uuid: string, model: DeepPartial<User>, password?: string) => {
    const entity = this.repository.create(model);
    if (password) {
      entity.salt = await bcrypt.genSalt();
      entity.passwordHash = await this.getHash(password, entity.salt);
    }
    return await this.baseUpdate(uuid, entity);
  };

  async getHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password + salt, 1);
  }

  async compareHash(password: string, salt: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password + salt, hash);
  }
}
