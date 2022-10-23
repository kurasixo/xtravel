import { aeroflotConfig as config } from './config';
import { getAeroflotNormalizer as getNormalizer } from './normalizer';
import { getSiteHeadlessly } from '../../utils/network/headless';
import { getStepsToUse } from '../parser/utils';
import { aeroflotProcessors as processors } from './processors';
import { aeroflotSelectors as selectors } from './selectors';
import { aeroflotSteps as steps } from './steps';
import type { ParseOperationConfig } from '../parser';
import type { ParserStepsArguments, RawRoute, RouteByName } from '../parsers.types';


export type AeroflotParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getAeroflotParserConfig = (dataForSteps: ParserStepsArguments) => {
  const stepsToUse = getStepsToUse(steps, dataForSteps);

  const aeroflotParserConfig: AeroflotParserConfig = [
    config,
    selectors,
    processors,
    getNormalizer(dataForSteps),

    getSiteHeadlessly,
    stepsToUse,
  ];

  return aeroflotParserConfig;
};
