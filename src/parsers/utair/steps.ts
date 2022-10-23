import { changeFocusToNextElement, clickAndWait, fillDatepickerUtair, fillInputUtair } from '../parser/utilsSteps';
import { Page } from 'puppeteer';
import { prepareCheerioRoot } from '../parser/utils';
import { stepsSelectors } from './selectors';
import type { StepObject, } from '../parsers.types';


const fillInputFrom = async (
  page: Page,
  from: string,
) => {
  return await fillInputUtair(
    page,
    'from',
    from,
    stepsSelectors.fromInputSelector,
    stepsSelectors.suggestionsFields,
    stepsSelectors.firstSuggestion,
  );
};

const fillInputTo = async (
  page: Page,
  to: string,
) => {
  return await fillInputUtair(
    page,
    'to',
    to,
    stepsSelectors.toInputSelector,
    stepsSelectors.suggestionsFields,
    stepsSelectors.firstSuggestion,
  );
};

const fillInputDatepicker = async (
  page: Page,
  date: string,
) => {
  return await fillDatepickerUtair(
    page,
    date,
    stepsSelectors.datePickers,
    stepsSelectors.calendars,
    stepsSelectors.calendarsMonths,
    stepsSelectors.calendarsDay,
  );
};

const clickAndWaitWithBindSelector = (page: Page) =>
  clickAndWait(page, stepsSelectors.searchButton);

const aggregatePageContent = async (page: Page) => {
  const flights = await page.$$(stepsSelectors.flights);
  const flightsRow = await page.$$(stepsSelectors.flightRowSelector);

  const { dom, root } = prepareCheerioRoot();

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

export const utairSteps: StepObject[] = [
  { stepFn: fillInputFrom, needArg: true, argKey: 'from' },
  { stepFn: fillInputTo, needArg: true, argKey: 'to' },
  { stepFn: changeFocusToNextElement, needArg: false },
  { stepFn: fillInputDatepicker, needArg: true, argKey: 'date' },
  { stepFn: clickAndWaitWithBindSelector, needArg: false },

  { stepFn: aggregatePageContent, needArg: false },
];

