import type { Page } from 'puppeteer';

import {
  clickAndWait,
  waitForSelector,
  fillInputAeroflot,
  changeFocusToNextElement,
} from '../parser/utilsSteps';
import { stepsSelectors } from './selectors';
import type { StepObject } from '../parsers.types';


const fillInputFrom = async (
  page: Page,
  from: string
) => {
  await fillInputAeroflot(page, from, stepsSelectors.fromInputSelector);
};

const fillInputTo = async (
  page: Page,
  to: string,
) => {
  await fillInputAeroflot(page, to, stepsSelectors.toInputSelector, false);
};

const fillInputDatepicker = async (
  page: Page,
  date: string,
) => {
  await fillInputAeroflot(page, date, stepsSelectors.datePickerSelector);
};

const clickAndWaitWithBindSelector = (page: Page) =>
  clickAndWait(page, stepsSelectors.buttonSelector);

const waitForSelectorWithBindSelector = (page: Page) =>
  waitForSelector(page, stepsSelectors.fromInputSelector);

export const aeroflotSteps: StepObject[] = [
  { stepFn: waitForSelectorWithBindSelector, needArg: false },
  { stepFn: fillInputFrom, needArg: true, argKey: 'from' },
  { stepFn: fillInputTo, needArg: true, argKey: 'to' },
  { stepFn: fillInputDatepicker, needArg: true, argKey: 'date' },
  { stepFn: changeFocusToNextElement, needArg: false },
  { stepFn: clickAndWaitWithBindSelector, needArg: false },
];
