/* eslint-disable @typescript-eslint/no-explicit-any */
import chai from 'chai';
import { IsEmail, Length } from 'class-validator';
import { Repository } from 'typeorm';

import { BaseService } from '../BaseService';
import { IModel } from '../model';
import { UserError } from '../UserError';
import { ValidationError } from '../ValidationError';
import { getFakeRepository, stringify } from './utils';

const testUuid = '12345678-aaaa-eeee-8888-abcdef123456';

class DummyEntity implements IModel {
  id: number;

  uuid: string;

  @Length(2, 100)
  name?: string;

  @IsEmail()
  email: string;
}

class DummyService extends BaseService<DummyEntity> {
  constructor(repository: Repository<DummyEntity>) {
    super(repository);
  }
}

describe('Base Service Unit Tests', () => {
  describe('Create ', () => {
    it('returns inserted model', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai.expect(service.create({ name: 'tas', email: 'test@tte.com' })).eventually.contain({ id: 1 });
      chai.expect(repository.mock.create.callCount).be.eq(1, 'repository.mock.create.callCount');
      chai.expect(repository.mock.findOne.callCount).be.eq(1, 'repository.mock.findOne.callCount');
      chai.expect(repository.mock.insert.callCount).be.eq(1, 'repository.mock.insert.callCount');
    });

    it('validates model', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai.expect(service.create({ name: 'tas', email: 'test@tte.com' })).eventually.contain({ id: 1 });
      await chai.expect(service.create({ name: 'tas', email: 'test@tte' })).eventually.rejectedWith(ValidationError);
      await chai.expect(service.create({ name: 't', email: 'test@test.com' })).eventually.rejectedWith(ValidationError);
      await chai.expect(service.create({ email: 'test@test.com' })).eventually.rejectedWith(ValidationError);
    });

    it('assigns new UUID', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await service.create({ uuid: testUuid, name: 'tas', email: 'test@tte.com' });
      const model = (repository.mock.insert.args[0] as any)[0];
      chai.expect(model).not.contain({ uuid: testUuid });
      chai.expect(model.uuid).match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    });
  });

  describe('Read ', () => {
    it('requires uuid', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai.expect(service.read('')).eventually.rejectedWith(UserError);
      await chai.expect(service.read('not an uuid')).eventually.rejectedWith(UserError);
    });
    it('finds by uuid', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await service.read(testUuid);
      chai.expect(repository.mock.findOne.callCount).to.eq(1, 'repository.mock.findOne.callCount');
      const model = (repository.mock.findOne.args[0] as any)[0];
      chai.expect(model).to.eql({
        where: {
          uuid: testUuid,
        },
      });
    });
  });

  describe('Read All', () => {
    const defaultPagination = { skip: 0, take: 100 };
    const paginationTests = [
      { pagination: undefined, expected: defaultPagination },
      { pagination: {}, expected: defaultPagination },
      { pagination: { skip: -10 }, expected: defaultPagination },
      { pagination: { skip: undefined }, expected: defaultPagination },
      { pagination: { take: undefined }, expected: defaultPagination },
      { pagination: { take: -10 }, expected: defaultPagination },
      { pagination: { take: 0 }, expected: defaultPagination },
      { pagination: { take: 1000 }, expected: defaultPagination },
      { pagination: { skip: 10, take: 10 }, expected: { skip: 10, take: 10 } },
    ];
    paginationTests.forEach(test => {
      it(`paginate with ${
        test.expected === defaultPagination ? 'default' : JSON.stringify(test.expected)
      } parameters when '${stringify(test.pagination)}' passed`, async () => {
        const repository = getFakeRepository(DummyEntity);
        const service = new DummyService(repository);
        await service.readAll(test.pagination);
        chai.expect(repository.mock.find.callCount).to.eq(1, 'repository.mock.find.callCount');
        const model = (repository.mock.find.args[0] as any)[0];
        chai.expect(model).to.eql({
          ...test.expected,
        });
      });
    });
  });

  describe('Update ', () => {
    it('requires uuid', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai.expect(service.update('', { name: 'test' })).eventually.rejectedWith(UserError);
    });
    it('does not allow to change UUID', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await service.update(testUuid, { uuid: 'fake-uuid', name: 'tas', email: 'test@tte.com' });
      const model = (repository.mock.update.args[0] as any)[1];
      chai.expect(model).to.eql({ name: 'tas', email: 'test@tte.com' });
    });

    it('validates model', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai
        .expect(service.update(testUuid, { uuid: 'fake-uuid', name: 't', email: 'test@tte.com' }))
        .eventually.rejectedWith(ValidationError);

      await chai
        .expect(service.update(testUuid, { uuid: 'fake-uuid', name: 'ta', email: 'test@tte.' }))
        .eventually.rejectedWith(ValidationError);

      chai.expect(repository.mock.update.callCount).to.be.eq(0, 'repository.mock.update.callCount');
    });

    it('allows empty properties', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);

      await chai.expect(service.update(testUuid, { email: 'test@test.com' })).eventually.contain({ id: 1 });

      const model = (repository.mock.update.args[0] as any)[1];
      chai.expect(model).to.eql({ email: 'test@test.com' });
      chai.expect(repository.mock.update.callCount).to.be.eq(1, 'repository.mock.update.callCount');
    });
  });

  describe('Delete', () => {
    it('requires uuid', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await chai.expect(service.delete('')).eventually.rejectedWith(UserError);
    });
    it('deletes by uuid', async () => {
      const repository = getFakeRepository(DummyEntity);
      const service = new DummyService(repository);
      await service.delete(testUuid);
      chai.expect(repository.mock.delete.callCount).to.eq(1, 'repository.mock.delete.callCount');
      const model = (repository.mock.delete.args[0] as any)[0];
      chai.expect(model).to.eql({
        uuid: testUuid,
      });
    });
  });
});
