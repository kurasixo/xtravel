import { uralAirlineConfig as config } from './config';
import { uralAirlineNormalizer as normalizer } from './normalizer';
import { uralAirlineProcessors as processors } from './processors';
import { uralAirlineSelectors as selectors } from './selectors';
import { uralAirlineSteps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { AdditionalArgsType, ParseOperationConfig } from '../parser';
import type { RawRoute, RouteByName } from '../../types';


type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getUralAirlineParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const uralAirlineParserConfig: ParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return uralAirlineParserConfig;
};
