import type { Selectors } from '../parsers.types';


export const utairSelectors: Selectors = {
  content: '.FlightInfo.FlightInfoBlock-Tooltip',
};

export const innerSelectors = {
  suggestionsFields: '.SearchWidget-box.-city',
  firstSuggestion: '.CityAutocomplete-name',

  fromInputSelector: 'input[data-testid="SearchWidgetDepartureInput"]',
  toInputSelector: 'input[data-testid="SearchWidgetArrivalInput"]',

  datePickers: '.SearchWidget-input.-select',
  calendars: '.CalendarMonthGrid_month__horizontal:not(.CalendarMonthGrid_month__hidden)',
  calendarsMonths: '.CalendarMonthGrid_month__horizontal:not(.CalendarMonthGrid_month__hidden) .CalendarMonth_caption',
  calendarsDay: 'td.CalendarDay',

  searchButton: 'button[data-testid="SearchWidgetFindButton"]',

  flights: '.FlightInfo.FlightInfoBlock-Tooltip',
  prices: '.FlightRow-Cell .OfferControl',
  innerPrices: '#innerPrice',
};
