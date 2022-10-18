import { rusNoVisaConfig as config } from './config';
import { rusNoVisaNormalizer as normalizer } from './normalizer';
import { rusNoVisaProcessors as processors } from './processors';
import { rusNoVisaSelectors as selectors } from './selectors';
import { getSite } from '../../utils/network/network';

import type { VisaInfo, VisaInfoRaw } from '../../types';
import type { ParseOperationConfig } from '../parser';


type ParserConfig = ParseOperationConfig<VisaInfoRaw, VisaInfo>;
export const rusNoVisaParserConfig: ParserConfig = [
  config,
  selectors,
  processors,
  normalizer,

  getSite,
  [],
];
