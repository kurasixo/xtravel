import cheerio from 'cheerio';

import { getStepsToUse } from './utils';
import { goBySteps } from '../../utils/network/headless/goBySteps';
import type { Page } from 'puppeteer';
import type { ParserStepsArguments, Processors, RawRoute, StepFn, StepObject } from '../parsers.types';

// old code
// eslint-disable-next-line
export type AdditionalArgsType = any[];
export type SingleStep = { stepFn: StepFn, dataForStep: AdditionalArgsType };
export type StepResult = Promise<void | string>;
export const goByStepsOld = (steps: SingleStep[], page: Page): StepResult => {
  const initalPromise: StepResult = new Promise((resolve) => resolve());
  const stepsResPromise = steps.reduce((acc: StepResult, { stepFn, dataForStep }) => {
    if (acc === initalPromise) {
      acc = stepFn(page, dataForStep);
      return acc;
    }

    acc = acc.then(() => stepFn(page, dataForStep));
    return acc;
  }, initalPromise);

  return stepsResPromise;
};

export const getOldStepsToUse = (
  oldStep: StepFn,
  inputParamsForOld: AdditionalArgsType,
) => [oldStep].map((stepFn, index) => {
  return {
    stepFn,
    dataForStep: [inputParamsForOld][index],
  };
});

// eslint-disable-next-line
const mockAsyncFn = (...args: any[]) =>
  () => new Promise(res => res(args));

const element = {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const firstClickableElement = {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  $: jest.fn(() => element),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const secondClickableElement =  {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  $: jest.fn(() => element),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const pageForNew = {
  $eval: jest.fn(() => '$eval'),
  $: jest.fn(() => firstClickableElement),
  $$: jest.fn(() => [
    firstClickableElement,
    firstClickableElement,
    firstClickableElement,
    firstClickableElement,
  ]),
  waitForSelector: jest.fn(mockAsyncFn('waitForSelector')),
  keyboard: {
    press: jest.fn(mockAsyncFn('keyboard.press')),
    type: jest.fn(mockAsyncFn('keyboard.type')),
  },
  waitForNavigation: jest.fn(mockAsyncFn('waitForNavigation')),
};

const pageForOld = {
  $eval: jest.fn(() => '$eval'),
  $: jest.fn(() => secondClickableElement),
  $$: jest.fn(() => [
    secondClickableElement,
    secondClickableElement,
    secondClickableElement,
    secondClickableElement,
  ]),
  waitForSelector: jest.fn(mockAsyncFn('waitForSelector')),
  keyboard: {
    press: jest.fn(mockAsyncFn('keyboard.press')),
    type: jest.fn(mockAsyncFn('keyboard.type')),
  },
  waitForNavigation: jest.fn(mockAsyncFn('waitForNavigation')),
};

export const createPageForNew = () => ({ pageForNew, firstClickableElement });
export const createPageForOld = () => ({ pageForOld, secondClickableElement });


export const goByNewSteps = (
  page: Page,
  newSteps: StepObject[],
  newParams: ParserStepsArguments,
) => goBySteps(
  page,
  getStepsToUse(newSteps, newParams)
);

// eslint-disable-next-line
export const goByOldSteps = (page: Page, oldStep: StepFn, oldParams: any[]) =>
  goByStepsOld(getOldStepsToUse(oldStep, oldParams), page);


export const loadDataAndProcess = (
  data: string,
  contentSelector: string,
  processors: Processors<RawRoute>,
) => {
  const dom = cheerio.load(data);
  const dataBySelectors = dom(contentSelector);

  const res: RawRoute[] = [];
  dataBySelectors.each((index, element) => {
    // @ts-ignore
    res.push(processors.each(index, element, dom));
  });

  return res;
};
