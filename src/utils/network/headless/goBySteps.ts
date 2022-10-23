import type { Page } from 'puppeteer';

import type { SingleStep } from '../../../parsers/parsers.types';


type StepResult = Promise<void | string>;

export const goBySteps = (steps: SingleStep[], page: Page): StepResult => {
  const initalPromise: StepResult = new Promise((resolve) => resolve());
  const stepsResPromise = steps.reduce((acc: StepResult, { stepFn, dataForStep }) => {
    if (acc === initalPromise) {
      acc = stepFn(page, dataForStep);
      return acc;
    }

    acc.then(() => stepFn(page, dataForStep));
    return acc;
  }, initalPromise);

  return stepsResPromise;
};
