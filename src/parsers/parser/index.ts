import cheerio from 'cheerio';

import type {
  FnPromiseType,
} from '../../types';
import type {
  Normalizer,
  ParserConfig,
  Processors,
  Selectors,
  StepFnPageOnly,
} from '../parsers.types';


export type ParseOperationConfig<R, O> = [
  ParserConfig,
  Selectors,
  Processors<R>,
  Normalizer<R[], O[]>,

  FnPromiseType<string>,
  StepFnPageOnly[],
];

export const parser = <R, O>(
  ...[
    parserConfig,
    selectors,
    processors,
    normalizer,

    getSiteFn,
    parserSteps,
  ]: ParseOperationConfig<R, O>
): Promise<O[]> => {
  return getSiteFn(parserConfig.url, parserSteps)
    .then((siteContent: string) => {
      const $ = cheerio.load(siteContent);
      const dataBySelectors = $(selectors.content);

      const res: R[] = [];

      if (processors.each) {
        dataBySelectors.each((index, element) => {
          // @ts-ignore
          res.push(processors.each(index, element, $));
        });
      }

      return res;
    })
    .then((rawData) => normalizer(rawData));
};

// rewrite to a simple decorator that takes fn and name and applies it
export const parserWrapper = <E, O>(
  ...[
    parserConfig,
    selectors,
    processors,
    normalizer,

    getSiteFn,
    parserSteps,
  ]: ParseOperationConfig<E, O>
) => {
  const parserWrapped = () => parser(
    parserConfig,
    selectors,
    processors,
    normalizer,

    getSiteFn,
    parserSteps,
  );

  if (parserConfig.parserName) {
    Object.defineProperty(parserWrapped, 'name', { value: `parserFor${parserConfig.parserName}` });
    return parserWrapped;
  }

  return parserWrapped;
};
