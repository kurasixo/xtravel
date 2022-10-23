import type {
  Route,
  RawRoute,
  RouteByName,

  Transfer,
  RawTransfer,

  Price,
  RawPrice,

  AdditionalArgsType,
} from '../parsers.types';


const normalizePrice = (price: RawPrice | RawPrice[]): Price | Price[] => {
  if (Array.isArray(price)) {
    return price.map((priceItem) => {
      const splittedMagicPrice = priceItem.value.split(' ');
      const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
      const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 1);

      return {
        value: +(rest.join('')),
        currency,
      };
    });
  }
  const splittedMagicPrice = price.value.split(' ');
  const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
  const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 2);

  return {
    value: +(rest.join('')),
    currency,
  };
};

const normalizeTransfer = (transfer: RawTransfer): Transfer => {
  const ruAlpha = /[а-я]/g;
  const [hours, minutes] = transfer.transferTime
    .replace(ruAlpha, '')
    .split('');

  return {
    ...transfer,
    transferTime: (+hours * 60) + (+minutes),
  };
};

export const s7Normalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RouteByName[] => {
  const routes: Route[] = rawRoutes.map((rawRoute) => {
    const normalizedPrice = normalizePrice(rawRoute.price);
    const normalizedTransfers = rawRoute.transfers.map(normalizeTransfer);

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
