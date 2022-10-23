import { innerSelectors } from './selectors';
import type {
  Flight,
  Processors,
  RawRoute,
  RawTransfer,
} from '../parsers.types';



const getFlightAsObject = ($: cheerio.Root, flightElement: cheerio.Element): Flight => {
  const planeModel = $(flightElement).find('.FlightInfo-plane').text();
  const flightCompany = $(flightElement).find('.FlightInfo-ak').text();
  const flightNumber = $(flightElement).find('.FlightInfo-flight').text();

  const timeFrom = $(flightElement).find('.FlightInfo-departure-time').text();
  const timeTo = $(flightElement).find('.FlightInfo-arrival-time').text();

  const fromAirportName = $(flightElement).find('.FlightInfo-departure .FlightInfo-airport').text();
  const toAirportName = $(flightElement).find('.FlightInfo-arrival .FlightInfo-airport').text();

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
    const prices = Array.from(rootFlight.find(innerSelectors.innerPrices))
      .map(el => ({ value: $(el).text(), currency: '' }));

    const flights = Array.from(rootFlight.find('.FlightInfo-table .FlightInfo-row'))
      .map((el) => getFlightAsObject($, el));

    const transfers = Array.from(rootFlight.find('.FlightInfo-table .FlightInfo-stopover-row:nth-child(2)'))
      .map((el) => getTransferAsObject($, el));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
