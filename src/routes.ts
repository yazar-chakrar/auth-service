import { Application } from 'express';
import { healthRoutes } from '@auth/health/health.route';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes());
};
