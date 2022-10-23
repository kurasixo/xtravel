import cheerio from 'cheerio';

import type {
  AdditionalArgsType,
  Normalizer,
  ParserConfig,
  Processors,
  Selectors,
} from '../parsers.types';
import type {
  FnPromiseType,
} from '../../types';


export type ParseOperationConfig<E, O> = [
  ParserConfig,
  Selectors,
  Processors<E>,
  Normalizer<E[], O[]>,

  FnPromiseType<string>,
  AdditionalArgsType,
];

export const parser = <E, O>(
  parserConfig: ParserConfig,
  selectors: Selectors,
  processors: Processors<E>,
  normalizer: Normalizer<E[], O[]>,

  getSiteFn: FnPromiseType<string>,
  additionalArgs: AdditionalArgsType,
): Promise<O[]> => {
  return getSiteFn(parserConfig.url, additionalArgs)
    .then((siteContent: string) => {
      const $ = cheerio.load(siteContent);
      const dataBySelectors = $(selectors.content);

      const res: E[] = [];

      if (processors.each) {
        dataBySelectors.each((index, element) => {
          // @ts-ignore
          res.push(processors.each(index, element, $));
        });
      }

      return res;
    })
    .then((rawData) => normalizer(rawData, additionalArgs));
};

export const parserWrapper = <E, O>(
  parserConfig: ParserConfig,
  selectors: Selectors,
  processors: Processors<E>,
  normalizer: Normalizer<E[], O[]>,

  getSiteFn: FnPromiseType<string>,
  additionalArgs: AdditionalArgsType,
) => {
  const parserWrapped = () => parser(
    parserConfig,
    selectors,
    processors,
    normalizer,

    getSiteFn,
    additionalArgs,
  );

  if (parserConfig.parserName) {
    Object.defineProperty(parserWrapped, 'name', { value: `parserFor${parserConfig.parserName}` });

    return parserWrapped;
  }

  return parserWrapped;
};
