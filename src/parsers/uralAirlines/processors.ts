import { processorSelectors } from './selectors';
import type {
  Flight,
  Processors,
  RawRoute,
} from '../parsers.types';


const getFlightAsObject = ($: cheerio.Root, flightEl: cheerio.Cheerio): Flight => {
  const flightCompany = 'Ural Airlines';
  const planeModel = flightEl.find(processorSelectors.planeModelSelector).text();
  const flightNumber = flightEl.find(processorSelectors.flightNumberSelector).text();

  const [timeFrom, timeTo] = Array.from(flightEl.find(processorSelectors.flightTimeSelector))
    .map(el => $(el).text());

  const [fromAirport, toAirport] = Array.from(
    flightEl.find(processorSelectors.flightAirportSelector)
  )
    .map(el => ({ name: $(el).text(), terminal: '' }));

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

const getTransferAsObject = ($: cheerio.Root, transferEl: cheerio.Cheerio) => {
  const transferTime = transferEl.find(processorSelectors.transferTimeSelector).text();

  return {
    transferTime,
    transferChange: null,
  };
};

export const uralAirlineProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const prices = Array.from(rootFlight.find(processorSelectors.priceSelector))
      .map((priceEl) => ({ value: $(priceEl).text(), currency: '' }));

    const flightsRouteArray = Array.from(rootFlight.find(processorSelectors.flightsSelector));
    const flights = flightsRouteArray.map((flightEl) => getFlightAsObject($, $(flightEl)));

    const transfersRouteArray = Array.from(rootFlight.find(processorSelectors.transfersSelector));
    const transfers = transfersRouteArray
      .map((transferEl) => getTransferAsObject($, $(transferEl)));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
