import { config } from '@auth/config/config';
import { winstonLogger } from '@yazar-chakrar/brikoula-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authQueueConnection', 'debug');

async function createQueueConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Auth server connected to queue successfully...');
    closeQueueConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'AuthService error createQueueConnection() method:', error);
    return undefined;
  }
}

function closeQueueConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createQueueConnection };
