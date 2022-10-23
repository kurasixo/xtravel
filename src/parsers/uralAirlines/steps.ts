import { clickBySelector, clickHackedAndWait, fillDatepickerUral, fillInputUral } from '../parser/utilsSteps';
import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { Page } from 'puppeteer';
import { prepareCheerioRoot } from '../parser/utils';
import { stepsSelectors } from './selectors';
import type { StepObject } from '../parsers.types';


const closeModal = (page: Page) =>
  clickBySelector(page, stepsSelectors.closeModalButtonSelector);

const fillInputFrom = async (
  page: Page,
  from: string,
) => {
  return await fillInputUral(
    page,
    'from',
    from,
    stepsSelectors.clickableInputElementSelector,
    stepsSelectors.fromInputSelector,
    stepsSelectors.firstSuggestionSelector,
  );
};

const fillInputTo = async (
  page: Page,
  to: string,
) => {
  return await fillInputUral(
    page,
    'to',
    to,
    stepsSelectors.clickableInputElementSelector,
    stepsSelectors.toInputSelector,
    stepsSelectors.firstSuggestionSelector,
  );
};

const fillInputDatepicker = async (
  page: Page,
  date: string,
) => {
  return await fillDatepickerUral(
    page,
    date,
    stepsSelectors.datePickerSelector,
    stepsSelectors.dateTimeSelector,
    stepsSelectors.dateTimeMonthsSelector,
    stepsSelectors.notDisabledMonthsSelector,
  );
};

const clickReverseDatepick = (page: Page) =>
  clickBySelector(page, stepsSelectors.reverseDatePickerSelector);

const clickAndWaitWithBindSelector = (page: Page) =>
  clickHackedAndWait(page, stepsSelectors.buttonSelector);

const aggregatePageContent = async (page: Page) => {
  await page.waitForSelector(stepsSelectors.stopSelector, defaultWaitUntilOptions);
  const allStops = await page.$$(stepsSelectors.stopSelector);

  const flightsContainers = await page.$$(stepsSelectors.flightsContainerSelector);

  const { dom, root } = prepareCheerioRoot();

  for (let i = 0; i < allStops.length; i++) {
    await flightsContainers[i].click();
    await page.waitForSelector(stepsSelectors.faresSelector);
    const prices = await page.$(stepsSelectors.faresSelector);
    const pricesContent = await prices?.evaluate((pricesEl) => pricesEl.outerHTML);

    await allStops[i].hover();
    await page.waitForSelector(stepsSelectors.fullRouteSelector);
    const fullRoute = await page.$(stepsSelectors.fullRouteSelector);
    const routeItemHtmlContent = await fullRoute?.evaluate((route) => route.outerHTML);

    root.append(routeItemHtmlContent as string);
    dom(dom(stepsSelectors.fullRouteSelector)[i]).append(pricesContent as string);
  }

  const result = dom.html();
  return result;
};

export const uralAirlineSteps: StepObject[] = [
  { stepFn: closeModal, needArg: false },

  { stepFn: fillInputFrom, needArg: true, argKey: 'from' },
  { stepFn: fillInputTo, needArg: true, argKey: 'to' },
  { stepFn: fillInputDatepicker, needArg: true, argKey: 'date' },
  { stepFn: clickReverseDatepick, needArg: false },

  { stepFn: clickAndWaitWithBindSelector, needArg: false },

  { stepFn: aggregatePageContent, needArg: false },
];

