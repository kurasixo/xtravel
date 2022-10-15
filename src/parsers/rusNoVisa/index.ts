import type { SimpleParseOperationConfig } from '../simpleParser';
import { rusNoVisaConfig as config } from './config';
import { rusNoVisaNormalizer as normalizer } from './normalizer';
import { rusNoVisaProcessors as processors } from './processors';
import { rusNoVisaSelectors as selectors } from './selectors';
import type { VisaInfo, VisaInfoRaw } from '../../types';


type ParserConfig = SimpleParseOperationConfig<VisaInfoRaw, VisaInfo>;
export const rusNoVisaParserConfig: ParserConfig = [
  config,
  selectors,
  processors,
  normalizer,

  undefined,
  [],
];
