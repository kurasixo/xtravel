const createEnableLogger = () => {
  let isLogEnabled = true;
  const disableLog = () => {
    isLogEnabled = false;
  };

  const enableLog = () => {
    isLogEnabled = true;
  };

  return { isLogEnabled, disableLog, enableLog };
};

export const { isLogEnabled, disableLog, enableLog } = createEnableLogger();

const specialChar = '\x1b[36m';
const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

export const log = console.log;

export const networkLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgBlue}%s${specialChar}`, `Network saying: ${message}`, ...rest);
  }
};

export const utilsLog: typeof log = (message, ...rest) => {
  if (isLogEnabled) {
    log(`${colors.FgYellow}%s${specialChar}`, `Utils saying: ${message}`, ...rest);
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

export const debugLog: typeof log = (message, ...rest) => {
  log(`${colors.FgCyan}%s${specialChar}`, `DEBUG: ${message}`, ...rest);
};
