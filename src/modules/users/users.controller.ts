import { inject } from 'inversify';
import { Get, Route } from 'tsoa';
import { provideSingleton, injectRepository } from '~/ioc/container';
import { IDbConnection } from '~/server/database';

import { User } from './user.entity';
import { TYPES } from '~/ioc/types';
import { Repository } from 'typeorm';

@Route('users')
@provideSingleton(UsersController)
export class UsersController {
  constructor(
    @inject(TYPES.DB) private readonly dbConnection: IDbConnection,
    @injectRepository(User) private readonly repository: Repository<User>,
  ) {}

  @Get('')
  public async getUser(): Promise<User[]> {
    // const model = await audioMetadataService.get();
    // const repository = this.dbConnection.db.getRepository(User);
    await this.repository.insert({
      firstName: 'tests',
      lastName: 'ccccccccccc',
      age: 22,
    });
    return await this.repository.find();
  }
}

// export function getUsersRouter(
//   dbConnection: IDbConnection,
//   // audioMetadataService = audioMetadataServiceFactory(dbConnection),
// ): Router {
//   const router = express.Router();

//   router.get('/', async (req, res) => {
//     // const model = await audioMetadataService.get();
//     const repository = dbConnection.db.getRepository(User);
//     await repository.insert({
//       firstName: 'tests',
//       lastName: 'askdjaksjdkasjdk',
//       age: 22,
//     });
//     res.json(await repository.find());
//   });

//   // /* GET audio metadata. */
//   // router.get('/:audioId', async (req, res) => {
//   //   const model = await audioMetadataService.load(req.params.audioId);
//   //   res.json(model);
//   // });

//   // /* Update audio metadata. */
//   // router.put('/:audioId', async (req, res) => {
//   //   const updated = await audioMetadataService.update(req.params.audioId, req.body);
//   //   res.json(updated);
//   // });

//   return router;
// }
