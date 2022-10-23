import { s7Config as config } from './config';
import { getS7Normalizer as getNormalizer } from './normalizer';
import { getSiteHeadlessly } from '../../utils/network/headless';
import { getStepsToUse } from '../parser/utils';
import { s7Processors as processors } from './processors';
import { s7Selectors as selectors } from './selectors';
import { s7Steps as steps } from './steps';
import type { ParseOperationConfig } from '../parser';
import type { ParserStepsArguments, RawRoute, RouteByName } from '../parsers.types';


export type S7ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const gets7ParserConfig = (dataForSteps: ParserStepsArguments) => {
  const stepsToUse = getStepsToUse(steps, dataForSteps);

  const s7ParserConfig: S7ParserConfig = [
    config,
    selectors,
    processors,
    getNormalizer(dataForSteps),

    getSiteHeadlessly,
    stepsToUse,
  ];

  return s7ParserConfig;
};
