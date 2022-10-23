import { processorSelectors } from './selectors';
import type {
  Flight,
  Processors,
  RawRoute,
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
  const [from, to] = Array.from(flightElement.find(processorSelectors.locationsSelector));

  const [timeFrom, timeTo] = [
    $(from).find(processorSelectors.timeSelector).text(),
    $(to).find(processorSelectors.timeSelector).text(),
  ];

  const [fromAirportString, toAirportString] = [
    $(from).find(processorSelectors.airportSelector).text(),
    $(to).find(processorSelectors.airportSelector).text(),
  ];

  const fromAirport = getAirport(fromAirportString);
  const toAirport = getAirport(toAirportString);

  const planeModel = flightElement.find(processorSelectors.planeModelSelector).text();
  const [flightCompany, flightNumber] = flightElement
    .find(processorSelectors.flightNumberSelector)
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
    const priceElements = rootFlight.find(processorSelectors.priceSelector);
    const prices = Array
      .from(priceElements)
      .map(el => ({ value: $(el).text(), currency: 'rub' }));

    const flightsRouteArray = Array.from(rootFlight.find(processorSelectors.rootFlightsSelector));
    const flights = flightsRouteArray.map((flightEl) => getFlightAsObject($, $(flightEl)));

    const transfersRouteArray = Array.from(
      rootFlight.find(processorSelectors.rootTransfersSelector));
    const transfers = transfersRouteArray
      .map((transferEl) => getTransferAsObject($, $(transferEl)));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
