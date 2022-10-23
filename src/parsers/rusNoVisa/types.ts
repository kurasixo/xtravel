import type { Price } from '../parsers.types';


export type VisaInfoRaw = {
  countryName: string;
  daysWithoutVisa: string;
  docs: string;
  visaPrice?: string;
};

export type VisaInfo = {
  id: string;
  countryName: string;
  daysWithoutVisa: (number | string)[];
  docs: string[];
  visaPrice: Price | 'free';
};
