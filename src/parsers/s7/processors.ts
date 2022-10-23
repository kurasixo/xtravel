import { innerSelectors } from './selectors';
import type {
  Flight,
  RawRoute,
  Processors,
  RawTransfer,
} from '../parsers.types';


const getAirport = (airport: string) => {
  const splittedMagicAirport = airport.split(' ');
  if (splittedMagicAirport.length === 3) {
    return {
      name: splittedMagicAirport[2],
      terminal: splittedMagicAirport[1],
    };
  }

  return {
    name: splittedMagicAirport[1],
    terminal: '',
  };
};

const getFlightAsObject = ($: cheerio.Root, flightElement: cheerio.Cheerio): Flight => {
  const [from, to] = Array.from(flightElement.find(innerSelectors.locationsSelector));

  const [timeFrom, timeTo] = [
    $(from).find(innerSelectors.timeSelector).text(),
    $(to).find(innerSelectors.timeSelector).text(),
  ];

  const [fromAirportString, toAirportString] = [
    $(from).find(innerSelectors.airportSelector).text(),
    $(to).find(innerSelectors.airportSelector).text(),
  ];

  const fromAirport = getAirport(fromAirportString);
  const toAirport = getAirport(toAirportString);

  const planeModel = flightElement.find(innerSelectors.planeModelSelector).text();
  const [flightCompany, flightNumber] = flightElement
    .find(innerSelectors.flightNumberSelector)
    .text()
    .split(' ');

  return {
    planeModel,
    flightCompany,
    flightNumber,

    timeFrom,
    timeTo,

    fromAirport,
    toAirport,
  };
};

export const getTransferAsObject = (
  $: cheerio.Root,
  transferElement: cheerio.Cheerio,
): RawTransfer => {
  const [, transferTime] = transferElement.text().split('Пересадка: ');

  return {
    transferTime,
    transferChange: 'unavailable',
  };
};

export const s7Processors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const priceElements = rootFlight.find(innerSelectors.priceSelector);
    const prices = Array
      .from(priceElements)
      .map(el => ({ value: $(el).text(), currency: 'rub' }));

    const flightsRouteArray = Array.from(rootFlight.find(innerSelectors.rootFlightsSelector));
    const flights = flightsRouteArray.map((flightEl) => getFlightAsObject($, $(flightEl)));

    const transfersRouteArray = Array.from(rootFlight.find(innerSelectors.rootTransfersSelector));
    const transfers = transfersRouteArray
      .map((transferEl) => getTransferAsObject($, $(transferEl)));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
