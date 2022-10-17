import { resolve } from 'node:path';
import { utilsLog } from './log';
import { readFileSync, writeFileSync } from 'node:fs';
import type { FnPromiseType } from '../types';
import { normalizeHtmlContent } from './normalizeHtmlContent';


type PromiseStorageValue = {
  content: unknown;
  timestamp: number;
}


const TWENTY_FOUR_HOURS = 2 * 12 * 60 * 60 * 1000;

const resolveCacheJson = (name: string) => {
  return resolve(__dirname, `../../${name}`);
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

  const resFunc: typeof fnPromise = (...args) => {
    const hashedArgs = hashFn(args);
    const valueFromStorage = promiseStorage[hashedArgs];

    if (valueFromStorage && Date.now() - valueFromStorage.timestamp < refreshTime) {
      utilsLog(`using value from cache: ${cacheName}`);
      return new Promise((resolvePromiseWith) => resolvePromiseWith(valueFromStorage.content as string));
    }

    return fnPromise(...args).then((response) => {
      const newContent = normalizeHtmlContent(response);
      promiseStorage[hashedArgs] = { content: newContent, timestamp: Date.now() };
      writeFileSync(
        resolveCacheJson(cacheName),
        objectToString(promiseStorage),
        { encoding: 'utf-8' },
      );

      return newContent;
    });
  };

  return resFunc;
};
