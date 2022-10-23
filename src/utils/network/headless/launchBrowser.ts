import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { FingerprintGenerator } from 'fingerprint-generator';
import { FingerprintInjector } from 'fingerprint-injector';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import type { Browser, Page, PuppeteerLaunchOptions, WaitForOptions } from 'puppeteer';

import { isDebug } from '../../helpers';
import { networkLog } from '../../log';


export const defaultWaitUntilOptions: WaitForOptions = {
  waitUntil: ['domcontentloaded', 'networkidle0'],
};

const plugins = [StealthPlugin()];
const windowDimensions = {
  width: 1920,
  height: 1080,
};

const recorderConfig = {
  videoFrame: {
    width: windowDimensions.width + 80,
    height: windowDimensions.height + 80,
  },
  aspectRatio: '16:9',
  fps: 30,
};

// should be 20000, but due to my not the best connection have to play around with it
const defaultTimeout = 40000;

const launchOptions: PuppeteerLaunchOptions = {
  defaultViewport: {
    width: windowDimensions.width,
    height: windowDimensions.height,
  },

  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--incognito',
    '--window-size=' + windowDimensions.width + ',' + windowDimensions.height,
  ],

  slowMo: 40,
  headless: !isDebug(),
};

const prepareFingerPrint = () => {
  const fingerprintGenerator = new FingerprintGenerator();
  const fingerPrint = fingerprintGenerator.getFingerprint({
    devices: ['desktop'],
    operatingSystems: ['linux', 'macos', 'windows'],
    browsers: ['chrome', 'edge', 'firefox', 'safari'],

    locales: ['ru'],

    screen: {
      minWidth: windowDimensions.width,
      maxWidth: windowDimensions.width,

      minHeight: windowDimensions.height,
      maxHeight: windowDimensions.height,
    }
  });

  return fingerPrint;
};

const useAllPlugins = () => {
  plugins.forEach((plugin) => {
    puppeteer.use(plugin);
  }, null);
};

const startRecorder = async (
  page: Page,
  recordingName: string,
): Promise<PuppeteerScreenRecorder> => {
  const recorder = new PuppeteerScreenRecorder(page, recorderConfig);
  await recorder.start('./src/parsers/recordings/' + recordingName);

  return recorder;
};

const injectFingerPrint = async (page: Page) => {
  const fingerprintInjector = new FingerprintInjector();
  const fingerPrint = prepareFingerPrint();

  await fingerprintInjector.attachFingerprintToPuppeteer(page, fingerPrint);
};

const configPage = async (page: Page) => {
  // NEED TO TEST THIS APPROACH, BEING DETECTED AS BOT for pobeda parser
  // const cdpSession = await page.target().createCDPSession();
  // const randomSlowRate = Math.abs(Math.round(Math.random() * 10) - 6);
  // await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: randomSlowRate });

  await Promise.all([
    page.setCacheEnabled(false),
    page.setDefaultTimeout(defaultTimeout),
    page.setDefaultNavigationTimeout(defaultTimeout),
  ]);
};

const injectErrorHandling = async (
  browser: Browser,
  page: Page,
  recorder: PuppeteerScreenRecorder,
) => {
  page.on('error', async (errorEvent) => {
    console.log(errorEvent.name);
    await recorder.stop();
    throw errorEvent;
  });
};

export const launchHeadlessBrowser = async (
  recordingName: string,
): Promise<[Browser, Page, PuppeteerScreenRecorder]> => {
  useAllPlugins();

  const browser = await puppeteer.launch(launchOptions);
  const [page] = await browser.pages();
  const recorder = await startRecorder(page, recordingName);

  await configPage(page);
  await injectFingerPrint(page);
  await injectErrorHandling(browser, page, recorder);

  return [browser, page, recorder];
};

export const stopHeadlessBrowser = async (
  browser: Browser,
  page: Page,
  recorder: PuppeteerScreenRecorder,
) => {
  await recorder.stop();
  networkLog('recorder stopped');

  await page.close();
  networkLog('page closed');

  await browser.close();
  networkLog('browser closed');
};
