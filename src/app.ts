import express, { Express } from 'express';
import { databaseConnection } from '@auth/database/database';
import { start } from '@auth/server';

const initialize = (): void => {
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
