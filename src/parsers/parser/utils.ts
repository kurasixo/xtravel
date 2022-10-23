import cheerio from 'cheerio';

import type { Page } from 'puppeteer';
import type { StepObject, ParserStepsArguments, StepFnPageOnly } from '../parsers.types';


export const injectArg = (
  stepFnObj: StepObject,
  parserStepsArguments: ParserStepsArguments,
): StepFnPageOnly => {
  if (stepFnObj.needArg && stepFnObj.argKey) {
    if (typeof stepFnObj.argKey === 'string') {
      const argToInject = parserStepsArguments[stepFnObj.argKey as keyof ParserStepsArguments];
      return (page: Page) => stepFnObj.stepFn(page, argToInject);
    } else {
      const argsToInject = (stepFnObj.argKey as (keyof ParserStepsArguments)[])
        .map((argKey) => parserStepsArguments[argKey]);

      return (page: Page) => stepFnObj.stepFn(page, ...argsToInject);
    }
  }

  return stepFnObj.stepFn;
};

export const getStepsToUse = (
  steps: StepObject[],
  parserStepsArguments: ParserStepsArguments,
): StepFnPageOnly[] => {
  return steps.map((stepFnObj) => injectArg(stepFnObj, parserStepsArguments));
};

export const prepareCheerioRoot = () => {
  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');

  return { dom, root };
};
