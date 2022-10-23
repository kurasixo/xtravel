import * as redisUtils from '../redis/utils';
import {
  hashFn,
  objectToString,
  stringToObject,

  putToCache,
  getFromCache,

  memoNetworkWithCache,
} from '../redisCache';

// eslint-disable-next-line
let cache: Record<string, any> = {};
const getImplementation = jest.fn(
  (key: string) => cache[key] || null
);
const setImplementation = jest.fn(
  (key: string, value: { content: string, timestamp: number }) => {
    cache[key] = value;
  }
);

jest.spyOn(redisUtils, 'connectRedis')
  .mockImplementation(() => {
    return new Promise(resolve => resolve({
      get: getImplementation,
      // @ts-ignore
      set: setImplementation,
    }));
  });

jest.spyOn(redisUtils, 'disconnectRedis')
  // @ts-ignore
  .mockImplementation(() => {
    return new Promise<void>(resolve => resolve());
  });

const simpleFn = (a: number, b: number): Promise<string> =>
  new Promise((r) => r(`<div>${a} + ${b}</div>`));

beforeEach(() => {
  jest.clearAllMocks();
  cache = {};
});

describe('redisCache module', () => {
  describe('hashFn', () => {
    it('should strigify simple string params', () => {
      expect(hashFn(['str'])).toEqual('["str"]');
    });

    it('should strigify simple number params', () => {
      expect(hashFn([1])).toEqual('[1]');
    });

    it('should strigify simple array params', () => {
      expect(hashFn([1, 'string', ['args']])).toEqual('[1,"string",["args"]]');
    });

    it('should strigify simple object params', () => {
      expect(hashFn([{ a: 1, b: 2, c: 3 }])).toEqual('[{"a":1,"b":2,"c":3}]');
    });
  });

  describe('objectToString', () => {
    it('should strigify simple string params', () => {
      expect(objectToString(['str'])).toEqual('["str"]');
    });

    it('should strigify simple number params', () => {
      expect(objectToString([1])).toEqual('[1]');
    });

    it('should strigify simple array params', () => {
      expect(objectToString([1, 'string', ['args']])).toEqual('[1,"string",["args"]]');
    });

    it('should strigify simple object params', () => {
      expect(objectToString([{ a: 1, b: 2, c: 3 }])).toEqual('[{"a":1,"b":2,"c":3}]');
    });
  });

  describe('stringToObject', () => {
    it('should handle null', () => {
      expect(stringToObject(null)).toEqual(null);
    });

    it('should simple number', () => {
      expect(stringToObject('1')).toEqual(1);
    });

    it('should simple obj', () => {
      expect(stringToObject('{"a":1,"b":2,"c":3}')).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('stringToObject', () => {
    it('should handle null', () => {
      expect(stringToObject(null)).toEqual(null);
    });

    it('should simple number', () => {
      expect(stringToObject('1')).toEqual(1);
    });

    it('should simple obj', () => {
      expect(stringToObject('{"a":1,"b":2,"c":3}')).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('putToCache', () => {
    it('should put value to mocked cache', () => {
      const result = putToCache('key', { content: 'value', timestamp: 0 });

      result.then(() => {
        expect(cache['key']).toEqual(objectToString({ content: 'value', timestamp: 0 }));

        expect((redisUtils.connectRedis as jest.Mock).mock.calls.length).toEqual(1);
        expect((setImplementation as jest.Mock).mock.calls.length).toEqual(1);
      });
    });
  });

  describe('getFromCache', () => {
    it('should get value from mocked cache', () => {
      putToCache('key', { content: 'value', timestamp: 0 }).then(() => {
        const result = getFromCache('key');

        result.then((valueFromPromise) => {
          expect(cache['key']).toEqual(objectToString({ content: 'value', timestamp: 0 }));
          expect(valueFromPromise).toEqual(objectToString({ content: 'value', timestamp: 0 }));

          expect((redisUtils.connectRedis as jest.Mock).mock.calls.length).toEqual(2);
          expect((setImplementation as jest.Mock).mock.calls.length).toEqual(1);
          expect((getImplementation as jest.Mock).mock.calls.length).toEqual(1);
        });
      });
    });
  });

  describe('memoNetworkWithCache', () => {
    it('should create function with cache in redis', async () => {
      const fn = memoNetworkWithCache(simpleFn);

      fn(1, 2).then((firstResult) => {
        fn(1, 2)
          .then((secondResult) => {
            expect(firstResult).toEqual(secondResult);
            expect((setImplementation as jest.Mock).mock.calls.length).toEqual(1);
            expect((getImplementation as jest.Mock).mock.calls.length).toEqual(2);
          });
      });
    });

    it('should invalidate cache', async () => {
      const fn = memoNetworkWithCache(simpleFn);

      fn(1, 2).then((firstResult) => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date(+new Date + 2 * 12 * 60 * 60 * 1000 + 1000)); // 24h + 1sec

        fn(1, 2)
          .then((secondResult) => {
            expect(firstResult).toEqual(secondResult);
            expect((setImplementation as jest.Mock).mock.calls.length).toEqual(2);
            expect((getImplementation as jest.Mock).mock.calls.length).toEqual(2);
          });
      });
    });
  });
});
