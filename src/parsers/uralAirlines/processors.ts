import type { Flight, Processors, RawRoute } from '../../types';
import { innerSelectors } from './selectors';


const getFlightAsObject = ($: cheerio.Root, flightEl: cheerio.Cheerio): Flight => {
  const flightCompany = 'Ural Airlines';
  const planeModel = flightEl.find(innerSelectors.planeModelSelector).text();
  const flightNumber = flightEl.find(innerSelectors.flightNumberSelector).text();

  const [timeFrom, timeTo] = Array.from(flightEl.find(innerSelectors.flightTimeSelector))
    .map(el => $(el).text());

  const [fromAirport, toAirport] = Array.from(flightEl.find(innerSelectors.flightAirportSelector))
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
  const transferTime = transferEl.find(innerSelectors.transferTimeSelector).text();

  return {
    transferTime,
    transferChange: null,
  };
};

export const uralAirlineProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const prices = Array.from(rootFlight.find(innerSelectors.priceSelector))
      .map((priceEl) => ({ value: $(priceEl).text(), currency: '' }));

    const flightsRouteArray = Array.from(rootFlight.find(innerSelectors.flightsSelector));
    const flights = flightsRouteArray.map((flightEl) => getFlightAsObject($, $(flightEl)));

    const transfersRouteArray = Array.from(rootFlight.find(innerSelectors.transfersSelector));
    const transfers = transfersRouteArray
      .map((transferEl) => getTransferAsObject($, $(transferEl)));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
