import { IDbConnection } from '~/server/database';

import { getUsersRouter } from './user';

export default (dbConnection: IDbConnection) => [{ route: '/user', router: getUsersRouter(dbConnection) }];
