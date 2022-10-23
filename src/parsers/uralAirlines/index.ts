import { uralAirlineConfig as config } from './config';
import { uralAirlineNormalizer as normalizer } from './normalizer';
import { uralAirlineProcessors as processors } from './processors';
import { uralAirlineSelectors as selectors } from './selectors';
import { uralAirlineSteps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { ParseOperationConfig } from '../parser';
import type { AdditionalArgsType, RawRoute, RouteByName } from '../parsers.types';


export type UralAirlineParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getUralAirlineParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const uralAirlineParserConfig: UralAirlineParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return uralAirlineParserConfig;
};
