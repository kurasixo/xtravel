import cheerio from 'cheerio';
import { getSite } from '../../utils/network';
import type { FnPromiseType, Normalizer, ParserConfig, Processors, Selectors } from '../../types';


export type AdditionalArgsType = any[];

export type SimpleParseOperationConfig<E, O> = [
  ParserConfig,
  Selectors,
  Processors<E>,
  Normalizer<E[], O[]>,

  FnPromiseType<string> | undefined,
  AdditionalArgsType,
];

export const simpleParser = <E, O>(
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

export const simpleParserWrapper = <E, O>(
  parserConfig: ParserConfig,
  selectors: Selectors,
  processors: Processors<E>,
  normalizer: Normalizer<E[], O[]>,

  getSiteFn: FnPromiseType<string> = getSite,
  additionalArgs: AdditionalArgsType = [],
) => {
  const simpleParserWrapped = () => simpleParser(
    parserConfig,
    selectors,
    processors,
    normalizer,

    getSiteFn,
    additionalArgs,
  );

  if (parserConfig.parserName) {
    Object.defineProperty(simpleParserWrapped, 'name', {
      value: `simpleParserFor${parserConfig.parserName}`,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    return simpleParserWrapped;
  }

  return simpleParserWrapped;
};
