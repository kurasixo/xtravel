let isLogEnabled = process.env.NODE_ENV !== 'test';
const createEnableLogger = () => {

  const disableLog = () => {
    isLogEnabled = false;
  };

  const enableLog = () => {
    isLogEnabled = true;
  };

  return { isLogEnabled, disableLog, enableLog };
};

export const { disableLog, enableLog } = createEnableLogger();

export const specialChar = '\x1b[36m';
export const colors = {
  // FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  // FgWhite: '\x1b[37m',
};

export const log = console.log;

export const networkLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgBlue}%s${specialChar}`, `Network saying: ${message}`, ...rest);
  }
};

export const parserLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgBlue}%s${specialChar}`, `Parser saying: ${message}`, ...rest);
  }
};

export const utilsLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgYellow}%s${specialChar}`, `Utils saying: ${message}`, ...rest);
  }
};

export const apiLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgMagenta}%s${specialChar}`, `API saying: ${message}`, ...rest);
  }
};

export const errorLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgRed}%s${specialChar}`, `Error: ${message}`, ...rest);
  }
};

export const mongoLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgGreen}%s${specialChar}`, `Mongo saying: ${message}`, ...rest);
  }
};

export const redisLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgMagenta}%s${specialChar}`, `Redis saying: ${message}`, ...rest);
  }
};

export const debugLog: typeof log = (message, ...rest) => {
  log(`${colors.FgCyan}%s${specialChar}`, `DEBUG: ${message}`, ...rest);
};
