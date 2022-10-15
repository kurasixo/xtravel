import type { Page } from 'puppeteer';
import { AdditionalArgsType } from './parsers/simpleParser';


export type Site = string;
export type Selector = string;


export type StepFn = (page: Page, ...args: unknown[]) => Promise<void>;
export type FnPromiseType<T> = (...args: unknown[]) => Promise<T>;

export type ParserConfig = {
  url: Site;
  parserName: string;
};

export type Selectors = {
  content: Selector;
};

export type SelectorsHeadless = {
  contentMany: Selector;
}

export type Processors<E> = {
  each?: (
    index: number,
    element: cheerio.Element,
    $: cheerio.Root,
  ) => E;
};

export type Normalizer<E, O> = (data: E, additionalArgs: AdditionalArgsType) => O;

export type VisaInfoRaw = {
  countryName: string;
  daysWithoutVisa: string;
  docs: string;
  visaPrice?: string;
};

export type Price = {
  value: number;
  currency: string; // one of
};

export type RawPrice = {
  value: string;
  currency: string; // one of
};

export type VisaInfo = {
  id: string;
  countryName: string;
  daysWithoutVisa: (number | string)[];
  docs: string[];
  visaPrice: Price | 'free';
};

export type FlightInfo = {
  date: string,
  time: number,
  price: Price,
}

type Airport = {
  name: string;
  terminal: string;
}

export type Transfer = {
  transferTime: number;
  transferChange: string | null;
}

export type RawTransfer = {
  transferTime: string | null;
  transferChange: string | null;
}

export type Flight = {
  planeModel: string | null;
  flightCompany: string | null;
  flightNumber: string | null;

  timeFrom: string | null;
  timeTo: string | null;

  fromAirport: Airport;
  toAirport: Airport;
}

export type RawRoute = {
  price: RawPrice;
  transfers: RawTransfer[],
  flights: Flight[],
}

export type Route = {
  price: Price;
  transfers: Transfer[],
  flights: Flight[],
}

export type RouteByName = {
  [k: string]: Route[]
}

export type LastOfArray<T> =
  T extends [...rest: unknown[], last: infer L]
    ? L
    : never;
