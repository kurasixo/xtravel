import cheerio from 'cheerio';
import type { WaitForOptions } from 'puppeteer';
import type { StepFn } from '../../types';
import { innerSelectors, s7Selectors } from '../s7/selectors';


const fillFlightForm: StepFn = async (page, data: string[]) => {
  const [from, to, date] = data;

  const waitUntilOptions: WaitForOptions = {
    waitUntil: 'networkidle2'
  };

  await page.waitForSelector(innerSelectors.fromInputSelector);
  const fromInputElement = await page.$(innerSelectors.fromInputSelector);
  await fromInputElement?.click();
  await fromInputElement?.focus();

  await page.keyboard.type(from.slice(0, 5), { delay: 300 });

  await page.waitForSelector(innerSelectors.fromInputFirstSuggestionSelector);
  const fromInputFirstSuggestionElement = await page.$(innerSelectors.fromInputFirstSuggestionSelector);
  await fromInputFirstSuggestionElement?.click();


  const toInputElement = await page.$(innerSelectors.toInputSelector);
  await toInputElement?.click();
  await toInputElement?.focus();

  await page.keyboard.type(to.slice(0, 5), { delay: 300 });

  await page.waitForSelector(innerSelectors.toInputFirstSuggestionSelector);
  const toInputFirstSuggestionElement = await page.$(innerSelectors.toInputFirstSuggestionSelector);
  await toInputFirstSuggestionElement?.click();


  const datePicker = await page.$(innerSelectors.datePickerSelector);
  await datePicker?.click();
  await datePicker?.focus();

  const [day, month, year] = date.split('.');
  const dateSelectorString = new Date(+year, +month, +day).toString().slice(0, 15);

  const dateTimeElements = await page.$$('time');
  const magicDatetimes = await Promise.all(dateTimeElements.map((timeEl) => {
    return timeEl.evaluate((timeItself) => timeItself.dateTime.slice(0, 15));
  }));

  const foundItem = magicDatetimes.find(el => el === dateSelectorString);
  const indexOfFoundItem = magicDatetimes.indexOf(foundItem as string);

  const foundDate = dateTimeElements.find((_, index) => index === indexOfFoundItem);
  await foundDate?.click();

  const datePickerTo = await page.$(innerSelectors.datePickerSelectorTo);
  await datePickerTo?.click();

  const searchButton = await page.$(innerSelectors.buttonSelector);
  await searchButton?.click();

  await page.waitForNavigation(waitUntilOptions);

  const allStops = await page.$$(innerSelectors.stopSelector);
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
