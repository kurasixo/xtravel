import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

import { redisLog } from '../../log';


const redisUri = 'redis://localhost:6379';

const getUtilsForRedisConnection = () => {
  const client: RedisClientType = createClient({ url: redisUri });
  let isConnected = false;

  const connectRedis = () => {
    if (!isConnected) {
      isConnected = true;
      return client.connect().then(() => {
        redisLog('connected to redis');
        return client;
      });
    }

    redisLog('redis is already connected');
    return new Promise<RedisClientType>((resolveWith) => resolveWith(client));
  };

  const disconnectRedis = () => {
    if (!isConnected) {
      redisLog('redis is not connected');
      throw new Error('redis is not connected');
    }

    return client.disconnect().then(() => {
      redisLog('disconnected to redis');
      return client;
    });
  };

  return { connectRedis, disconnectRedis };
};

export const { connectRedis, disconnectRedis } = getUtilsForRedisConnection();
