import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import type { Page } from 'puppeteer';


export const clickBySelector = async (
  page: Page,
  selector: string,
) => {
  const element = await page.$(selector);
  await element?.click();
};

export const waitForSelector = async (
  page: Page,
  selector: string,
) => {
  await page.waitForSelector(selector);
};

export const clickAndWait = async (
  page: Page,
  selector: string,
) => {
  const searchButton = await page.$(selector);
  await searchButton?.click();

  await page.waitForNavigation(defaultWaitUntilOptions);
};

export const clickHackedAndWait = async (
  page: Page,
  selector: string,
) => {
  await page.waitForSelector(selector);
  const searchButton = await page.$(selector);
  // @ts-ignore
  await searchButton?.evaluate(searchButtonEl => searchButtonEl.click());

  await page.waitForNavigation(defaultWaitUntilOptions);
};

export const changeFocusToNextElement = async (
  page: Page
) => {
  await page.keyboard.press('Tab');
};

export const fillInputAeroflot = async (
  page: Page,
  dataToEnter: string,
  selector: string,

  shouldClearInput = true,
) => {
  const fromInputElement = await page.$(selector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  if (shouldClearInput) {
    const inputValue = await page.$eval(selector, el => el.getAttribute('value')) || '';
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
    }
  }

  await page.keyboard.type(dataToEnter);
  await page.keyboard.press('Enter');
};

export const fillInputS7 = async (
  page: Page,
  dataToEnter: string,
  selector: string,
  suggestionSelector: string,
) => {
  const fromInputElement = await page.$(selector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  await page.keyboard.type(dataToEnter.slice(0, 5), { delay: 300 });

  await page.waitForSelector(suggestionSelector);
  const fromInputFirstSuggestionElement = await page.$(suggestionSelector);
  await fromInputFirstSuggestionElement?.click();
};

export const fillDatepickerS7 = async (
  page: Page,
  dataToEnter: string,

  datePickerSelector: string,
  dateTimeSelector: string,
) => {
  const datePicker = await page.$(datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = dataToEnter.split('.');
  const dateSelectorString = new Date(+year, +month, +day).toString().slice(0, 15);

  const dateTimeElements = await page.$$(dateTimeSelector);
  const magicDatetimes = await Promise.all(dateTimeElements.map((timeEl) => {
    return timeEl.evaluate((timeItself) => (timeItself as HTMLTimeElement).dateTime.slice(0, 15));
  }));

  const foundItem = magicDatetimes.find(el => el === dateSelectorString);
  const indexOfFoundItem = magicDatetimes.indexOf(foundItem as string);

  const foundDate = dateTimeElements.find((_, index) => index === indexOfFoundItem);
  await foundDate?.click();
};

export const fillInputUral = async (
  page: Page,
  where: 'from' | 'to',
  dataToEnter: string,

  clickableInputElementSelector: string,
  inputSelector: string,
  firstSuggestionSelector: string,
) => {
  const indexToUse = where === 'from' ? 0 : 1;

  const clickableInputElement = await page.$$(clickableInputElementSelector);
  await clickableInputElement[indexToUse].click();

  const fromInputElement = await page.$(inputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();
  await page.keyboard.type(dataToEnter.slice(0, 5));

  await page.waitForSelector(firstSuggestionSelector);
  const firstSuggestion = await page.$(firstSuggestionSelector);
  await firstSuggestion?.click();
};

export const fillDatepickerUral = async (
  page: Page,
  date: string,

  datePickerSelector: string,
  dateTimeSelector: string,
  dateTimeMonthsSelector: string,
  notDisabledMonthsSelector: string,
) => {
  const datePicker = await page.$(datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page.$$(dateTimeSelector);
  const months = await Promise.all(magicDateTimeElements.map((table) => {
    return table.$(dateTimeMonthsSelector)
      .then(tableHeader => tableHeader?.evaluate(th => th.textContent));
  }));

  const foundMonth = months.find((month) => month === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth);

  const allDateElements = await magicDateTimeElements[indexOfFoundMonth]
    .$$(notDisabledMonthsSelector);
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();
};

export const fillInputUtair = async (
  page: Page,
  where: 'from' | 'to',
  dataToEnter: string,

  inputSelector: string,
  suggestionsFieldsSelector: string,
  firstSuggestion: string,
) => {
  const indexToUse = where === 'from' ? 0 : 1;
  const suggestionsFields = await page.$$(suggestionsFieldsSelector);

  await page.waitForSelector(inputSelector);
  const inputValue = await page.$eval(inputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  const fromInputElement = await page.$(inputSelector);
  await fromInputElement?.click();
  await page.keyboard.type(dataToEnter, { delay: 400 });

  const fromInputFirstSuggestionElement = await suggestionsFields[indexToUse].$(firstSuggestion);
  await fromInputFirstSuggestionElement?.click();
};

export const fillDatepickerUtair = async (
  page: Page,
  date: string,

  datePickersSelector: string,
  calendarsSelector: string,
  calendarsMonthsSelector: string,
  calendarsDaysSelector: string,
) => {
  const [datePicker] = await page.$$(datePickersSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page.$$(calendarsSelector);
  const magicDateTimeElementsHeader = await page.$$(calendarsMonthsSelector);
  const months = await Promise.all(magicDateTimeElementsHeader.map((tableHead) => {
    return tableHead?.evaluate(th => th.textContent);
  }));

  const foundMonth = months.find((month) => month?.toLocaleLowerCase() === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth as string);
  const allDateElements =
    await magicDateTimeElements[indexOfFoundMonth].$$(calendarsDaysSelector);
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();
};
