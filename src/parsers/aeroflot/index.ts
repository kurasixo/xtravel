import { aeroflotConfig as config } from './config';
import { aeroflotNormalizer as normalizer } from './normalizer';
import { aeroflotProcessors as processors } from './processors';
import { aeroflotSelectors as selectors } from './selectors';
import { aeroflotSteps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { AdditionalArgsType, ParseOperationConfig } from '../parser';
import type { RawRoute, RouteByName } from '../../types';


type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getAeroflotParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const aeroflotParserConfig: ParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return aeroflotParserConfig;
};
