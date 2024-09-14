import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import { Application, Request, Response, NextFunction } from 'express';
import { config } from '@auth/config/config';
import { IAuthPayload } from '@yazar-chakrar/brikoula-shared';

export const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};
