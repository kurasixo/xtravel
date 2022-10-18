import type { Page, WaitForOptions } from 'puppeteer';
import type { StepFn } from '../../types';
import { innerSelectors } from './selectors';


const fillFlightForm: StepFn = async (page: Page, data: string[]) => {
  const [from, to, date] = data;

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle2',
    timeout: 80000,
  };

  /* start clearing form */
  const fromInputElement = await page.$(innerSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  const inputValue = await page.$eval(innerSelectors.fromInputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
  /* end clearing form */

  /* start entering "from" value */
  await page.keyboard.type(from);
  await page.keyboard.press('Enter');
  /* end entering "from" value */

  /* start entering "to" value */
  const toInputElement = await page.$(innerSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();
  await page.keyboard.type(to);
  await page.keyboard.press('Enter');
  /* end entering "to" value */

  /* start entering "date" value */
  const datePicker = await page.$(innerSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const datePickerValue = await page.$eval(innerSelectors.datePickerSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < datePickerValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  await page.keyboard.type(date);
  await page.keyboard.press('Enter');
  /* end entering "date" value */

  await page.keyboard.press('Tab'); // focus to next element

  const searchButton = await page.$(innerSelectors.buttonSelector);
  await searchButton?.click();

  await page.waitForNavigation(waitUntilOptions);
};

export const aeroflotSteps: StepFn[] = [fillFlightForm];
