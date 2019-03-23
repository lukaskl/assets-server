import { Container, inject, interfaces } from 'inversify';
import { autoProvide, makeFluentProvideDecorator, makeProvideDecorator } from 'inversify-binding-decorators';
import { IDbConnection } from '~/server/database';

import { TYPES } from './types';
import { Repository } from 'typeorm';

let container = new Container();

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideNamed = function(
  identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
  name: string,
) {
  return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done();
};

let provideSingleton = function(identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) {
  return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

export function getRepositoryToken(entity: Function) {
  return `${entity.name}Repository`;
}

let provideRepository = function(entity: Function) {
  return fluentProvider(getRepositoryToken(entity))
    .onActivation(ctx => ctx.container.get<IDbConnection>(TYPES.DB).db.getRepository(entity))
    .done();
};

let injectRepository = function(entity: Function) {
  return inject(getRepositoryToken(entity));
};

export {
  container as iocContainer,
  provideRepository,
  injectRepository,
  autoProvide,
  provide,
  provideSingleton,
  provideNamed,
  inject,
};
