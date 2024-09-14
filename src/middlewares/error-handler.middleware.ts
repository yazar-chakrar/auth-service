import { CustomError, IErrorResponse } from '@yazar-chakrar/brikoula-shared';
import { Application, NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export const errorHandlerMiddleware = (app: Application, log: Logger): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `AuthService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};
