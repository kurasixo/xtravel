import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import { FingerprintGenerator } from 'fingerprint-generator';
import { FingerprintInjector } from 'fingerprint-injector';

import { networkLog } from './log';
import { memoNetworkWithCache } from './simpleCache';

import type { Site, StepFn } from '../types';
import type  { Browser, Page, PuppeteerLaunchOptions, WaitForOptions } from 'puppeteer';
import { AdditionalArgsType } from '../parsers/parser';


const stopHeadlessBrowser = async (
  recorder: PuppeteerScreenRecorder,
  page: Page,
  browser: Browser,
) => {
  await recorder.stop();
  networkLog('recorder stopped');
  await page.close();
  networkLog('page closed');
  await browser.close();
  networkLog('browser closed');
};

export const getSiteHeadlesslyWihoutMemo = async (
  site: Site,
  steps: { stepFn: StepFn, dataForStep: AdditionalArgsType }[],
): Promise<string> => {
  networkLog('getting site content', site);

  puppeteer.use(StealthPlugin());

  const windowWidth = 1920;
  const windowHeight = 1080;

  const recorderConfig = {
    videoFrame: {
      width: windowWidth,
      height: windowHeight,
    },
    aspectRatio: '16:9',
    fps: 30,
  };

  const launchOptions: PuppeteerLaunchOptions = {
    defaultViewport: {
      width: windowWidth,
      height: windowHeight,
    },

    args: [
      '--incognito',
      '--window-size=' + windowWidth + ',' + windowHeight,
    ],

    slowMo: 40, // isDev = 200
    headless: true, // isDev
  };

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle2',
    timeout: 40000,
  };

  const fingerprintGenerator = new FingerprintGenerator();
  const fingerprintInjector = new FingerprintInjector();

  const browser = await puppeteer.launch(launchOptions);
  const [page] = await browser.pages();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ru',
  });

  const fingerPrint = fingerprintGenerator.getFingerprint({
    devices: ['desktop'],
    operatingSystems: ['linux', 'macos', 'windows'],
    browsers: ['chrome', 'edge', 'firefox', 'safari'],

    locales: ['ru'],

    screen: {
      minWidth: windowWidth,
      maxWidth: windowWidth,

      minHeight: windowHeight,
      maxHeight: windowHeight,
    }
  });
  await fingerprintInjector.attachFingerprintToPuppeteer(page, fingerPrint);

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', {
      get: function() {
        return 'ru';
      }
    });

    Object.defineProperty(navigator, 'languages', {
      get: function() {
        return ['ru'];
      }
    });
  });

  const recorder = new PuppeteerScreenRecorder(page, recorderConfig);
  const recordingName = site.split('/')[2] + '.mp4';
  await recorder.start('./src/parsers/recordings/' + recordingName);

  await page.goto(site, waitUntilOptions);
  networkLog('end navigation');

  const stepsResPromise = steps.reduce((acc: Promise<string | void>, { stepFn, dataForStep }) => {
    if (acc === null) {
      acc = stepFn(page, dataForStep);
      return acc;
    }

    acc.then(() => stepFn(page, dataForStep));
    return acc;
  }, null);

  const stepsResult = await stepsResPromise;
  networkLog('end steps');

  if (stepsResult) {
    networkLog('returning steps result');
    await stopHeadlessBrowser(recorder, page, browser);
    return stepsResult;
  }

  const pageContent = page.content();
  await stopHeadlessBrowser(recorder, page, browser);

  return pageContent;
};

export const getSiteHeadlessly = memoNetworkWithCache(
  getSiteHeadlesslyWihoutMemo,
  'headlessCache.json'
);
