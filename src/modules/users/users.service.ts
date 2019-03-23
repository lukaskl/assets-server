import { Repository } from 'typeorm';
import { injectRepository, provide } from '~/ioc';

import { BaseService } from '../common/BaseService';
import { User } from './user.entity';

@provide(UserService)
export class UserService extends BaseService<User> {
  constructor(@injectRepository(User) repository: Repository<User>) {
    super(repository);
  }
}
