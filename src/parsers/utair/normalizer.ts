import type { Flight, Price, RawPrice, RawRoute, RawTransfer, Route, RouteByName, Transfer } from '../../types';
import type { AdditionalArgsType } from '../parser';


const normalizeFlightCompany = (flight: Flight): Flight => {
  return {
    ...flight,
    flightCompany: flight.flightCompany.toLocaleLowerCase(),
  };
};


const normalizeTransfer = (rawTransfer: RawTransfer): Transfer => {
  const ruAlpha = /[а-яА-Я]/g;
  const [hours, , minutes] = rawTransfer.transferTime
    .replace(ruAlpha, '')
    .trim()
    .split(' ');

  return {
    transferTime: (+hours * 60) + (+minutes),
    transferChange: 'unavailable',
  };
};

const normalizePrice = (rawPrice: RawPrice | RawPrice[]): Price | Price[] => {
  if (Array.isArray(rawPrice)) {
    return rawPrice
      .filter(el => el.value !== '-')
      .map((rawPriceItem) => {
        const splittedMagicPrice = rawPriceItem.value.split(String.fromCharCode(160)); // nbsp
        const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
        const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 1);

        return {
          value: +(rest.join('')),
          currency,
        };
      });
  }

  const splittedMagicPrice = rawPrice.value.split(' ');
  const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
  const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 2);

  return {
    value: +(rest.join('')),
    currency,
  };
};

export const utairNormalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RouteByName[] => {
  const routes: Route[] = rawRoutes.map(({ flights, transfers, price }) => {
    const normalFlights = flights.map(normalizeFlightCompany);
    const normalTransfers = transfers.map(normalizeTransfer);
    const normalPrice = normalizePrice(price);

    return {
      price: normalPrice,
      transfers: normalTransfers,
      flights: normalFlights,
    };
  });

  const [from, to] = additionalArgs[0].dataForStep;
  const routeName = `${from}_${to}`;

  return [{
    [routeName]: routes,
  }];
};
