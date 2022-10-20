import type { Selectors } from '../../types';


export const uralAirlineSelectors: Selectors = {
  content: 'div[data-cy="flight-stop-tooltip"]',
};

export const innerSelectors = {
  closeModalButtonSelector: 'button.uk-modal-close-outside',

  fromInputSelector: '#field32',
  toInputSelector: '#cityInputTo',

  firstSuggestionSelector: '.city-select-dropdown__list:first-child',

  datePickerSelector: '#firstDatePicker',
  reverseDatePickerSelector: 'div.calendar-switch-direction-main button',
  buttonSelector: '.ts-v2__container-button a.ticket-search__btn', // bad selector due to selecting <a> in pup

  stopSelector: '.stops',
  fullRouteSelector: 'div[data-cy="flight-stop-tooltip"]',
  fullPriceSelector: '.flights-list div.price',

  priceSelector: 'span[data-cy="u6-price"]',
  flightsSelector: '.d-flex.mb-14',
  planeModelSelector: '.text-normal.mb-4.text-left .text-light.text-s.ml-10',
  flightNumberSelector: '.text-normal.mb-4.text-left > span:first-child',
  flightTimeSelector: '.airport-wrapper > span:first-child',
  flightAirportSelector: '.airport-wrapper .text-light',

  transfersSelector: '.d-flex.align-items-center.mt-16',
  transferTimeSelector: '.text-xs.text-light',
};
