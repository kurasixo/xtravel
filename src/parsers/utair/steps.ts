import cheerio from 'cheerio';

import type { WaitForOptions } from 'puppeteer';
import type { StepFn } from '../../types';
import { innerSelectors } from './selectors';

// move to seperate steps
const fillFlightForm: StepFn = async (page, data: string[]) => {
  const [from, to, date] = data;

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle0',
    timeout: 80000,
  };

  const suggestionsFields = await page.$$('.SearchWidget-box.-city');

  await page.waitForSelector('input[data-testid="SearchWidgetDepartureInput"]');
  const inputValue = await page.$eval('input[data-testid="SearchWidgetDepartureInput"]', el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  const fromInputElement = await page.$('input[data-testid="SearchWidgetDepartureInput"]');
  await fromInputElement?.click();
  await page.keyboard.type(from, { delay: 400 });

  const fromInputFirstSuggestionElement = await suggestionsFields[0].$('.CityAutocomplete-name');
  await fromInputFirstSuggestionElement?.click();


  const toInputElement = await page.$('input[data-testid="SearchWidgetArrivalInput"]');
  await toInputElement?.click();
  await page.keyboard.type(to, { delay: 400 });

  const toInputFirstSuggestionElement = await suggestionsFields[1].$('.CityAutocomplete-name');
  await toInputFirstSuggestionElement?.click();

  await page.keyboard.press('Tab');

  const [datePicker] = await page.$$('.SearchWidget-input.-select');
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month - 1, +day);
  const monthInLocale = dateSelectorString.toLocaleString('ru', { month: 'long' });

  const searchDateString = monthInLocale + ' ' + year;

  const magicDateTimeElements = await page
    .$$('.CalendarMonthGrid_month__horizontal:not(.CalendarMonthGrid_month__hidden)');
  const magicDateTimeElementsHeader = await page
    .$$('.CalendarMonthGrid_month__horizontal:not(.CalendarMonthGrid_month__hidden) .CalendarMonth_caption');
  const months = await Promise.all(magicDateTimeElementsHeader.map((tableHead) => {
    return tableHead?.evaluate(th => th.textContent);
  }));

  const foundMonth = months.find((month) => month?.toLocaleLowerCase() === searchDateString);
  const indexOfFoundMonth = months.indexOf(foundMonth as string);
  const allDateElements = await magicDateTimeElements[indexOfFoundMonth].$$('td.CalendarDay');
  const dates = await Promise.all(allDateElements.map((dateElement) => {
    return dateElement.evaluate(td => td.textContent);
  }));
  const foundDate = dates.find((date) => date?.trim() === day);
  const indexOfFoundDate = dates.indexOf(foundDate as string);

  const dateElementToClick = allDateElements[indexOfFoundDate];
  await dateElementToClick?.click();

  const searchButton = await page.$('button[data-testid="SearchWidgetFindButton"]');
  await searchButton?.click();

  const flights = await page.$$('.FlightInfo.FlightInfoBlock-Tooltip');

  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');

  for (let i = 0; i < flights.length; i++) {
    const prices = await flights[i].$$('.FlightRow-Cell');
    const pricesArrayHtml = await Promise.all(prices.map((price) => {
      return price.evaluate((priceEl) => '<div id="innerPrice">' + priceEl.textContent + '</div>');
    }));

    const priceHtml = `<div id="prices">${pricesArrayHtml.join('')}</div>`;
    console.log(priceHtml);

    const fullRoute = flights[i];
    const routeItemHtmlContent = await fullRoute?.evaluate((route) => route.outerHTML);
    console.log(routeItemHtmlContent, flights.length);
    root.append(routeItemHtmlContent as string);
    dom(dom('.FlightInfo.FlightInfoBlock-Tooltip')[i]).append(priceHtml);
  }

  const result = dom.html();
  return result;
};

export const utairSteps: StepFn[] = [fillFlightForm];
