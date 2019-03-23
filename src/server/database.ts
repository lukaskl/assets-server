/* eslint-disable no-console */
import 'reflect-metadata';

import { Connection, createConnection } from 'typeorm';
import { entities } from '~/modules';

export interface IDbConnection {
  db: Connection;
}

export interface IDbInitConfig {
  host: string;
  port?: number;
  dbName: string;
  username: string;
  password: string;
  ensureDbExists?: boolean;
  syncSchema?: boolean;
}

const ensureDatabaseExists = async ({ dbName, host, port, username, password }: IDbInitConfig) => {
  let connection: Connection;
  try {
    connection = await createConnection({
      type: 'postgres',
      host,
      port,
      username: username,
      password: password,
      database: 'postgres',
      synchronize: false,
      logging: true,
      entities: [],
    });
    const isDbExisting = (await connection.query(`SELECT 1 from pg_database WHERE datname='${dbName}'`)).length === 1;
    console.log(
      isDbExisting
        ? `Database '${dbName}' already exists`
        : `Database '${dbName}' does not exist and it will be created`,
    );

    if (!isDbExisting) {
      await connection.query(`CREATE DATABASE "${dbName}"`);
    }
  } finally {
    connection && (await connection.close());
  }
};

export async function getConnection({
  dbName,
  host,
  port,
  username,
  password,
  syncSchema,
}: IDbInitConfig): Promise<IDbConnection> {
  const db = await createConnection({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database: dbName,
    synchronize: syncSchema,
    logging: false,
    entities: entities,
  });

  return { db };
}

export const initDb = async (config: IDbInitConfig): Promise<IDbConnection> => {
  if (config.ensureDbExists) {
    await ensureDatabaseExists(config);
  }
  return await getConnection(config);
};
