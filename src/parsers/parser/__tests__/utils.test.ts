import { injectArg, getStepsToUse } from '../utils';
import type { Page } from 'puppeteer';
import type { StepObject } from '../../parsers.types';


const parserArgument = { date: '15.10.2022', from: 'foo', to: 'bar' };

describe('parser utils', () => {
  describe('injectArg', () => {
    it('should inject single arg', () => {
      const stepFnObj: StepObject = {
        needArg: true,
        argKey: 'date',
        stepFn: (page: Page, date: string) => {
          return Promise.resolve(date);
        }
      };

      const newFn = injectArg(stepFnObj, parserArgument);

      newFn({} as Page)
        .then((result) => {
          expect(result).toEqual(parserArgument.date);
        });
    });

    it('should inject multiple args', () => {
      const stepFnObj: StepObject = {
        needArg: true,
        argKey: ['date', 'from'],
        stepFn: (page: Page, date: string, from: string) => {
          return Promise.resolve(date + from);
        }
      };

      const newFn = injectArg(stepFnObj, parserArgument);

      newFn({} as Page)
        .then((result) => {
          expect(result).toEqual(parserArgument.date + parserArgument.from);
        });
    });

    it('should not change args order if given args in wrong order', () => {
      const stepFnObj: StepObject = {
        needArg: true,
        argKey: ['date', 'from'],
        stepFn: (page: Page, from: string, date: string) => {
          return Promise.resolve(from + date);
        }
      };

      const newFn = injectArg(stepFnObj, parserArgument);

      newFn({} as Page)
        .then((result) => {
          expect(result).toEqual(parserArgument.date + parserArgument.from);
        });
    });

    it('should not inject any args', () => {
      const stepFnObj: StepObject = {
        needArg: false,
        stepFn: (_: Page, date: string) => {
          return Promise.resolve(date);
        }
      };

      const newFn = injectArg(stepFnObj, parserArgument);

      newFn({} as Page)
        .then((result) => {
          expect(result).toEqual(undefined);
        });

    });
  });

  describe('getStepsToUse', () => {
    it('should inject args in all funcs', () => {
      const stepFnObj1: StepObject = {
        needArg: true,
        argKey: 'date',
        stepFn: (_: Page, date: string) => {
          return Promise.resolve(date);
        }
      };

      const stepFnObj2: StepObject = {
        needArg: true,
        argKey: 'from',
        stepFn: (_: Page, from: string) => {
          return Promise.resolve(from);
        }
      };

      const steps = [stepFnObj1, stepFnObj2];

      const newSteps = getStepsToUse(steps, parserArgument);
      Promise.all(newSteps.map(fn => fn({} as Page)))
        .then(([res1, res2]) => {
          expect(res1).toEqual(parserArgument.date);
          expect(res2).toEqual(parserArgument.from);
        });
    });
  });
});
