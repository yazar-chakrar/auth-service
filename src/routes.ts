import { Application } from 'express';
import { healthRoutes } from '@auth/health/health.route';
// import { verifyGatewayRequest } from '@yazar-chakrar/brikoula-shared';
import { authRoutes } from '@auth/routes/auth.routes';

const BASE_PATH = '/api/v1/auth';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes());

  app.use(BASE_PATH, /* verifyGatewayRequest, */ authRoutes());
};
