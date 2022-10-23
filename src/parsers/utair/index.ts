import { utairConfig as config } from './config';
import { utairNormalizer as normalizer } from './normalizer';
import { utairProcessors as processors } from './processors';
import { utairSelectors as selectors } from './selectors';
import { utairSteps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { ParseOperationConfig } from '../parser';
import type {
  RawRoute,
  RouteByName,
  AdditionalArgsType,
} from '../parsers.types';


export type UtairParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const getUtairParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const UtairParserConfig: UtairParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return UtairParserConfig;
};
