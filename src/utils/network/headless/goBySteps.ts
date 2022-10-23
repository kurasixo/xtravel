import type { Page } from 'puppeteer';

import type { StepFnPageOnly } from '../../../parsers/parsers.types';


type StepResult = Promise<void | string>;

export const goBySteps = (page: Page, steps: StepFnPageOnly[]): StepResult => {
  const initalPromise: StepResult = new Promise((resolve) => resolve());
  const stepsResPromise = steps.reduce((acc: StepResult, stepFn) => {
    if (acc === initalPromise) {
      acc = stepFn(page);
      return acc;
    }

    // haha silly mistake
    acc = acc.then(() => stepFn(page));
    return acc;
  }, initalPromise);

  return stepsResPromise;
};
