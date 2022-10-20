import type { FnPromiseType } from '../../types';
import { normalizeHtmlContent } from './normalizeHtmlContent';
import { connectRedis } from './redis/utils';


type ValueFromCache = { content: string; timestamp: number };

const TWENTY_FOUR_HOURS = 2 * 12 * 60 * 60 * 1000;

const hashFn = (args: unknown[]): string => {
  return JSON.stringify(args);
};

const objectToString = <T>(object: T): string => {
  return JSON.stringify(object);
};

const stringToObject = <T>(string: string | null): T | null => {
  if (string === null) {
    return null;
  }

  return JSON.parse(string);
};

const putToCache = (key: string, value: ValueFromCache) => {
  return connectRedis().then((redisClient) => {
    return redisClient.set(key, objectToString(value));
  });
};

const getFromCache = (key: string) => {
  return connectRedis().then((redisClient) => {
    return redisClient.get(key);
  });
};

export const memoNetworkWithCache = (
  fnPromise: FnPromiseType<string>,
  refreshTime = TWENTY_FOUR_HOURS,
) => {
  const resFunc: typeof fnPromise = async (...args) => {
    const hashedArgs = hashFn(args);
    const valueFromStorage = stringToObject<ValueFromCache>(await getFromCache(hashedArgs));

    if (valueFromStorage && Date.now() - valueFromStorage.timestamp < refreshTime) {
      return new Promise((resolvePromiseWith) => resolvePromiseWith(valueFromStorage.content));
    }

    return fnPromise(...args).then((response) => {
      const newContent = normalizeHtmlContent(response);
      return putToCache(hashedArgs, { content: newContent, timestamp: Date.now() })
        .then(() => newContent);
    });
  };

  return resFunc;
};
