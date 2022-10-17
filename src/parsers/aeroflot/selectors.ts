import type { Selectors } from '../../types';


export const aeroflotSelectors: Selectors = {
  content: '.flight-search__inner',
};

export const innerSelectors = {
  rootFlightToSelector: '.time-destination__to',
  rootFlightFromSelector: '.time-destination__from',
  flightTimeSelector: '.time-destination__time',
  flightAirportNameSelector: '.time-destination__airport',
  flightAirportTerminalSelector: '.time-destination__terminal',

  rootFlightRowSelector: '.flight-search__flights',
  flightTransferSelector: '.flight-search__transfer',
  flightTransferTimeSelector: '.flight-search__transfer .h-display--inline-block',
  flightTransferChangeSelector: '.flight-search__transfer .h-color--orange',

  flightPriceSelector: '.flight-search__price-text',

  flightCompanyElementSelector: '.flight-search__company',
  flightNumberSelector: '.flight-search__company .flight-search__plane-number',
  flightCompanySelector: '.flight-search__company .flight-search__company-name',
  flightPlaneSelector: '.flight-search__plane-model',

  fromInputSelector: '#ticket-city-departure-0-booking',
  toInputSelector: '#ticket-city-arrival-0-booking',
  datePickerSelector: '#ticket-date-from-booking',
  buttonSelector: 'button[type="submit"]',
};
