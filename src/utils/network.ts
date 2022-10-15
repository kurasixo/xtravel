import axios from 'axios';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

import { networkLog } from './log';
import { memoNetworkWithCache } from './simpleCache';

import type { Site, StepFn } from '../types';
import type  { PuppeteerLaunchOptions, WaitForOptions } from 'puppeteer';
import { AdditionalArgsType } from '../parsers/simpleParser';


export const getSiteWithoutMemo = (site: Site): Promise<string> => {
  networkLog('getting site content', site);
  return axios.get<string>(site).then((response) => response.data);
};

export const getSite = memoNetworkWithCache(getSiteWithoutMemo);

export const getSiteHeadlesslyWihoutMemo = async (
  site: Site,
  steps: { stepFn: StepFn, dataForStep: AdditionalArgsType }[],
): Promise<string> => {
  networkLog('getting site content', site);

  const launchOptions: PuppeteerLaunchOptions = {
    args: ['--window-size=1920,1080'],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    headless: false,
  };

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle0'
  };

  const browser = await puppeteer.launch(launchOptions);
  const [page] = await browser.pages();

  const randomUA = new UserAgent();
  await page.setUserAgent(randomUA.toString());

  await page.goto(site, waitUntilOptions);

  const promises: Promise<unknown>[] = [];
  steps.forEach(({ stepFn, dataForStep }) => {
    const res = stepFn(page, dataForStep);
    promises.push(res);
  });

  await Promise.all(promises);

  return page
    .content()
    .then((pageContent) => {
      page.close()
        .then(() => browser.close());

      return pageContent;
    });
};

export const getSiteHeadlessly = memoNetworkWithCache(
  getSiteHeadlesslyWihoutMemo,
  'headlessCache.json'
);
