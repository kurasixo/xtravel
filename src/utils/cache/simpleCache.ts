import { resolve } from 'node:path';
import { utilsLog } from '../log';
import { readFileSync, writeFileSync } from 'node:fs';
import type { FnPromiseType } from '../../types';
import { normalizeHtmlContent } from './normalizeHtmlContent';


type PromiseStorageValue = {
  content: unknown;
  timestamp: number;
}

const TWENTY_FOUR_HOURS = 2 * 12 * 60 * 60 * 1000;

const resolveCacheJson = (name: string) => {
  return resolve(__dirname, `../../../${name}`);
};

const hashFn = (args: unknown[]): string => {
  return JSON.stringify(args);
};

const fileToObject = <T>(rawFile: string): T => {
  return JSON.parse(rawFile);
};

const objectToString = <T>(object: T): string => {
  return JSON.stringify(object);
};

// const stringToObject = <T>(string: string): T => {
//   return JSON.parse(string);
// };

const putToCache = async (
  storage: Record<string, PromiseStorageValue>,
  key: string,
  value: PromiseStorageValue,
) => {
  storage[key] = value;
  // await redisClient.set(key, objectToString(value))
};

const getFromCache = async (
  storage: Record<string, PromiseStorageValue>,
  key: string,
) => {
  return storage[key];
  // return stringToObject(await redisClient.get(key))
};

export const memoNetworkWithCache = (
  fnPromise: FnPromiseType<string>,

  cacheName = 'simpleCache.json',
  refreshTime = TWENTY_FOUR_HOURS,
) => {
  const rawFile = readFileSync(
    resolveCacheJson(cacheName),
    { encoding: 'utf-8' },
  );
  const promiseStorage: Record<string, PromiseStorageValue> = fileToObject(rawFile);

  const resFunc: typeof fnPromise = async (...args) => {
    const hashedArgs = hashFn(args);
    const valueFromStorage = await getFromCache(promiseStorage, hashedArgs);

    if (valueFromStorage && Date.now() - valueFromStorage.timestamp < refreshTime) {
      utilsLog(`using value from cache: ${cacheName}`);
      return new Promise((resolvePromiseWith) => resolvePromiseWith(valueFromStorage.content as string));
    }

    return fnPromise(...args).then((response) => {
      const newContent = normalizeHtmlContent(response);
      return putToCache(promiseStorage, hashedArgs, { content: newContent, timestamp: Date.now() })
        .then(() => {
          writeFileSync(
            objectToString(promiseStorage),
            resolveCacheJson(cacheName),
            { encoding: 'utf-8' },
          );

          return newContent;
        });
    });
  };

  return resFunc;
};
