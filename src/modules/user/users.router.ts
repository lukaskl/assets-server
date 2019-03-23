import express, { Router } from 'express';
import { IDbConnection } from '~/server/database';
import { User } from './User';

// import audioMetadataServiceFactory from './users.service';

export function getUsersRouter(
  dbConnection: IDbConnection,
  // audioMetadataService = audioMetadataServiceFactory(dbConnection),
): Router {
  const router = express.Router();

  router.get('/', async (req, res) => {
    // const model = await audioMetadataService.get();
    const repository = dbConnection.db.getRepository(User);
    await repository.insert({
      firstName: 'tests',
      lastName: 'askdjaksjdkasjdk',
      age: 22,
    });
    res.json(await repository.find());
  });

  // /* GET audio metadata. */
  // router.get('/:audioId', async (req, res) => {
  //   const model = await audioMetadataService.load(req.params.audioId);
  //   res.json(model);
  // });

  // /* Update audio metadata. */
  // router.put('/:audioId', async (req, res) => {
  //   const updated = await audioMetadataService.update(req.params.audioId, req.body);
  //   res.json(updated);
  // });

  return router;
}
