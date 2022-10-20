import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { FingerprintGenerator } from 'fingerprint-generator';
import { FingerprintInjector } from 'fingerprint-injector';

import type { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';

import { isDebug } from '../../helpers';
import { networkLog } from '../../log';


const plugins = [StealthPlugin()];
const windowDimensions = {
  width: 1920,
  height: 1080,
};

const recorderConfig = {
  videoFrame: {
    width: windowDimensions.width,
    height: windowDimensions.height,
  },
  aspectRatio: '16:9',
  fps: 30,
};

const launchOptions: PuppeteerLaunchOptions = {
  defaultViewport: {
    width: windowDimensions.width,
    height: windowDimensions.height,
  },

  args: [
    '--incognito',
    '--window-size=' + windowDimensions.width + ',' + windowDimensions.height,
  ],

  slowMo: isDebug() ? 200 : 40,
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

export const launchHeadlessBrowser = async (
  recordingName: string,
): Promise<[Browser, Page, PuppeteerScreenRecorder]> => {
  useAllPlugins();

  const browser = await puppeteer.launch(launchOptions);
  const [page] = await browser.pages();

  await injectFingerPrint(page);
  const recorder = await startRecorder(page, recordingName);

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
