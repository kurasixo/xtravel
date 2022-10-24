import {
  AdditionalArgsType,
  createPageForNew,
  createPageForOld,
  goByNewSteps,
  goByOldSteps,
} from '../../parser/parserTestUtil';
import { aeroflotSteps as aeroflotStepsNew } from '../steps';
import { defaultWaitUntilOptions } from '../../../utils/network/headless/launchBrowser';
import { stepsSelectors } from '../selectors';
import type { Page } from 'puppeteer';
import type { StepFn } from '../../parsers.types';


const inputParamsForNew = { date: 'date', to: 'to', from: 'from' };
const inputParamsForOld: AdditionalArgsType = ['from', 'to', 'date'];

const oldStep: StepFn = async (page: Page, data: string[]) => {
  const [from, to, date] = data;

  /* start clearing form */
  await page.waitForSelector(stepsSelectors.fromInputSelector);
  const fromInputElement = await page.$(stepsSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  const inputValue = await page.$eval(stepsSelectors.fromInputSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
  }
  /* end clearing form */

  /* start entering "from" value */
  await page.keyboard.type(from);
  await page.keyboard.press('Enter');
  /* end entering "from" value */

  /* start entering "to" value */
  const toInputElement = await page.$(stepsSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();
  await page.keyboard.type(to);
  await page.keyboard.press('Enter');
  /* end entering "to" value */

  /* start entering "date" value */
  const datePicker = await page.$(stepsSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const datePickerValue = await page.$eval(stepsSelectors.datePickerSelector, el => el.getAttribute('value')) || '';
  for (let i = 0; i < datePickerValue.length; i++) {
    await page.keyboard.press('Backspace');
  }

  await page.keyboard.type(date);
  await page.keyboard.press('Enter');
  /* end entering "date" value */

  await page.keyboard.press('Tab'); // focus to next element

  const searchButton = await page.$(stepsSelectors.buttonSelector);
  await searchButton?.click();

  await page.waitForNavigation(defaultWaitUntilOptions);
};

describe('refactoring steps test', () => {
  describe('should work like before', () => {
    // @ts-ignore
    let oldRes = null;
    // @ts-ignore
    let newRes = null;

    const { pageForNew, firstClickableElement } = createPageForNew();
    const { pageForOld, secondClickableElement } = createPageForOld();

    beforeAll(async () => {
      // @ts-ignore
      newRes = await goByNewSteps(pageForNew, aeroflotStepsNew, inputParamsForNew);
      // @ts-ignore
      oldRes = await goByOldSteps(pageForOld, oldStep, inputParamsForOld);
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

      it('should eval same value on same selector "stepsSelectors.fromInputSelector"', () => {
        // @ts-ignore
        expect(pageForNew.$eval.mock.calls[0][0])
          .toEqual(stepsSelectors.fromInputSelector);
        // @ts-ignore
        expect(pageForNew.$eval.mock.calls[0][0])
          // @ts-ignore
          .toEqual(pageForOld.$eval.mock.calls[0][0]);
      });

      it('should clear form and press backspace 5 times', () => {
        for (let i = 0; i < '$eval'.length; i++) {
          expect(pageForNew.keyboard.press.mock.calls[i])
            .toEqual(['Backspace']);
          expect(pageForNew.keyboard.press.mock.calls[i])
            .toEqual(pageForOld.keyboard.press.mock.calls[i]);
        }
      });

      it('should type same content', () => {
        expect(pageForNew.keyboard.type.mock.calls[0])
          .toEqual(['from']);
        expect(pageForNew.keyboard.type.mock.calls[0])
          .toEqual(pageForOld.keyboard.type.mock.calls[0]);
      });

      it('should confirm content with enter', () => {
        expect(pageForNew.keyboard.press.mock.calls[5])
          .toEqual(['Enter']);
        expect(pageForNew.keyboard.press.mock.calls[5])
          .toEqual(pageForOld.keyboard.press.mock.calls[5]);
      });
    });

    describe('second step: input "to" input', () => {
      it('should select by same "to" selector "stepsSelectors.toInputSelector"', () => {
        expect(pageForNew.$.mock.calls[1])
          .toEqual([stepsSelectors.toInputSelector]);
        expect(pageForNew.$.mock.calls[1])
          .toEqual(pageForOld.$.mock.calls[1]);
      });

      it('should click on same "to" element', ()  => {
        expect(firstClickableElement.click.mock.calls[1])
          .toEqual(secondClickableElement.click.mock.calls[1]);
      });

      it('should focus on same "to" element', () => {
        expect(firstClickableElement.focus.mock.calls[1])
          .toEqual(secondClickableElement.focus.mock.calls[1]);
      });

      it('should type same content', () => {
        expect(pageForNew.keyboard.type.mock.calls[1])
          .toEqual(['to']);
        expect(pageForNew.keyboard.type.mock.calls[1])
          .toEqual(pageForOld.keyboard.type.mock.calls[1]);
      });

      it('should confirm content with enter', () => {
        expect(pageForNew.keyboard.press.mock.calls[6])
          .toEqual(['Enter']);
        expect(pageForNew.keyboard.press.mock.calls[6])
          .toEqual(pageForOld.keyboard.press.mock.calls[6]);
      });
    });

    describe('third step: input "datepicker" input', () => {
      it('should select by same "from" selector "stepsSelectors.datePickerSelector"', () => {
        expect(pageForNew.$.mock.calls[2])
          .toEqual([stepsSelectors.datePickerSelector]);
        expect(pageForNew.$.mock.calls[2])
          .toEqual(pageForOld.$.mock.calls[2]);
      });

      it('should click on same "datepicker" element', ()  => {
        expect(firstClickableElement.click.mock.calls[2])
          .toEqual(secondClickableElement.click.mock.calls[2]);
      });

      it('should focus on same "datepicker" element', () => {
        expect(firstClickableElement.focus.mock.calls[2])
          .toEqual(secondClickableElement.focus.mock.calls[2]);
      });

      it('should eval same value on same selector "stepsSelectors.datePickerSelector"', () => {
        // @ts-ignore
        expect(pageForNew.$eval.mock.calls[1][0])
          .toEqual(stepsSelectors.datePickerSelector);
        // @ts-ignore
        expect(pageForNew.$eval.mock.calls[1][0])
          // @ts-ignore
          .toEqual(pageForOld.$eval.mock.calls[1][0]);
      });

      it('should clear form and press backspace 5 times', () => {
        for (let i = 7; i < 7 + '$eval'.length; i++) {
          expect(pageForNew.keyboard.press.mock.calls[i])
            .toEqual(['Backspace']);
          expect(pageForNew.keyboard.press.mock.calls[i])
            .toEqual(pageForOld.keyboard.press.mock.calls[i]);
        }
      });

      it('should type same content', () => {
        expect(pageForNew.keyboard.type.mock.calls[2])
          .toEqual(['date']);
        expect(pageForNew.keyboard.type.mock.calls[2])
          .toEqual(pageForOld.keyboard.type.mock.calls[2]);
      });

      it('should confirm content with enter', () => {
        expect(pageForNew.keyboard.press.mock.calls[12])
          .toEqual(['Enter']);
        expect(pageForNew.keyboard.press.mock.calls[12])
          .toEqual(pageForOld.keyboard.press.mock.calls[12]);
      });
    });

    describe('fourth step: should move focus', () => {
      it ('should move focus with tab', () => {
        expect(pageForNew.keyboard.press.mock.calls[13])
          .toEqual(['Tab']);
        expect(pageForNew.keyboard.press.mock.calls[13])
          .toEqual(pageForOld.keyboard.press.mock.calls[13]);
      });
    });

    describe('fifth step: click search button', () => {
      it ('should select sane button with "stepsSelectors.buttonSelector"', () => {
        expect(pageForNew.$.mock.calls[3])
          .toEqual([stepsSelectors.buttonSelector]);
        expect(pageForNew.$.mock.calls[3])
          .toEqual(pageForOld.$.mock.calls[3]);
      });

      it ('should click selected element', () => {
        expect(firstClickableElement.click.mock.calls[3])
          .toEqual(secondClickableElement.click.mock.calls[3]);
      });
    });

    describe('sixth step: check content', () => {
      it('should have equal content', () => {
        // @ts-ignore
        expect(oldRes).toEqual(newRes);
      });
    });
  });
});
