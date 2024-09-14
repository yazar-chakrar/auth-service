import express, { Router } from 'express';
import { health } from '@auth/health/health.controllers';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/health', health);

  return router;
}
