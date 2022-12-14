import type {
  ParserStepsArguments,
  Price,
  RawPrice,
  RawRoute,
  RawTransfer,
  Route,
  RouteByName,
  Transfer,
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

export const getS7Normalizer = (
  parserStepsArguments: ParserStepsArguments
) => (rawRoutes: RawRoute[]): RouteByName[] => {
  const routes: Route[] = rawRoutes.map((rawRoute) => {
    const normalizedPrice = normalizePrice(rawRoute.price);
    const normalizedTransfers = rawRoute.transfers.map(normalizeTransfer);

    return {
      ...rawRoute,
      price: normalizedPrice,
      transfers: normalizedTransfers,
    };
  });

  const { from, to } = parserStepsArguments;
  const routeName = `${from}_${to}`;

  return [{
    [routeName]: routes,
  }];
};
