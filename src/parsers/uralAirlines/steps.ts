import cheerio from 'cheerio';

import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { innerSelectors } from './selectors';
import type { StepFn } from '../parsers.types';

// move to seperate steps
const fillFlightForm: StepFn = async (page, data: string[]) => {
  const [from, to, date] = data;

  const closeButton = await page.$(innerSelectors.closeModalButtonSelector);
  await closeButton?.click();

  const clickableInputs = await page.$$('.city-select');
  await clickableInputs[0].click();

  const fromInputElement = await page.$(innerSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();
  await page.keyboard.type(from.slice(0, 5));

  await page.waitForSelector(innerSelectors.firstSuggestionSelector);
  let firstSuggestion = await page.$(innerSelectors.firstSuggestionSelector);
  await firstSuggestion?.click();


  await clickableInputs[1].click();

  const toInputElement = await page.$(innerSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();

  await page.keyboard.type(to.slice(0, 5));
  await page.waitForSelector(innerSelectors.firstSuggestionSelector);
  firstSuggestion = await page.$(innerSelectors.firstSuggestionSelector);
  await firstSuggestion?.click();


  const datePicker = await page.$(innerSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page.$$('.show-calendar table.table-condensed');
  const months = await Promise.all(magicDateTimeElements.map((table) => {
    return table.$('thead tr th.month')
      .then(tableHeader => tableHeader?.evaluate(th => th.textContent));
  }));

  const foundMonth = months.find((month) => month === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth);

  const allDateElements = await magicDateTimeElements[indexOfFoundMonth].$$('td:not(.disabled)');
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();
  const reverseDatePicker = await page.$(innerSelectors.reverseDatePickerSelector);
  await reverseDatePicker?.click();

  await page.waitForSelector(innerSelectors.buttonSelector);
  const searchButton = await page.$(innerSelectors.buttonSelector);
  // @ts-ignore
  await searchButton?.evaluate(searchButtonEl => searchButtonEl.click());

  await page.waitForNavigation(defaultWaitUntilOptions);
  await page.waitForSelector(innerSelectors.stopSelector, defaultWaitUntilOptions);
  const allStops = await page.$$(innerSelectors.stopSelector);

  const flightsContainers = await page.$$('.delta.col-auto');

  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');

  for (let i = 0; i < allStops.length; i++) {
    await flightsContainers[i].click();
    await page.waitForSelector('.fares');
    const prices = await page.$('.fares');
    const pricesContent = await prices?.evaluate((pricesEl) => pricesEl.outerHTML);

    await allStops[i].hover();
    await page.waitForSelector(innerSelectors.fullRouteSelector);
    const fullRoute = await page.$(innerSelectors.fullRouteSelector);
    const routeItemHtmlContent = await fullRoute?.evaluate((route) => route.outerHTML);

    root.append(routeItemHtmlContent as string);
    dom(dom(innerSelectors.fullRouteSelector)[i]).append(pricesContent as string);
  }

  const result = dom.html();
  return result;
};

export const uralAirlineSteps: StepFn[] = [fillFlightForm];
