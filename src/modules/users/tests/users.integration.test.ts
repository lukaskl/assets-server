/* eslint-disable @typescript-eslint/no-explicit-any */
import { initTestServer } from '~/modules/common/test';
import { UserService } from '../users.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import chai from 'chai';
import _ from 'lodash';

const clearTable = async <T>(repository: Repository<T>) => {
  await repository.query(`DELETE FROM "${repository.metadata.tableName}"`);
};

describe('Users Integration Tests', async () => {
  let testServer: Unpacked<ReturnType<typeof initTestServer>>;
  let userService: UserService;
  let userRepository: Repository<User>;
  before(async function() {
    this.timeout(15000);
    testServer = await initTestServer();
    userRepository = testServer.getRepository(User);
    userService = new UserService(userRepository);
    await clearTable(userRepository);
  });

  afterEach(async () => {
    await clearTable(userRepository);
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
        const response = await testServer.authClient.post('/users/', payload);
        userDto = response.data;
        userEntity = await userService.readByEmail('test@test.com', true);
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
        .expect(testServer.client.post('/users/', payload))
        .eventually.rejectedWith('Request failed with status code 401');
    });
  });
});
