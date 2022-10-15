import type { Page, WaitForOptions } from 'puppeteer';
import type { StepFn } from '../../types';


const fromInputSelector = '#ticket-city-departure-0-booking';
const toInputSelector = '#ticket-city-arrival-0-booking';

const datePickerSelector = 'input[name="ticket-date-from-booking"]';

const buttonSelector = 'button[type="submit"]';

const fillFlightForm: StepFn = async (page: Page, data: string[]) => {
  const [from, to, date] = data;

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle2'
  };

  const fromInputElement = await page.$(fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  const inputValue = await page.$eval(fromInputSelector, el => el.getAttribute('value')) || [];
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  await page.keyboard.type(from);
  await page.keyboard.press('Enter');

  const toInputElement = await page.$(toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();
  await page.keyboard.type(to);
  await page.keyboard.press('Enter');

  const datePicker = await page.$(datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();
  await page.keyboard.type(date);
  await page.keyboard.press('ArrowRight');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab'); // focus to next element

  const searchButton = await page.$(buttonSelector);
  await searchButton?.click();

  await page.waitForNavigation(waitUntilOptions);
};

export const aeroflotSteps: StepFn[] = [fillFlightForm];
