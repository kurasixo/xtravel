import type { Page, } from 'puppeteer';

import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { stepsSelectors } from './selectors';
import type { StepFn } from '../parsers.types';


// move to seperate steps
const fillFlightForm: StepFn = async (page: Page, data: string[]) => {
  const [from, to, date] = data;

  /* start clearing form */
  await page.waitForSelector(stepsSelectors.fromInputSelector);
  const fromInputElement = await page.$(stepsSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  const inputValue = await page.$eval(stepsSelectors.fromInputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
  /* end clearing form */

  /* start entering "from" value */
  await page.keyboard.type(from);
  await page.keyboard.press('Enter');
  /* end entering "from" value */

  /* start entering "to" value */
  const toInputElement = await page.$(stepsSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();
  await page.keyboard.type(to);
  await page.keyboard.press('Enter');
  /* end entering "to" value */

  /* start entering "date" value */
  const datePicker = await page.$(stepsSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const datePickerValue = await page.$eval(stepsSelectors.datePickerSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < datePickerValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  await page.keyboard.type(date);
  await page.keyboard.press('Enter');
  /* end entering "date" value */

  await page.keyboard.press('Tab'); // focus to next element

  const searchButton = await page.$(stepsSelectors.buttonSelector);
  await searchButton?.click();

  await page.waitForNavigation(defaultWaitUntilOptions);
};

export const aeroflotSteps: StepFn[] = [fillFlightForm];
