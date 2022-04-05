import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

export const AppDataSource = new DataSource({
  entities: [Task, User],
  synchronize: true,
  logging: false,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task-management',
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log('Created Succesfuly');
  })
  .catch((error) => console.log(error));
