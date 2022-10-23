import { processorSelectors } from './selectors';
import type { Flight, Processors, RawRoute, RawTransfer } from '../parsers.types';


const getFlightAsObject = (flightElement: cheerio.Cheerio): Flight | null => {
  const flightObjectElement = flightElement.find(processorSelectors.rootFlightFromSelector);
  const toFlightObjectElement = flightElement.find(processorSelectors.rootFlightToSelector);

  if (flightObjectElement.text() === '') {
    return null;
  }

  const flightNumber = flightElement.find(processorSelectors.flightNumberSelector).text();
  const flightCompany = flightElement.find(processorSelectors.flightCompanySelector).text();
  const planeModel = flightElement.find(processorSelectors.flightPlaneSelector).text();

  const flightObject: Flight = {
    planeModel,
    flightNumber,
    flightCompany,

    timeFrom: flightObjectElement.find(processorSelectors.flightTimeSelector).text(),
    timeTo: toFlightObjectElement.find(processorSelectors.flightTimeSelector).text(),

    fromAirport: {
      name: flightObjectElement.find(processorSelectors.flightAirportNameSelector).text(),
      terminal: flightObjectElement.find(processorSelectors.flightAirportTerminalSelector).text(),
    },

    toAirport: {
      name: toFlightObjectElement.find(processorSelectors.flightAirportNameSelector).text(),
      terminal: toFlightObjectElement
        .find(processorSelectors.flightAirportTerminalSelector).text(),
    }
  };

  return flightObject;
};

export const getTransfer = (transferElement: cheerio.Cheerio) => {
  const transferRoot = transferElement.find(processorSelectors.flightTransferSelector);
  const transferTime = transferRoot.find(processorSelectors.flightTransferTimeSelector).text();
  const transferChange = transferRoot
    .find(processorSelectors.flightTransferChangeSelector).text();

  return { transferTime, transferChange };
};

export const aeroflotProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const flightsRoute = rootFlight.find(processorSelectors.rootFlightRowSelector);
    const flightsRouteArray = Array.from(flightsRoute);

    const price = rootFlight.find(processorSelectors.flightPriceSelector).text();

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
