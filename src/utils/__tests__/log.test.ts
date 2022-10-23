import * as logFunctions from '../log';


beforeAll(() => {
  logFunctions.enableLog();
  jest.spyOn(logFunctions, 'log');
});

afterEach(() => {
  jest.clearAllMocks();
  logFunctions.enableLog();
});

describe('log functions', () => {
  describe('networkLog', () => {
    it('should call log with network color', () => {
      logFunctions.networkLog('network test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[34m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Network saying: network test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.networkLog('network test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('parserLog', () => {
    it('should call log with parser color', () => {
      logFunctions.parserLog('parser test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[34m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Parser saying: parser test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.parserLog('parser test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('utilsLog', () => {
    it('should call log with utils color', () => {
      logFunctions.utilsLog('utils test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[33m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Utils saying: utils test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.utilsLog('utils test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('apiLog', () => {
    it('should call log with api color', () => {
      logFunctions.apiLog('api test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[35m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('API saying: api test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.apiLog('utils test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('errorLog', () => {
    it('should call log with error color', () => {
      logFunctions.errorLog('error test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[31m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Error: error test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.errorLog('utils test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('mongoLog', () => {
    it('should call log with error color', () => {
      logFunctions.mongoLog('mongo test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[32m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Mongo saying: mongo test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.mongoLog('mongo test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('redisLog', () => {
    it('should call log with error color', () => {
      logFunctions.redisLog('redis test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[35m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('Redis saying: redis test');
    });
    it('should not call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.redisLog('redis test');
      expect((logFunctions.log as jest.Mock).mock.calls.length).toEqual(0);
    });
  });

  describe('debugLog', () => {
    it('should call log with error color', () => {
      logFunctions.debugLog('debug test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][0]).toEqual('\x1b[36m%s\x1b[36m');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('DEBUG: debug test');
    });
    it('should call log if log is disabled', () => {
      logFunctions.disableLog();
      logFunctions.debugLog('debug test');
      expect((logFunctions.log as jest.Mock).mock.calls[0][1]).toEqual('DEBUG: debug test');
    });
  });
});
