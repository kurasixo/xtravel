import { aeroflotConfig as config } from './config';
import { aeroflotNormalizer as normalizer } from './normalizer';
import { aeroflotProcessors as processors } from './processors';
import { aeroflotSelectors as selectors } from './selectors';
import { aeroflotSteps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { ParseOperationConfig } from '../parser';
import type { AdditionalArgsType, RawRoute, RouteByName } from '../parsers.types';


export type AeroflotParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getAeroflotParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const aeroflotParserConfig: AeroflotParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return aeroflotParserConfig;
};
