import { processorSelectors } from './selectors';
import type {
  Flight,
  Processors,
  RawRoute,
  RawTransfer,
} from '../parsers.types';


const getFlightAsObject = ($: cheerio.Root, flightElement: cheerio.Element): Flight => {
  const planeModel = $(flightElement).find(processorSelectors.planeModelSelector).text();
  const flightCompany = $(flightElement).find(processorSelectors.flightCompanySelector).text();
  const flightNumber = $(flightElement).find(processorSelectors.flightNumberSelector).text();

  const timeFrom = $(flightElement).find(processorSelectors.timeFromSelector).text();
  const timeTo = $(flightElement).find(processorSelectors.timeToSelector).text();

  const fromAirportName = $(flightElement)
    .find(processorSelectors.fromAirportNameSelector).text();
  const toAirportName = $(flightElement).find(processorSelectors.toAirportNameSelector).text();

  return {
    planeModel,
    flightCompany,
    flightNumber,

    timeFrom,
    timeTo,

    fromAirport: {
      name: fromAirportName,
      terminal: '',
    },
    toAirport: {
      name: toAirportName,
      terminal: '',
    },
  };
};

const getTransferAsObject = ($: cheerio.Root, transferElement: cheerio.Element): RawTransfer => {
  const transferChange = '';
  const transferTime = $(transferElement).text();

  return {
    transferTime,
    transferChange,
  };
};


export const utairProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    const prices = Array.from(rootFlight.find(processorSelectors.innerPrices))
      .map(el => ({ value: $(el).text(), currency: '' }));

    const flights = Array.from(rootFlight.find(processorSelectors.flightsSelector))
      .map((el) => getFlightAsObject($, el));

    const transfers = Array.from(rootFlight.find(processorSelectors.transfersSelector))
      .map((el) => getTransferAsObject($, el));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
