import { inject } from 'inversify';
import { Body, Post, Route } from 'tsoa';
import { provideSingleton } from '~/ioc/container';
import { assertIsValid, HttpStatus, UserError } from '~/modules/common';
import { User, UserCreateRequest, UserService } from '~/modules/users';

import { AuthService } from './auth.service';
import { AuthPayload } from './auth.types';

@Route('auth')
@provideSingleton(AuthController)
export class AuthController {
  constructor(
    @inject(UserService) private readonly users: UserService,
    @inject(AuthService) private readonly auth: AuthService,
  ) {}

  @Post('login')
  public async login(@Body() model: AuthPayload) {
    await assertIsValid(Object.assign(new AuthPayload(), model));
    const isValid = await this.auth.validatePassword(model);

    if (!isValid) {
      throw new UserError(HttpStatus.FORBIDDEN, 'Email or password wrong!');
    }

    return this.auth.createToken(model.email);
  }

  @Post('signup')
  public async signup(@Body() request: UserCreateRequest): Promise<User> {
    await assertIsValid(Object.assign(new UserCreateRequest(), request));
    const result = await this.users.create(request, request.password);
    return result;
  }
}
