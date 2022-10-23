import type { Selectors } from '../parsers.types';


export const s7Selectors: Selectors = {
  content: 'div[data-qa="tripItem"]',
};

export const processorSelectors = {
  priceSelector: 'div[data-qa="cost_tariffItem"]',
  rootFlightsSelector: 'div[data-qa="description_segmentItem"]',
  rootTransfersSelector: 'span.text_1la',

  timeSelector: 'span.time_2cy',
  airportSelector: 'div.row_2fG',
  planeModelSelector: '.desc_3I4',
  flightNumberSelector: 'span.flight_number_22v',
  locationsSelector: 'div.location_1Wo',
};

export const stepsSelectors = {
  fromInputSelector: 'input[data-test="searchAirportDepartureBlock:suggestField:fieldInput:inputBase"]',
  fromInputFirstSuggestionSelector: 'li[data-test="searchAirportDepartureBlock:suggestField:suggestions:0:suggestion"]',

  toInputSelector: 'input[data-test="searchAirportArrivalBlock:suggestField:fieldInput:inputBase"]',
  toInputFirstSuggestionSelector: 'li[data-test="searchAirportArrivalBlock:suggestField:suggestions:0:suggestion"]',

  datePickerSelector: 'button[data-qa="dateOutBound_block"]',
  datePickerSelectorTo: 'button.UK_Button__root.UK_Button__theme_secondary.UK_Button__size_medium',

  buttonSelector: 'button[data-qa="submit_searchFlight"]',

  stopSelector: '.stops_1_p',
  dateTimeSelector: 'time',
};
