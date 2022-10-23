import { rusNoVisaConfig as config } from './config';
import { rusNoVisaNormalizer as normalizer } from './normalizer';
import { rusNoVisaProcessors as processors } from './processors';
import { rusNoVisaSelectors as selectors } from './selectors';
import { getSite } from '../../utils/network/network';

import type { VisaInfo, VisaInfoRaw } from './types';
import type { ParseOperationConfig } from '../parser';


export type RusNoVisaParserConfig = ParseOperationConfig<VisaInfoRaw, VisaInfo>;
export const rusNoVisaParserConfig: RusNoVisaParserConfig = [
  config,
  selectors,
  processors,
  normalizer,

  getSite,
  [],
];
