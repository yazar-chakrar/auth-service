import { config } from '@auth/config/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createQueueConnection } from '@auth/queues/connection';
import { winstonLogger } from '@yazar-chakrar/brikoula-shared';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'AuthService Provider publishDirectMessage() method error:', error);
  }
}
