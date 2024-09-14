import http from 'http';

import { Application } from 'express';
import { Logger } from 'winston';
import { winstonLogger } from '@yazar-chakrar/brikoula-shared';
import { config } from '@auth/config/config';
import { securityMiddleware, standardMiddleware, errorHandlerMiddleware } from '@auth/middlewares';
import { checkElasticConnection } from '@auth/elasticsearch/elasticsearch';
import { appRoutes } from '@auth/routes';
import { createQueueConnection } from '@auth/queues/connection';
import { Channel } from 'amqplib';

const SERVER_PORT = config.SERVER_PORT;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export let authChannel: Channel;

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  appRoutes(app);
  checkElasticConnection();
  startQueues();
  errorHandlerMiddleware(app, log);
  startServer(app);
}

function startServer(app: Application) {
  try {
    const httpServer: http.Server = new http.Server(app);
    startHttpServer(httpServer);
  } catch (error) {
    log.log('error', 'AuthService startServer() error method:', error);
  }
}

function startHttpServer(httpServer: http.Server) {
  try {
    log.info(`Auth server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Auth server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'AuthService startServer() error method:', error);
  }
}

async function startQueues(): Promise<void> {
  authChannel = (await createQueueConnection()) as Channel;
}
