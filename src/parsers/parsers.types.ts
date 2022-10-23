import type { Page } from 'puppeteer';


export type ParserConfig = {
  url: string;
  parserName: string;
};

export type Processors<E> = {
  each?: (
    index: number,
    element: cheerio.Element,
    $: cheerio.Root,
  ) => E;
};

export type Selector = string;
export type Selectors = {
  content: Selector;
};

// eslint-disable-next-line
export type AdditionalArgsType = any[];
export type Normalizer<E, O> = (data: E, additionalArgs: AdditionalArgsType) => O;

export type StepFn = (page: Page, ...args: unknown[]) => Promise<string | void>;
export type SingleStep = { stepFn: StepFn, dataForStep: AdditionalArgsType };


export type Price = {
  value: number;
  currency: string; // one of
};

export type RawPrice = {
  value: string;
  currency: string; // one of
};

export type Transfer = {
  transferTime: number;
  transferChange: string | null;
}

export type RawTransfer = {
  transferTime: string;
  transferChange: string | null;
}

type Airport = {
  name: string;
  terminal: string;
}

export type Flight = {
  planeModel: string | null;
  flightCompany: string;
  flightNumber: string;

  timeFrom: string;
  timeTo: string;

  fromAirport: Airport;
  toAirport: Airport;
}

export type Route = {
  price: Price | Price[];
  transfers: Transfer[],
  flights: Flight[],
}

export type RawRoute = {
  price: RawPrice | RawPrice[];
  transfers: RawTransfer[],
  flights: Flight[],
}

export type RouteByName = {
  [k: string]: Route[]
}
