import { createPipeline, createSyncPipeline } from '../createPipeline';


interface IPromiseFnType {
  ({ config }: { config: number }): Promise<number>;
  callTime: number;
}

let fnQueue: number[] = [];
const clearQ = () => fnQueue = [];

const iPromise = jest.fn(() => {
  // @ts-ignore
  const resFn: IPromiseFnType = ({ config: i }: { config: number }) => new Promise((res) => {
    Object.defineProperty(resFn, 'callTime', { value: +new Date(), writable: true, configurable: true });
    fnQueue.push(i);
    return res(i);
  });

  return resFn;
});

const firstOp = {
  operation: iPromise(),
  config: 1,
};

const secondOp = {
  operation: iPromise(),
  config: 2,
};

const thirdOp = {
  operation: iPromise(),
  config: 3,
};

const operations = [secondOp, firstOp, thirdOp];

afterEach(() => {
  jest.clearAllMocks();
  clearQ();
});

describe('createPipeline module', () => {
  describe('createPipeline async', () => {
    it('should create async pipeline', async () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date(+new Date));

      const asyncPipeline = await createPipeline(operations);

      jest
        .useRealTimers()
        .setSystemTime(new Date(+new Date));

      expect(asyncPipeline).toEqual([2, 1, 3]);

      expect(firstOp.operation.callTime)
        .toBeCloseTo(secondOp.operation.callTime, -1);

      expect(firstOp.operation.callTime)
        .toBeCloseTo(thirdOp.operation.callTime, -1);

      expect(fnQueue).toEqual([2, 1, 3]);
    });
  });

  describe('createSyncPipeline', () => {
    it('should create sync pipeline', async () => {
      const syncPipeline = await createSyncPipeline(operations);
      expect(syncPipeline).toEqual(3);

      expect(firstOp.operation.callTime)
        .toEqual(thirdOp.operation.callTime);

      expect(firstOp.operation.callTime)
        .toEqual(secondOp.operation.callTime);

      expect(fnQueue).toEqual([2, 1, 3]);
    });
  });
});
