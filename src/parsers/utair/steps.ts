import cheerio from 'cheerio';

import type { StepFn } from '../../types';
import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { innerSelectors } from './selectors';

// move to seperate steps
const fillFlightForm: StepFn = async (page, data: string[]) => {
  const [from, to, date] = data;

  const suggestionsFields = await page.$$(innerSelectors.suggestionsFields);

  await page.waitForSelector(innerSelectors.fromInputSelector);
  const inputValue = await page.$eval(innerSelectors.fromInputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  const fromInputElement = await page.$(innerSelectors.fromInputSelector);
  await fromInputElement?.click();
  await page.keyboard.type(from, { delay: 400 });

  const fromInputFirstSuggestionElement =
    await suggestionsFields[0].$(innerSelectors.firstSuggestion);
  await fromInputFirstSuggestionElement?.click();


  const toInputElement = await page.$(innerSelectors.toInputSelector);
  await toInputElement?.click();
  await page.keyboard.type(to, { delay: 400 });

  const toInputFirstSuggestionElement =
    await suggestionsFields[1].$(innerSelectors.firstSuggestion);
  await toInputFirstSuggestionElement?.click();

  await page.keyboard.press('Tab');

  const [datePicker] = await page.$$(innerSelectors.datePickers);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page.$$(innerSelectors.calendars);
  const magicDateTimeElementsHeader = await page.$$(innerSelectors.calendarsMonths);
  const months = await Promise.all(magicDateTimeElementsHeader.map((tableHead) => {
    return tableHead?.evaluate(th => th.textContent);
  }));

  const foundMonth = months.find((month) => month?.toLocaleLowerCase() === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth as string);
  const allDateElements =
    await magicDateTimeElements[indexOfFoundMonth].$$(innerSelectors.calendarsDay);
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();

  const searchButton = await page.$(innerSelectors.searchButton);
  await searchButton?.click();

  await page.waitForNavigation(defaultWaitUntilOptions);

  const flights = await page.$$(innerSelectors.flights);
  const flightsRow = await page.$$('.FlightRow');

  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');

  for (let i = 0; i < flights.length; i++) {
    const prices = await flightsRow[i].$$(innerSelectors.prices);
    const pricesArrayHtml = await Promise.all(prices.map((price) => {
      return price.evaluate((priceEl) => '<div id="innerPrice">' + priceEl.textContent + '</div>');
    }));

    const priceHtml = `<div id="prices">${pricesArrayHtml.join('')}</div>`;
    const routeItemHtmlContent = await flights[i]?.evaluate((route) => route.outerHTML);

    root.append(routeItemHtmlContent as string);
    dom(dom(innerSelectors.flights)[i]).append(priceHtml);
  }

  const result = dom.html();
  return result;
};

export const utairSteps: StepFn[] = [fillFlightForm];
