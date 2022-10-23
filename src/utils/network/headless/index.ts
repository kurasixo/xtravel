import { asyncWithRetryOnError } from '../../retry';
import { defaultWaitUntilOptions, launchHeadlessBrowser, stopHeadlessBrowser } from './launchBrowser';
import { goBySteps } from './goBySteps';
import { memoNetworkWithCache } from '../../cache/redisCache';
import { networkLog } from '../../log';
import type { FnPromiseType } from '../../../types';
import type { StepFnPageOnly } from '../../../parsers/parsers.types';


const getRecordingName = (site: string): string => {
  const recordingName = site.split('/')[2] + '.mp4';

  if (recordingName.includes('www')) {
    return recordingName.split('www.')[1];
  }

  return recordingName;
};

export const getSiteHeadlesslyWihoutMemo: FnPromiseType<string> = async (
  site: string,
  steps: StepFnPageOnly[],
): Promise<string> => {
  networkLog('getting site content', site);
  const recordingName = getRecordingName(site);
  const [browser, page, recorder] = await launchHeadlessBrowser(recordingName);

  networkLog('start navigation');
  await page.goto(site, defaultWaitUntilOptions);
  networkLog('end navigation');

  networkLog('start steps');
  const stepsResult = await goBySteps(page, steps);
  networkLog('end steps');

  const pageContent = page.content();
  await stopHeadlessBrowser(browser, page, recorder);

  if (stepsResult) {
    networkLog('returning steps result');
    return stepsResult;
  }

  return pageContent;
};

export const getSiteHeadlessly: FnPromiseType<string> =
  memoNetworkWithCache(asyncWithRetryOnError(getSiteHeadlesslyWihoutMemo));
