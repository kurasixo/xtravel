import cheerio from 'cheerio';

import { defaultWaitUntilOptions } from '../../utils/network/headless/launchBrowser';
import { stepsSelectors, s7Selectors } from '../s7/selectors';
import type { StepFn } from '../parsers.types';


// move to seperate steps
const fillFlightForm: StepFn = async (page, data: string[]) => {
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

  await page.waitForSelector(stepsSelectors.stopSelector);
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

export const s7Steps: StepFn[] = [fillFlightForm];
