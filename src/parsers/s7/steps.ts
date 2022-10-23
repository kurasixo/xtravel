import { clickAndWait, clickBySelector, fillDatepickerS7, fillInputS7, waitForSelector } from '../parser/utilsSteps';
import { prepareCheerioRoot } from '../parser/utils';
import { stepsSelectors, s7Selectors } from '../s7/selectors';
import type { Page } from 'puppeteer';
import type { StepObject } from '../parsers.types';


const fillInputFrom = async (
  page: Page,
  from: string,
) => {
  return await fillInputS7(
    page,
    from,
    stepsSelectors.fromInputSelector,
    stepsSelectors.fromInputFirstSuggestionSelector,
  );
};

const fillInputTo = async (
  page: Page,
  to: string,
) => {
  return await fillInputS7(
    page,
    to,
    stepsSelectors.toInputSelector,
    stepsSelectors.toInputFirstSuggestionSelector,
  );
};

const fillInputDatepicker = async (
  page: Page,
  date: string,
) => {
  return await fillDatepickerS7(
    page,
    date,
    stepsSelectors.datePickerSelector,
    stepsSelectors.dateTimeSelector,
  );
};

const clickAndWaitWithBindSelector = (page: Page) =>
  clickAndWait(page, stepsSelectors.buttonSelector);

const waitForSelectorWithBindSelector = (page: Page) =>
  waitForSelector(page, stepsSelectors.fromInputSelector);

const clickBySelectorWithBindSelector = (page: Page) =>
  clickBySelector(page, stepsSelectors.datePickerSelectorTo);

const aggregatePageContent = async (page: Page) => {
  await page.waitForSelector(stepsSelectors.stopSelector);
  const allStops = await page.$$(stepsSelectors.stopSelector);
  const allRoutesFull = await page.$$(s7Selectors.content);

  const { dom, root } = prepareCheerioRoot();

  for (let i = 0; i < allStops.length; i++) {
    await allStops[i].click();
    const routeItemHtmlContent = await allRoutesFull[i].evaluate((el) => el.outerHTML);
    root.append(routeItemHtmlContent);
  }

  const result = dom.html();
  return result;
};

export const s7Steps: StepObject[] = [
  { stepFn: waitForSelectorWithBindSelector, needArg: false },

  { stepFn: fillInputFrom, needArg: true, argKey: 'from' },
  { stepFn: fillInputTo, needArg: true, argKey: 'to' },
  { stepFn: fillInputDatepicker, needArg: true, argKey: 'date' },
  { stepFn: clickBySelectorWithBindSelector, needArg: false },
  { stepFn: clickAndWaitWithBindSelector, needArg: false },

  { stepFn: aggregatePageContent, needArg: false },
];
