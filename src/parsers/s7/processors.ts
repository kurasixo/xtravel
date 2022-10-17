import type { Flight, Processors, RawPrice, RawRoute, RawTransfer } from '../../types';
import { innerSelectors } from './selectors';


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
  const [from, to] = Array.from(flightElement.find('div.location_1Wo'));

  const [timeFrom, timeTo] = [
    $(from).find('span.time_2cy').text(),
    $(to).find('span.time_2cy').text(),
  ];

  const [fromAirportString, toAirportString] = [
    $(from).find('div.row_2fG').text(),
    $(to).find('div.row_2fG').text(),
  ];

  const fromAirport = getAirport(fromAirportString);
  const toAirport = getAirport(toAirportString);

  const planeModel = flightElement.find('.desc_3I4').text();
  const [flightCompany, flightNumber] = flightElement
    .find('span.flight_number_22v')
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

export const getTransferAsObject = ($: cheerio.Root, transferElement: cheerio.Cheerio): RawTransfer => {
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
    const prices: RawPrice[] = Array
      .from(priceElements)
      .map(el => ({ value: $(el).text(), currency: 'rub' }));

    const flightsRouteArray = Array.from(rootFlight.find(innerSelectors.rootFlightsSelector));
    const flights = flightsRouteArray.map((flightEl) => getFlightAsObject($, $(flightEl)));

    const transfersRouteArray = Array.from(rootFlight.find('span.text_1la'));
    const transfers = transfersRouteArray.map((transferEl) => getTransferAsObject($, $(transferEl)));

    return {
      flights,
      transfers,
      price: prices,
    };
  },
};
