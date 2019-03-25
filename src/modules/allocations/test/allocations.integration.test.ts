/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chai from 'chai';
import _ from 'lodash';
import { BaseFixture, initTestContext, TestContext } from '~/modules/common/test';

import { Allocation } from '../allocation.entity';
import { AllocationCreateRequest, AllocationUpdateRequest } from '../allocations.dto';

// the default difference between these two dates is 24 hours
const getPayload = (
  entities: BaseFixture,
  addFromHours = 0,
  addToHours = 0,
  props: Array<keyof AllocationUpdateRequest> = [],
): Partial<AllocationCreateRequest> => {
  const payload = {
    allocatedTo: entities.user.email,
    assetUuid: entities.asset.uuid,
    from: new Date(Date.parse('2020-03-25T15:00:00z') + addFromHours * 60 * 1000 * 60),
    to: addToHours === null ? null : new Date(Date.parse('2020-03-26T15:00:00z') + addToHours * 60 * 1000 * 60),
  };
  return props.length === 0 ? payload : _.pick(payload, ...props);
};

const assertEntityAndPayloadMatch = (entity: Allocation, payload: Partial<AllocationCreateRequest>) => {
  const propsFromEntity = {
    allocatedTo: entity.allocatedTo.email,
    assetUuid: entity.asset.uuid,
    from: Date.parse((entity.from as any) as string),
    to: entity.to ? Date.parse((entity.to as any) as string) : null,
  };
  const propsFromPayload = {
    ...payload,
    ...(payload.to ? { to: payload.to.getTime() } : {}),
    ...(payload.from ? { from: payload.from.getTime() } : {}),
  };

  chai.expect(propsFromEntity).to.contain(propsFromPayload);
};

describe('Allocations Integration Tests', async () => {
  let context: TestContext;

  before(async function() {
    this.timeout(15000);
    context = await initTestContext();
    await context.db.clear.all();
  });

  afterEach(async () => {
    await context.db.clear.all();
  });

  describe('requires authentication', () => {
    const endpoints = [
      { endpoint: '/allocations/', method: 'get' },
      { endpoint: '/allocations/12345678-aaaa-eeee-8888-abcdef123456', method: 'get' },
      { endpoint: '/allocations/', method: 'post' },
      { endpoint: '/allocations/12345678-aaaa-eeee-8888-abcdef123456', method: 'delete' },
      { endpoint: '/allocations/12345678-aaaa-eeee-8888-abcdef123456', method: 'put' },
    ];
    endpoints.forEach(x => {
      it(`when calling ${x.endpoint} with ${x.method} method`, async () => {
        await chai
          .expect(context.client[x.method](x.endpoint))
          .eventually.rejectedWith('Request failed with status code 401');
      });
    });
  });

  describe('Create', () => {
    let entities: BaseFixture;
    beforeEach(async () => {
      entities = await context.db.insertBaseFixture();
    });
    it('create simple allocations', async () => {
      const allocation1 = await context.authClient.post('/allocations/', getPayload(entities));
      const allocation2 = await context.authClient.post('/allocations/', getPayload(entities, 48, 48));
      const allocation3 = await context.authClient.post('/allocations/', getPayload(entities, -48, -48));
      assertEntityAndPayloadMatch(allocation1.data, getPayload(entities));
      assertEntityAndPayloadMatch(allocation2.data, getPayload(entities, 48, 48));
      assertEntityAndPayloadMatch(allocation3.data, getPayload(entities, -48, -48));
    });
    it('create with infinitive allocations', async () => {
      const allocation1 = await context.authClient.post('/allocations/', getPayload(entities));
      const allocation2 = await context.authClient.post('/allocations/', getPayload(entities, 48, null));
      const allocation3 = await context.authClient.post('/allocations/', getPayload(entities, -48, -48));
      assertEntityAndPayloadMatch(allocation1.data, getPayload(entities));
      assertEntityAndPayloadMatch(allocation2.data, getPayload(entities, 48, null));
      assertEntityAndPayloadMatch(allocation3.data, getPayload(entities, -48, -48));
    });
    const tests = [
      { when: 'range is equal', addFrom1: 0, addTo1: 0, addFrom2: 0, addTo2: 0 },
      { when: 'range is smaller', addFrom1: 0, addTo1: 30, addFrom2: 10, addTo2: 20 },
      { when: 'range is bigger', addFrom1: 0, addTo1: 0, addFrom2: -10, addTo2: 20 },
      { when: 'range conflicts with the beginning of other range', addFrom1: 0, addTo1: 0, addFrom2: -40, addTo2: -10 },
      { when: 'range conflicts with the end of other range', addFrom1: 0, addTo1: 0, addFrom2: 10, addTo2: 48 },
      { when: 'both range are infinitive', addFrom1: 0, addTo1: null, addFrom2: 40, addTo2: null },
      { when: 'falls withing infinitive range', addFrom1: 0, addTo1: null, addFrom2: 40, addTo2: 50 },
      { when: 'infinitive range conflicts with existing', addFrom1: 0, addTo1: 0, addFrom2: -40, addTo2: null },
    ];
    tests.forEach(test => {
      it(`should not allow to create allocation when ${test.when}`, async () => {
        await context.authClient.post('/allocations/', getPayload(entities, test.addFrom1, test.addTo1));
        await chai
          .expect(context.authClient.post('/allocations/', getPayload(entities, test.addFrom2, test.addTo2)))
          .eventually.to.be.rejectedWith('Request failed with status code 409');
      });
    });
  });

  describe('Update', () => {
    let entities1: BaseFixture;
    let entities2: BaseFixture;
    beforeEach(async () => {
      entities1 = await context.db.insertBaseFixture();
      entities2 = await context.db.insertBaseFixture('second');
    });

    const props: Array<Array<keyof AllocationUpdateRequest>> = [
      ['allocatedTo'],
      ['assetUuid'],
      ['from'],
      ['to'],
      ['allocatedTo', 'from'],
      ['allocatedTo', 'assetUuid', 'from', 'to'],
    ];
    props.forEach(prop => {
      it(`update allocation, changing '${prop.join(', ')}'`, async () => {
        const res1 = await context.authClient.post('/allocations/', getPayload(entities1));
        const { uuid } = res1.data;
        const res2 = await context.authClient.put('/allocations/' + uuid, getPayload(entities2, 0, 0, prop));
        assertEntityAndPayloadMatch(res1.data, getPayload(entities1));
        assertEntityAndPayloadMatch(res2.data, getPayload(entities2, 0, 0, prop));
      });
    });

    it('should not allow update asset to allocated', async () => {
      await context.authClient.post('/allocations/', getPayload(entities1));
      const allocation2 = await context.authClient.post('/allocations/', getPayload(entities2));

      const { uuid } = allocation2.data;
      const updateRequest = context.authClient.put('/allocations/' + uuid, getPayload(entities1, 0, 0, ['assetUuid']));
      await chai.expect(updateRequest).eventually.to.be.rejectedWith('Request failed with status code 409');
    });

    const tests = [
      { when: 'range is equal', addFrom1: 0, addTo1: 0, addFrom2: 0, addTo2: 0 },
      { when: 'range is smaller', addFrom1: 0, addTo1: 30, addFrom2: 10, addTo2: 20 },
      { when: 'range is bigger', addFrom1: 0, addTo1: 0, addFrom2: -10, addTo2: 20 },
      {
        when: 'range conflicts with the beginning of other range',
        addFrom1: 0,
        addTo1: 0,
        addFrom2: -40,
        addTo2: -10,
      },
      { when: 'range conflicts with the end of other range', addFrom1: 0, addTo1: 0, addFrom2: 10, addTo2: 48 },
      { when: 'both range are infinitive', addFrom1: 0, addTo1: null, addFrom2: 40, addTo2: null },
      { when: 'falls withing infinitive range', addFrom1: 0, addTo1: null, addFrom2: 40, addTo2: 50 },
      { when: 'infinitive range conflicts with existing', addFrom1: 0, addTo1: 0, addFrom2: -40, addTo2: null },
    ];
    tests.forEach(test => {
      it(`should not allow to create allocation when ${test.when}`, async () => {
        await context.authClient.post('/allocations/', getPayload(entities1, test.addFrom1, test.addTo1, []));

        const allocation = await context.authClient.post('/allocations/', getPayload(entities1, -100, -100, []));

        const updateRequest = context.authClient.put(
          '/allocations/' + allocation.data.uuid,
          getPayload(entities1, test.addFrom2, test.addTo2, ['to', 'from']),
        );

        await chai.expect(updateRequest).eventually.to.be.rejectedWith('Request failed with status code 409');
      });
    });
  });
});
