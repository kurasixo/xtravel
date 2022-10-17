import type { Price, RawPrice, RawRoute, Route, RouteByName } from '../../types';
import { AdditionalArgsType } from '../parser';


const normalizeTime = (time: string, separator = ':') => {
  return time.split(separator).reduce((acc, el, index) => {
    if (index === 0) {
      acc += +el * 60;
    } else {
      acc += +el;
    }
    return acc;
  }, 0);
};

const normalizeTransferTime = (time: string | null) => {
  if (time === null) {
    return 0;
  }

  const numericalRegex = /[^0-9 ]+/g;
  const timeWithoutLetters = time.replace(numericalRegex, '').trim();
  return normalizeTime(timeWithoutLetters, ' ');
};

const normalizePrice = (rawPriceValue: string | null): number => {
  if (rawPriceValue === null) {
    return 0;
  }

  const numericalRegex = /[^0-9]+/g;
  return +rawPriceValue.replace(numericalRegex, '');
};

export const aeroflotNormalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RouteByName[] => {
  const routes: Route[] = rawRoutes.map((rawRoute) => {
    const normalizedPrice: Price = {
      value: normalizePrice((rawRoute.price as RawPrice).value),
      currency: (rawRoute.price as RawPrice).currency,
    };

    const normalizedTransfers = rawRoute.transfers.map((rawTransfer) => {
      return {
        ...rawTransfer,
        transferTime: normalizeTransferTime(rawTransfer.transferTime)
      };
    });

    return {
      ...rawRoute,
      price: normalizedPrice,
      transfers: normalizedTransfers,
    };
  });

  const [from, to] = additionalArgs[0].dataForStep;
  const routeName = `${from}_${to}`;

  return [{
    [routeName]: routes,
  }];
};
