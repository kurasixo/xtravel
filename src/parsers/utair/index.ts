import { utairConfig as config } from './config';
import { getUtairNormalizer as getNormalizer } from './normalizer';
import { getSiteHeadlessly } from '../../utils/network/headless';
import { getStepsToUse } from '../parser/utils';
import { utairProcessors as processors } from './processors';
import { utairSelectors as selectors } from './selectors';
import { utairSteps as steps } from './steps';
import type { ParseOperationConfig } from '../parser';
import type {
  ParserStepsArguments,
  RawRoute,
  RouteByName,
} from '../parsers.types';


export type UtairParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getUtairParserConfig = (dataForSteps: ParserStepsArguments) => {
  const stepsToUse = getStepsToUse(steps, dataForSteps);

  const UtairParserConfig: UtairParserConfig = [
    config,
    selectors,
    processors,
    getNormalizer(dataForSteps),

    getSiteHeadlessly,
    stepsToUse,
  ];

  return UtairParserConfig;
};
