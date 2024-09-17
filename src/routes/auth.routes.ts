import { changePassword, forgotPassword, resetPassword } from '@auth/controllers/password.controller';
import { signin } from '@auth/controllers/signin.controller';
import { signup } from '@auth/controllers/signup.controller';
import { update } from '@auth/controllers/verify-email.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', signup);
  router.post('/signin', signin);
  router.put('/verify-email', update);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
}
