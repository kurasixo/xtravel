import type { Selectors } from '../../types';


export const s7Selectors: Selectors = {
  content: 'div[data-qa="tripItem"]',
};

export const innerSelectors = {
  fromInputSelector: 'input[data-test="searchAirportDepartureBlock:suggestField:fieldInput:inputBase"]',
  fromInputFirstSuggestionSelector: 'li[data-test="searchAirportDepartureBlock:suggestField:suggestions:0:suggestion"]',

  toInputSelector: 'input[data-test="searchAirportArrivalBlock:suggestField:fieldInput:inputBase"]',
  toInputFirstSuggestionSelector: 'li[data-test="searchAirportArrivalBlock:suggestField:suggestions:0:suggestion"]',

  datePickerSelector: 'button[data-qa="dateOutBound_block"]',
  datePickerSelectorTo: 'button.UK_Button__root.UK_Button__theme_secondary.UK_Button__size_medium',

  buttonSelector: 'button[data-qa="submit_searchFlight"]',

  priceSelector: 'div[data-qa="cost_tariffItem"]',
  stopSelector: '.stops_1_p',

  rootFlightsSelector: 'div[data-qa="description_segmentItem"]',
};
