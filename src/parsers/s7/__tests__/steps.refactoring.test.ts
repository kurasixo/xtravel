import cheerio from 'cheerio';

import { defaultWaitUntilOptions } from '../../../utils/network/headless/launchBrowser';
import { getStepsToUse } from '../../parser/utils';
import { goBySteps } from '../../../utils/network/headless/goBySteps';
import { s7Selectors, stepsSelectors } from '../selectors';
import { s7Steps as s7StepsNew } from '../steps';
import type { Page } from 'puppeteer';
import type { StepFn } from '../../parsers.types';


// eslint-disable-next-line
const mockAsyncFn = (...args: any[]) =>
  () => new Promise(res => res(args));

const element = {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const firstClickableElement = {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  $: jest.fn(() => element),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const pageForNew = {
  $: jest.fn(() => firstClickableElement),
  $$: jest.fn(() => [
    firstClickableElement,
    firstClickableElement,
    firstClickableElement,
    firstClickableElement,
  ]),
  waitForSelector: jest.fn(mockAsyncFn('waitForSelector')),
  keyboard: {
    type: jest.fn(mockAsyncFn('keyboard.type')),
  },
  waitForNavigation: jest.fn(mockAsyncFn('waitForNavigation')),
};

const secondClickableElement =  {
  evaluate: jest.fn(() => () => ({
    dateTime: 'dateTime',
    outerHTML: 'outerHTML',
  })),
  $: jest.fn(() => element),
  click: jest.fn(mockAsyncFn('click')),
  focus: jest.fn(mockAsyncFn('focus')),
};

const pageForOld = {
  $: jest.fn(() => secondClickableElement),
  $$: jest.fn(() => [
    secondClickableElement,
    secondClickableElement,
    secondClickableElement,
    secondClickableElement,
  ]),
  waitForSelector: jest.fn(mockAsyncFn('waitForSelector')),
  keyboard: {
    type: jest.fn(mockAsyncFn('keyboard.type')),
  },
  waitForNavigation: jest.fn(mockAsyncFn('waitForNavigation')),
};

const inputParamsForNew = { date: 'date', to: 'to', from: 'from' };
const inputParamsForOld: AdditionalArgsType = ['from', 'to', 'date'];


// old code
// eslint-disable-next-line
type AdditionalArgsType = any[];
type SingleStep = { stepFn: StepFn, dataForStep: AdditionalArgsType };
type StepResult = Promise<void | string>;
export const goByStepsOld = (steps: SingleStep[], page: Page): StepResult => {
  const initalPromise: StepResult = new Promise((resolve) => resolve());
  const stepsResPromise = steps.reduce((acc: StepResult, { stepFn, dataForStep }) => {
    if (acc === initalPromise) {
      acc = stepFn(page, dataForStep);
      return acc;
    }

    acc = acc.then(() => stepFn(page, dataForStep));
    return acc;
  }, initalPromise);

  return stepsResPromise;
};

const oldStep: StepFn = async (page: Page, data: string[]) => {
  const [from, to, date] = data;

  await page.waitForSelector(stepsSelectors.fromInputSelector);

  const fromInputElement = await page.$(stepsSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();
  await page.keyboard.type(from.slice(0, 5), { delay: 300 });
  await page.waitForSelector(stepsSelectors.fromInputFirstSuggestionSelector);
  const fromInputFirstSuggestionElement =
    await page.$(stepsSelectors.fromInputFirstSuggestionSelector);
  await fromInputFirstSuggestionElement?.click();


  const toInputElement = await page.$(stepsSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();
  await page.keyboard.type(to.slice(0, 5), { delay: 300 });
  await page.waitForSelector(stepsSelectors.toInputFirstSuggestionSelector);
  const toInputFirstSuggestionElement =
    await page.$(stepsSelectors.toInputFirstSuggestionSelector);
  await toInputFirstSuggestionElement?.click();

  const datePicker = await page.$(stepsSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();
  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month, +day).toString().slice(0, 15);
  const dateTimeElements = await page.$$(stepsSelectors.dateTimeSelector);
  const magicDatetimes = await Promise.all(dateTimeElements.map((timeEl) => {
    return timeEl.evaluate((timeItself) => (timeItself as HTMLTimeElement).dateTime.slice(0, 15));
  }));
  const foundItem = magicDatetimes.find(el => el === dateSelectorString);
  const indexOfFoundItem = magicDatetimes.indexOf(foundItem as string);
  const foundDate = dateTimeElements.find((_, index) => index === indexOfFoundItem);
  await foundDate?.click();
  const datePickerTo = await page.$(stepsSelectors.datePickerSelectorTo);
  await datePickerTo?.click();

  const searchButton = await page.$(stepsSelectors.buttonSelector);
  await searchButton?.click();
  await page.waitForNavigation(defaultWaitUntilOptions);

  await page.waitForSelector(stepsSelectors.stopSelector); // 4
  const allStops = await page.$$(stepsSelectors.stopSelector);
  const allRoutesFull = await page.$$(s7Selectors.content);

  const dom = cheerio.load('<div class="root"></div>');
  const root = dom('.root');
  for (let i = 0; i < allStops.length; i++) {
    await allStops[i].click();
    const routeItemHtmlContent = await allRoutesFull[i].evaluate((el) => el.outerHTML);
    root.append(routeItemHtmlContent);
  }

  const result = dom.html();
  return result;
};

const getOldStepsToUse = [oldStep].map((stepFn, index) => {
  return {
    stepFn,
    dataForStep: [inputParamsForOld][index],
  };
});

const goByNewSteps = (page: Page) => goBySteps(
  page,
  getStepsToUse(s7StepsNew, inputParamsForNew)
);
const goByOldSteps = (page: Page) => goByStepsOld(getOldStepsToUse, page);

describe('refactoring steps test', () => {
  describe('should work like before', () => {
    // @ts-ignore
    let oldRes = null;
    // @ts-ignore
    let newRes = null;
    beforeAll(async () => {
      // @ts-ignore
      newRes = await goByNewSteps(pageForNew);
      // @ts-ignore
      oldRes = await goByOldSteps(pageForOld);
    });

    describe('zero step: wait for selector', () => {
      it('should wait for same "from" selector "stepsSelectors.fromInputSelector"', () => {
        expect(pageForNew.waitForSelector.mock.calls[0])
          .toEqual([stepsSelectors.fromInputSelector]);
        expect(pageForNew.waitForSelector.mock.calls[0])
          .toEqual(pageForOld.waitForSelector.mock.calls[0]);
      });
    });

    describe('first step: input "from" input', () => {
      it('should select by same "from" selector "stepsSelectors.fromInputSelector"', () => {
        expect(pageForNew.$.mock.calls[0])
          .toEqual([stepsSelectors.fromInputSelector]);
        expect(pageForNew.$.mock.calls[0])
          .toEqual(pageForOld.$.mock.calls[0]);
      });

      it('should click on same "from" element', ()  => {
        expect(firstClickableElement.click.mock.calls[0])
          .toEqual(secondClickableElement.click.mock.calls[0]);
      });

      it('should focus on same "from" element', () => {
        expect(firstClickableElement.focus.mock.calls[0])
          .toEqual(secondClickableElement.focus.mock.calls[0]);
      });

      it('should type same to "from" element', () => {
        expect(pageForNew.keyboard.type.mock.calls[0])
          .toEqual(pageForOld.keyboard.type.mock.calls[0]);
      });

      it('should wait for suggestion for "from" element "stepsSelectors.fromInputFirstSuggestionSelector"', () => {
        expect(pageForNew.waitForSelector.mock.calls[1])
          .toEqual([stepsSelectors.fromInputFirstSuggestionSelector]);
        expect(pageForNew.waitForSelector.mock.calls[1])
          .toEqual(pageForOld.waitForSelector.mock.calls[1]);
      });

      it('should find same suggestion for "from" element "stepsSelectors.fromInputFirstSuggestionSelector"', () => {
        expect(pageForNew.$.mock.calls[1])
          .toEqual(pageForOld.$.mock.calls[1]);
      });

      it('should click on same suggestion for "from" element', () => {
        expect(firstClickableElement.click.mock.calls[1])
          .toEqual(secondClickableElement.click.mock.calls[1]);
      });
    });

    describe('second step: input "to" input', () => {
      it('should select by same "to" selector "stepsSelectors.toInputSelector"', () => {
        expect(pageForNew.$.mock.calls[2])
          .toEqual([stepsSelectors.toInputSelector]);
        expect(pageForNew.$.mock.calls[2])
          .toEqual(pageForOld.$.mock.calls[2]);
      });

      it('should click on same "to" element', ()  => {
        expect(firstClickableElement.click.mock.calls[2])
          .toEqual(secondClickableElement.click.mock.calls[2]);
      });

      it('should focus on same "to" element', () => {
        expect(firstClickableElement.focus.mock.calls[1])
          .toEqual(secondClickableElement.focus.mock.calls[1]);
      });

      it('should type same to "to" element', () => {
        expect(pageForNew.keyboard.type.mock.calls[1])
          .toEqual(pageForOld.keyboard.type.mock.calls[1]);
      });

      it('should wait for suggestion for "to" element "stepsSelectors.toInputFirstSuggestionSelector"', () => {
        expect(pageForNew.waitForSelector.mock.calls[2])
          .toEqual([stepsSelectors.toInputFirstSuggestionSelector]);
        expect(pageForNew.waitForSelector.mock.calls[2])
          .toEqual(pageForOld.waitForSelector.mock.calls[2]);
      });

      it('should find same suggestion for "to" element "stepsSelectors.toInputFirstSuggestionSelector"', () => {
        expect(pageForNew.$.mock.calls[3])
          .toEqual([stepsSelectors.toInputFirstSuggestionSelector]);
        expect(pageForNew.$.mock.calls[3])
          .toEqual(pageForOld.$.mock.calls[3]);
      });

      it('should click on same suggestion for "to" element', ()  => {
        expect(firstClickableElement.click.mock.calls[3])
          .toEqual(secondClickableElement.click.mock.calls[3]);
      });
    });

    describe('third step: input "datepicker" input', () => {
      it('should find same date for "datepciker" element "stepsSelectors.datePickerSelector"', () => {
        expect(pageForNew.$.mock.calls[4])
          .toEqual([stepsSelectors.datePickerSelector]);
        expect(pageForNew.$.mock.calls[4])
          .toEqual(pageForOld.$.mock.calls[4]);
      });

      it('should click on same "datepicker" element', ()  => {
        expect(firstClickableElement.click.mock.calls[3])
          .toEqual(secondClickableElement.click.mock.calls[3]);
      });

      it('should focus on same "datepicker" element', () => {
        expect(firstClickableElement.focus.mock.calls[3])
          .toEqual(secondClickableElement.focus.mock.calls[3]);
      });

      it('should focus same "dateTime" element', () => {
        expect(pageForNew.$$.mock.calls[0])
          .toEqual([stepsSelectors.dateTimeSelector]);
        expect(pageForNew.$$.mock.calls[0])
          .toEqual(pageForOld.$$.mock.calls[0]);
      });

      it.skip('should click on found "dateTime" element', () => {});
    });

    describe('fourth step: find and click on datepicker', () => {
      it('should click on datepicker "to"', () => {
        expect(pageForNew.$.mock.calls[5])
          .toEqual([stepsSelectors.datePickerSelectorTo]);
        expect(pageForNew.$.mock.calls[5])
          .toEqual(pageForOld.$.mock.calls[5]);
      });

      it.skip('should click on "to" datepicker element', () => {});
    });

    describe('fifth step: click and wait on search button', () => {
      it('should find datepicker "to" with "stepsSelectors.buttonSelector"', () => {
        expect(pageForNew.$.mock.calls[6])
          .toEqual([stepsSelectors.buttonSelector]);
        expect(pageForNew.$.mock.calls[6])
          .toEqual(pageForOld.$.mock.calls[6]);
      });

      it.skip('should click on "search" button', () => {});
    });

    describe('sixth step: check content', () => {
      it('should have equal content', () => {
        // @ts-ignore
        expect(oldRes).toEqual(newRes);
      });
    });
  });
});
