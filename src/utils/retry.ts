import { utilsLog } from './log';
import type { FnNotPromiseType, FnPromiseType } from '../types';


export const isPromise = (x: unknown): boolean => {
  return (
    x !== null &&
    typeof x === 'object' &&
    typeof (x as Promise<unknown> | Record<string, unknown>).then === 'function' &&
    typeof (x as Promise<unknown> | Record<string, unknown>).catch === 'function'
  );
};

export const asyncWithRetryOnError = <T>(
  fn: FnPromiseType<T>,
  retryCounts = 5,
) => {
  return (...args: Parameters<typeof fn>): ReturnType<typeof fn> => {
    return fn(...args)
      .catch((e) => {
        if (retryCounts > 0) {
          utilsLog('Catched error in promise', e.message, 'retrying...');
          return asyncWithRetryOnError(fn, retryCounts - 1)(...args);
        }

        throw e;
      });
  };
};

export const withRetryOnError = <T>(
  fn: FnNotPromiseType<T>,
  retryCounts = 5,
): typeof fn => {
  return (...args: Parameters<FnNotPromiseType<T>>) => {
    try {
      return fn(...args);
    } catch (e) {
      if (retryCounts > 0) {
        utilsLog('Catched error', e.message, 'retrying...');
        return withRetryOnError(fn, retryCounts - 1)(...args);
      }

      throw e;
    }
  };
};
