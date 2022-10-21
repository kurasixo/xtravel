import { networkLog } from '../../log';
import { memoNetworkWithCache } from '../../cache/redisCache';

import type { FnPromiseType, SingleStep, Site } from '../../../types';
import type  { WaitForOptions } from 'puppeteer';
import { launchHeadlessBrowser, stopHeadlessBrowser } from './launchBrowser';
import { goBySteps } from './goBySteps';


const getRecordingName = (site: Site): string => {
  const recordingName = site.split('/')[2] + '.mp4';
  // if (recordingName.includes('www')) {
  //   recordingName.split('https://www')
  // }
  return recordingName;
};

export const getSiteHeadlesslyWihoutMemo: FnPromiseType<string> = async (
  site: Site,
  steps: SingleStep[],
): Promise<string> => {
  networkLog('getting site content', site);
  const recordingName = getRecordingName(site);
  const [browser, page, recorder] = await launchHeadlessBrowser(recordingName);

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle2',
    timeout: 800000,
  };

  networkLog('start navigation');
  await page.goto(site, waitUntilOptions);
  networkLog('end navigation');

  networkLog('start steps');
  const stepsResult = await goBySteps(steps, page);
  networkLog('end steps');

  if (stepsResult) {
    networkLog('returning steps result');
    await stopHeadlessBrowser(browser, page, recorder);
    return stepsResult;
  }

  const pageContent = page.content();
  await stopHeadlessBrowser(browser, page, recorder);

  return pageContent;
};

export const getSiteHeadlessly: FnPromiseType<string> = memoNetworkWithCache(getSiteHeadlesslyWihoutMemo);
