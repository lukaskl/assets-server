/* eslint-disable @typescript-eslint/no-explicit-any */
import chai from 'chai';
import _ from 'lodash';
import { initTestContext, TestContext } from '~/modules/common/test';

import { User } from '../user.entity';

describe('Users Integration Tests', async () => {
  let context: TestContext;
  before(async function() {
    this.timeout(15000);
    context = await initTestContext();
    await context.db.clear.user();
  });

  afterEach(async () => {
    await context.db.clear.user();
  });

  describe('Create', () => {
    const payload = {
      email: 'test@test.com',
      firstName: 'test name',
      lastName: 'test surname',
      password: 'testPassword',
    };
    describe('password properties', () => {
      let userDto: any;
      let userEntity: User;
      before(async () => {
        const response = await context.authClient.post('/users/', payload);
        userDto = response.data;
        userEntity = await context.service.user.readByEmail('test@test.com', true);
      });

      it('should get back created user', () => {
        chai.expect(userDto).contain(_.omit(payload, 'password'));
        chai.expect(userEntity).contain(userDto);
      });

      it('should not get any details about password', () => {
        chai.expect(userDto.passwordHash, 'userDto.passwordHash').to.be.not.ok;
        chai.expect(userDto.password, 'userDto.passwordHash').to.be.not.ok;
        chai.expect(userDto.salt, 'userDto.salt').to.be.not.ok;
        chai.expect(userDto.uuid, 'userDto.uuid').to.be.ok;
      });

      it('entity should store only hashed password', () => {
        chai.expect((userEntity as any).password, 'userEntity.passwordHash').to.be.not.ok;
        chai.expect(userEntity.passwordHash, 'userEntity.passwordHash').to.be.ok;
        chai.expect(userEntity.salt, 'userEntity.salt').to.be.ok;
        chai.expect(userEntity.uuid, 'userEntity.uuid').to.be.ok;
      });
    });

    it('requires authentication', async () => {
      await chai
        .expect(context.client.post('/users/', payload))
        .eventually.rejectedWith('Request failed with status code 401');
    });
  });
});
