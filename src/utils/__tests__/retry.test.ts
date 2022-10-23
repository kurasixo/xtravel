import * as retryModule from '../retry';


const simpleErrorFunction = jest.fn(() => {
  throw new Error('error');
});

const errorFunctionWithCondition = jest.fn((i) => {
  if (i === 3) {
    return 1;
  }

  throw new Error('error');
});

const promiseRejectFunc = jest.fn((i) => {
  const promise = new Promise((resolve, reject) => {
    if (i === 3) {
      resolve(3);
    } else {
      reject('promise error');
    }
  });

  return promise;
});

beforeAll(() => {
  jest.spyOn(retryModule, 'withRetryOnError');
  jest.spyOn(retryModule, 'asyncWithRetryOnError');
});

afterEach(() => {
  jest.clearAllMocks();
});


describe('utils test', () => {
  describe('isPromise', () => {
    it('should return true on promise', () => {
      const a = new Promise(() => {});
      expect(retryModule.isPromise(a)).toEqual(true);
    });

    it('should return false on number', () => {
      const a = 1;
      expect(retryModule.isPromise(a)).toEqual(false);
    });

    it('should return false on PlainObject', () => {
      const a = {};
      expect(retryModule.isPromise(a)).toEqual(false);
    });

    it('should return true on PromiseLike', () => {
      const a = {
        then: () => {},
        catch: () => {},
      };
      expect(retryModule.isPromise(a)).toEqual(true);
    });
  });

  describe('withRetryOnError', () => {
    it('should deal with simple error function', () => {
      const newFn = retryModule.withRetryOnError(simpleErrorFunction, 2);
      jest.clearAllMocks(); // dont count the first call of decorator

      expect(newFn).toThrowError('error');
      expect((retryModule.withRetryOnError as jest.Mock).mock.calls.length).toEqual(2);
    });

    it('should not retry', () => {
      const newFn = retryModule.withRetryOnError(simpleErrorFunction, 0);
      jest.clearAllMocks(); // dont count the first call of decorator

      expect(newFn).toThrowError('error');
      expect((retryModule.withRetryOnError as jest.Mock).mock.calls.length).toEqual(0);
    });

    describe('should retrun result after retries', () => {
      const newFn = retryModule.withRetryOnError(errorFunctionWithCondition, 2);
      for (let i = 1; i < 4; i++) {
        if (i !== 3) {
          it(`should throw result if i === ${i}`, () => {
            expect(() => newFn(i)).toThrowError('error');
            expect((retryModule.withRetryOnError as jest.Mock).mock.calls.length).toEqual(2);
            jest.clearAllMocks();
          });
        } else {
          it(`should retrun result if i === ${i}`, () => {
            expect(newFn(i)).toEqual(1);
            expect((retryModule.withRetryOnError as jest.Mock).mock.calls.length).toEqual(0);
            jest.clearAllMocks();
          });
        }
      }
    });
  });

  describe('should deal promise rejection', () => {
    const newFn = retryModule.asyncWithRetryOnError(promiseRejectFunc, 2);
    for (let i = 1; i < 4; i++) {
      if (i !== 3) {
        it(`should reject if i === ${i}`, async () => {
          await expect(newFn(i)).rejects.toEqual('promise error');
          expect((retryModule.asyncWithRetryOnError as jest.Mock).mock.calls.length).toEqual(2);
          jest.clearAllMocks();
        });
      } else {
        it(`should resolve if i === ${i}`, async () => {
          await expect(newFn(i)).resolves.toEqual(i);
          expect((retryModule.asyncWithRetryOnError as jest.Mock).mock.calls.length).toEqual(0);
          jest.clearAllMocks();
        });
      }
    }
  });
});
