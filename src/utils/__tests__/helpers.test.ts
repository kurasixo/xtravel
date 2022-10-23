import { isDebug, isDev } from '../helpers';


describe('helpers', () => {
  describe('isDebug', () => {
    it('should return false if env is not debug', () => {
      process.env.NODE_ENV = 'development';
      expect(isDebug()).toEqual(false);
    });

    it('should return true if env is debug', () => {
      process.env.NODE_ENV = 'debug';
      expect(isDebug()).toEqual(true);
    });
  });

  describe('isDev', () => {
    it('should return false if env is not development', () => {
      process.env.NODE_ENV = 'production';
      expect(isDev()).toEqual(false);
    });

    it('should return true if env is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isDev()).toEqual(true);
    });
  });
});
