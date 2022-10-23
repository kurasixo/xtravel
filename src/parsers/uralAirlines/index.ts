import { uralAirlineConfig as config } from './config';
import { getUralAirlineNormalizer as getNormalizer } from './normalizer';
import { getSiteHeadlessly } from '../../utils/network/headless';
import { getStepsToUse } from '../parser/utils';
import { uralAirlineProcessors as processors } from './processors';
import { uralAirlineSelectors as selectors } from './selectors';
import { uralAirlineSteps as steps } from './steps';
import type { ParseOperationConfig } from '../parser';
import type { ParserStepsArguments, RawRoute, RouteByName } from '../parsers.types';


export type UralAirlineParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getUralAirlineParserConfig = (dataForSteps: ParserStepsArguments) => {
  const stepsToUse = getStepsToUse(steps, dataForSteps);

  const uralAirlineParserConfig: UralAirlineParserConfig = [
    config,
    selectors,
    processors,
    getNormalizer(dataForSteps),

    getSiteHeadlessly,
    stepsToUse,
  ];

  return uralAirlineParserConfig;
};
