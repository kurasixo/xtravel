import type {
  Flight,

  Route,
  RawRoute,
  RouteByName,

  Transfer,
  RawTransfer,

  Price,
  RawPrice,

  AdditionalArgsType,
} from '../parsers.types';


const normalizeFlight = (flight: Flight): Flight => {
  const parentesisRe = /[()]/g;
  const { fromAirport, toAirport, flightNumber, timeFrom, timeTo } = flight;
  const flightNumberNormal = flightNumber?.split('Рейс ')[1];

  const toAirportName = toAirport.name.replaceAll(parentesisRe, '');
  const fromAirportName = fromAirport.name.replaceAll(parentesisRe, '');

  return {
    ...flight,
    timeTo: timeTo.trim(),
    timeFrom: timeFrom.trim(),
    flightNumber: flightNumberNormal,

    toAirport: {
      ...toAirport,
      name: toAirportName,
    },

    fromAirport: {
      ...fromAirport,
      name: fromAirportName,
    }
  };
};

const normalizeTransfer = (transfer: RawTransfer): Transfer => {
  const ruAlpha = /[а-я]/g;
  const [hours, minutes] = transfer.transferTime
    .replace(ruAlpha, '')
    .split(' ')
    .filter(el => el);

  const newTime = (+hours * 60) + (+minutes);

  return {
    transferTime: newTime,
    transferChange: transfer.transferChange,
  };
};

const normalizePrice = (price: RawPrice | RawPrice[]): Price | Price[] => {
  const ruAlpha = /[а-я]/g;

  if (Array.isArray(price)) {
    return price.map((priceItem) => {
      const splittedMagicPrice = priceItem.value.split(' ')
        .filter((word) => !ruAlpha.test(word));
      const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
      const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 1);

      return {
        value: +(rest.join('')),
        currency,
      };
    });
  }

  const splittedMagicPrice = price.value.split(' ')
    .filter((word) => !ruAlpha.test(word));
  const currency = splittedMagicPrice[splittedMagicPrice.length - 1];
  const rest = splittedMagicPrice.slice(0, splittedMagicPrice.length - 2);

  return {
    value: +(rest.join('')),
    currency,
  };
};

const normalizeRoute = (rawRoute: RawRoute): Route => {
  const newFlights = rawRoute.flights.map(normalizeFlight);
  const newTransfers = rawRoute.transfers.map(normalizeTransfer);

  const newPrice = normalizePrice(rawRoute.price);

  return {
    price: newPrice,
    flights: newFlights,
    transfers: newTransfers,
  };
};

export const uralAirlineNormalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RouteByName[] => {
  const routes = rawRoutes.map(normalizeRoute);
  const [from, to] = additionalArgs[0].dataForStep;
  const routeName = `${from}_${to}`;

  return [{
    [routeName]: routes,
  }];
};
