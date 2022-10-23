import cheerio from 'cheerio';

import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { stepsSelectors } from './selectors';
import type { StepFn } from '../parsers.types';

// move to seperate steps
const fillFlightForm: StepFn = async (page, data: string[]) => {
  const [from, to, date] = data;

  const suggestionsFields = await page.$$(stepsSelectors.suggestionsFields);

  await page.waitForSelector(stepsSelectors.fromInputSelector);
  const inputValue = await page.$eval(stepsSelectors.fromInputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  const fromInputElement = await page.$(stepsSelectors.fromInputSelector);
  await fromInputElement?.click();
  await page.keyboard.type(from, { delay: 400 });

  const fromInputFirstSuggestionElement =
    await suggestionsFields[0].$(stepsSelectors.firstSuggestion);
  await fromInputFirstSuggestionElement?.click();


  const toInputElement = await page.$(stepsSelectors.toInputSelector);
  await toInputElement?.click();
  await page.keyboard.type(to, { delay: 400 });

  const toInputFirstSuggestionElement =
    await suggestionsFields[1].$(stepsSelectors.firstSuggestion);
  await toInputFirstSuggestionElement?.click();

  await page.keyboard.press('Tab');

  const [datePicker] = await page.$$(stepsSelectors.datePickers);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page.$$(stepsSelectors.calendars);
  const magicDateTimeElementsHeader = await page.$$(stepsSelectors.calendarsMonths);
  const months = await Promise.all(magicDateTimeElementsHeader.map((tableHead) => {
    return tableHead?.evaluate(th => th.textContent);
  }));

  const foundMonth = months.find((month) => month?.toLocaleLowerCase() === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth as string);
  const allDateElements =
    await magicDateTimeElements[indexOfFoundMonth].$$(stepsSelectors.calendarsDay);
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();

  const searchButton = await page.$(stepsSelectors.searchButton);
  await searchButton?.click();

  await page.waitForNavigation(defaultWaitUntilOptions);

  const flights = await page.$$(stepsSelectors.flights);
  const flightsRow = await page.$$(stepsSelectors.flightRowSelector);

  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');

  for (let i = 0; i < flights.length; i++) {
    const prices = await flightsRow[i].$$(stepsSelectors.prices);
    const pricesArrayHtml = await Promise.all(prices.map((price) => {
      return price.evaluate((priceEl) => '<div id="innerPrice">' + priceEl.textContent + '</div>');
    }));

    const priceHtml = `<div id="prices">${pricesArrayHtml.join('')}</div>`;
    const routeItemHtmlContent = await flights[i]?.evaluate((route) => route.outerHTML);

    root.append(routeItemHtmlContent as string);
    dom(dom(stepsSelectors.flights)[i]).append(priceHtml);
  }

  const result = dom.html();
  return result;
};

export const utairSteps: StepFn[] = [fillFlightForm];
