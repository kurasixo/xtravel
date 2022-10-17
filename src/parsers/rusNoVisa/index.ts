import type { ParseOperationConfig } from '../parser';
import { rusNoVisaConfig as config } from './config';
import { rusNoVisaNormalizer as normalizer } from './normalizer';
import { rusNoVisaProcessors as processors } from './processors';
import { rusNoVisaSelectors as selectors } from './selectors';
import type { VisaInfo, VisaInfoRaw } from '../../types';


type ParserConfig = ParseOperationConfig<VisaInfoRaw, VisaInfo>;
export const rusNoVisaParserConfig: ParserConfig = [
  config,
  selectors,
  processors,
  normalizer,

  undefined,
  [],
];
