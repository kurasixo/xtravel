import { hashFn, objectToString, stringToObject } from '../redisCache';


jest.mock('../redis/utils', () => {
  const originalModule = jest.requireActual('../redis/utils');
  // eslint-disable-next-line
  const cache: Record<string, any> = {};

  const connectRedis = new Promise(resolve => resolve({
    get: jest.fn((key: string) => cache[key]),
    set: jest.fn((key: string, value) => cache[key] = value)
  }));

  return {
    __esModule: true,
    connectRedis,
    ...originalModule,
  };
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
});
