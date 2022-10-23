import { s7Config as config } from './config';
import { s7Normalizer as normalizer } from './normalizer';
import { s7Processors as processors } from './processors';
import { s7Selectors as selectors } from './selectors';
import { s7Steps as steps } from './steps';

import { getSiteHeadlessly } from '../../utils/network/headless';
import type { ParseOperationConfig } from '../parser';
import type { AdditionalArgsType, RawRoute, RouteByName } from '../parsers.types';


export type S7ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

export const gets7ParserConfig = (dataForSteps: AdditionalArgsType) => {
  const getStepsToUse = steps.map((stepFn, index) => {
    return {
      stepFn,
      dataForStep: dataForSteps[index],
    };
  });

  const s7ParserConfig: S7ParserConfig = [
    config,
    selectors,
    processors,
    normalizer,

    getSiteHeadlessly,
    getStepsToUse,
  ];

  return s7ParserConfig;
};
