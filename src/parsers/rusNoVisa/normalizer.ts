import compose from 'lodash/fp/compose';
import type { VisaInfo, VisaInfoRaw } from './types';


type WId<O> = Omit<O, 'id'> & { id: VisaInfo['id'] };
type WNDocs<O> = Omit<O, 'docs'> & { docs: VisaInfo['docs'] };
type WNDays<O> = Omit<O, 'daysWithoutVisa'> & { daysWithoutVisa: VisaInfo['daysWithoutVisa'] };

type WIdNWNDocs<O> = WId<WNDocs<O>>;
type WIdNWNDocsNWNDays<O> = WId<WNDocs<WNDays<O>>>;

const addId = (visaInfoRaw: VisaInfoRaw, index: number): WId<VisaInfoRaw> => {
  return {
    id: `${visaInfoRaw.countryName}${index}`,
    ...visaInfoRaw,
  };
};

const normalizeDocs = (
  visaInfoRaw: WId<VisaInfoRaw>,
): WIdNWNDocs<VisaInfoRaw> => {
  const specialSymbol = '—';
  const { docs } = visaInfoRaw;

  const splittedDocs = docs
    .split(specialSymbol)
    .map(el => el.trim())
    .filter(el => el)
    .map(el => `${el[0].toUpperCase()}${el.slice(1)}`);

  return {
    ...visaInfoRaw,
    docs: splittedDocs,
  };
};

const normalizeDays = (
  visaInfoRaw: WIdNWNDocs<VisaInfoRaw>,
): WIdNWNDocsNWNDays<VisaInfoRaw> => {
  const specialSymbol = '/';
  const { daysWithoutVisa } = visaInfoRaw;

  const splittedDays = daysWithoutVisa
    .split(specialSymbol)
    .map(el => el.trim())
    .filter(el => el)
    .map(el => {
      const elAsNumber = +el;
      if (Number.isNaN(elAsNumber)) {
        return el;
      }

      return elAsNumber;
    });

  return {
    ...visaInfoRaw,
    daysWithoutVisa: splittedDays,
  };
};

const NormalizePrice = (visaPrice: string | undefined): string => {
  if (!visaPrice) {
    return 'free';
  }

  let newPrice = visaPrice?.trim();

  if (
    !newPrice ||
    newPrice === '' ||
    newPrice === '-' ||
    newPrice.toLowerCase() === 'бесплатно'
  ) {
    return 'free';
  }

  const newLineRegex = /\n/g;
  newPrice = newPrice.replace(newLineRegex, '');

  const rusRegexWithNum = /[a-я].*[0-9]/g;
  if (rusRegexWithNum.test(newPrice)) { // до 40$ и тд
    const rusRegex = /[a-я]/g;
    newPrice = newPrice.replace(rusRegex, '').trim();
  }

  return newPrice;
};

const getCurrencyByNewPriceString = (newVisaPrice: string): string => {
  const numericalRegex = /[0-9]/;
  const maybeCurrency = newVisaPrice
    .split(numericalRegex)
    .map(el => el.trim())
    .map(el => el.replace(/\//g, ''))
    .filter(el => el);

  const currency = maybeCurrency[maybeCurrency.length - 1];

  return currency;
};

const normalizeRealPrice = (newPrice: string, currency: string): number => {
  const newPriceSplitted = newPrice
    .split(currency);

  const realPrice = newPriceSplitted[0].split('').reduce((acc, char) => {
    if (char === ' ') {
      return acc;
    }

    return acc += char;
  }, '');

  return +realPrice;
};

const normalizePrice = (
  visaInfoRaw: WIdNWNDocsNWNDays<VisaInfoRaw>,
): VisaInfo => {
  const { visaPrice } = visaInfoRaw;

  const newPrice = NormalizePrice(visaPrice);
  if (newPrice === 'free') {
    return {
      ...visaInfoRaw,
      visaPrice: 'free',
    };
  }
  const currency = getCurrencyByNewPriceString(newPrice);
  const realPrice = normalizeRealPrice(newPrice, currency);

  return {
    ...visaInfoRaw,
    visaPrice: {
      currency,
      value: realPrice,
    },
  };
};

const normalize: (
  raw: VisaInfoRaw,
  index: number,
) => VisaInfo = compose(normalizePrice, normalizeDays, normalizeDocs, addId);

export const rusNoVisaNormalizer = (
  rawVisaInfos: VisaInfoRaw[],
): VisaInfo[] => rawVisaInfos.map(normalize);
