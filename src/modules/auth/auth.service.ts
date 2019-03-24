import * as jwt from 'jsonwebtoken';
import { inject, provide } from '~/ioc';
import { UserService } from '~/modules/users';

import { AuthPayload } from './auth.types';

@provide(AuthService)
export class AuthService {
  constructor(@inject(UserService) private readonly users: UserService) {}

  async createToken(email: string) {
    const expiresIn = 60 * 60;
    const secretOrKey = process.env.SECRET;
    const user = { email };
    const token = jwt.sign(user, secretOrKey, { expiresIn });

    return { expiresIn, token };
  }

  validatePassword = async (model: AuthPayload): Promise<boolean> => {
    const entity = await this.users.readByEmail(model.email, true);
    if (!entity) {
      return false;
    }
    return this.users.compareHash(model.password, entity.salt, entity.passwordHash);
  };
}
