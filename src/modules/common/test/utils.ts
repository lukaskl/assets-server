/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon from 'sinon';
import stringifyObject from 'stringify-object';
import { Repository } from 'typeorm';
import uuid from 'uuid/v4';

interface NoParamConstructor<T> {
  new (...args: any[]): T;
}

export function stringify(obj: {}, singleLine: boolean = true): string {
  const result = stringifyObject(obj, {
    indent: '  ',
    singleQuotes: true,
    inlineCharacterLimit: 80,
  });
  if (singleLine) {
    return result.replace(/\n/g, ' ').replace(/\r/g, '');
  }
  return result;
}

export const getFakeRepository = <T>(type: NoParamConstructor<T>) => {
  const keys = Object.keys(new type()) as Array<keyof T>;
  const typeWithId = () => Object.assign(new type(), { id: 1, uuid: uuid() });
  const repository = {
    metadata: { columns: keys.map(x => ({ propertyName: x })) } as any,
    create: sinon.spy((args: any) => Object.assign(new type(), args)),
    update: sinon.spy((args: any) => Object.assign(typeWithId(), args)),
    insert: sinon.spy(() => ({ identifiers: [{ id: 1 }] })),
    find: sinon.spy(() => typeWithId()),
    findOne: sinon.spy(() => typeWithId()),
    delete: sinon.spy(() => {
      affected: 1;
    }),
  };

  return Object.assign((repository as any) as Repository<T>, { mock: repository });
};
