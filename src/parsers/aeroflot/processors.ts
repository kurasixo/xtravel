import type { Flight, Processors, RawRoute, RawTransfer } from '../../types';
import { innerSelectors } from './selectors';


const getFlightAsObject = (flightElement: cheerio.Cheerio): Flight | null => {
  const flightObjectElement = flightElement.find(innerSelectors.rootFlightFromSelector);
  const toFlightObjectElement = flightElement.find(innerSelectors.rootFlightToSelector);

  if (flightObjectElement.text() === '') {
    return null;
  }

  const flightNumber = flightElement.find(innerSelectors.flightNumberSelector).text();
  const flightCompany = flightElement.find(innerSelectors.flightCompanySelector).text();
  const planeModel = flightElement.find(innerSelectors.flightPlaneSelector).text();

  const flightObject: Flight = {
    planeModel,
    flightNumber,
    flightCompany,

    timeFrom: flightObjectElement.find(innerSelectors.flightTimeSelector).text(),
    timeTo: toFlightObjectElement.find(innerSelectors.flightTimeSelector).text(),

    fromAirport: {
      name: flightObjectElement.find(innerSelectors.flightAirportNameSelector).text(),
      terminal: flightObjectElement.find(innerSelectors.flightAirportTerminalSelector).text(),
    },

    toAirport: {
      name: toFlightObjectElement.find(innerSelectors.flightAirportNameSelector).text(),
      terminal: toFlightObjectElement.find(innerSelectors.flightAirportTerminalSelector).text(),
    }
  };

  return flightObject;
};

export const getTransfer = (transferElement: cheerio.Cheerio) => {
  const transferRoot = transferElement.find(innerSelectors.flightTransferSelector);
  const transferTime = transferRoot.find(innerSelectors.flightTransferTimeSelector).text();
  const transferChange = transferRoot.find(innerSelectors.flightTransferChangeSelector).text();

  return { transferTime, transferChange };
};

export const aeroflotProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const flightsRoute = rootFlight.find(innerSelectors.rootFlightRowSelector);
    const flightsRouteArray = Array.from(flightsRoute);

    const price = rootFlight.find(innerSelectors.flightPriceSelector).text();

    const flightsWithTransfers = flightsRouteArray
      .reduce((acc: { flights: Flight[], transfers: RawTransfer[] }, el) => {
        const elementAsCheerio = $(el);
        const flight = getFlightAsObject(elementAsCheerio);

        if (flight !== null) {
          acc.flights.push(flight);
        } else {
          const transfer = getTransfer(elementAsCheerio);
          acc.transfers.push(transfer);
        }

        return acc;
      }, { flights: [], transfers: [] });

    const res: RawRoute = {
      flights: flightsWithTransfers.flights,
      transfers: flightsWithTransfers.transfers,
      price: {
        value: price,
        currency: 'rub',
      },
    };

    return res;
  },
};
