import express, { Express } from 'express';
import { databaseConnection } from '@auth/database/database';
import { start } from '@auth/server';
import { config } from '@auth/config/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
