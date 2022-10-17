import type { AdditionalArgsType, ParseOperationConfig } from '../parsers/parser';
import { rusNoVisaParserConfig } from '../parsers/rusNoVisa';

import { visaMongoConfig, flightMongoConfig } from '../db/mongoService';
import type { BaseMongoOperationConfig  } from '../db/mongoService';
import type { RawRoute, RouteByName, VisaInfo, VisaInfoRaw } from '../types';
import { getPutToMongoOperation, getParseOperation } from './operations';
import { getAeroflotParserConfig } from '../parsers/aeroflot';
import type { PipelineConfigItem } from './createPipeline';
import { createPipeline } from './createPipeline';
import { gets7ParserConfig } from '../parsers/s7';


export const parseRusNoVisaAndPutMongo = () => {
  type T<C, R, P> = PipelineConfigItem<C, R, P>;
  type ParserConfig = ParseOperationConfig<VisaInfoRaw, VisaInfo>;

  const parseRusNoVisa: T<ParserConfig, VisaInfoRaw[],  never> = {
    config: rusNoVisaParserConfig,
    operation: getParseOperation(),
  };

  const putToMongo: T<BaseMongoOperationConfig, void, VisaInfo[]> = {
    config: visaMongoConfig,
    operation: getPutToMongoOperation(),
  };

  const pipelineOperations: T<unknown, unknown, unknown>[] = [parseRusNoVisa, putToMongo];

  return createPipeline(pipelineOperations);
};

export const parseAeroflotAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  type T<C, R, P> = PipelineConfigItem<C, R, P>;
  type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

  const parseAeroflot: T<ParserConfig, RawRoute[],  never> = {
    config: getAeroflotParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const putToMongo: T<BaseMongoOperationConfig, void, RouteByName[]> = {
    config: flightMongoConfig,
    operation: getPutToMongoOperation(),
  };

  const pipelineOperations: T<unknown, unknown, unknown>[] = [parseAeroflot, putToMongo];

  return createPipeline(pipelineOperations);
};

export const parseS7AndPutMongo = (dataForSteps: AdditionalArgsType) => {
  type T<C, R, P> = PipelineConfigItem<C, R, P>;
  type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

  const parseAeroflot: T<ParserConfig, RawRoute[],  never> = {
    config: gets7ParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const putToMongo: T<BaseMongoOperationConfig, void, RouteByName[]> = {
    config: flightMongoConfig,
    operation: getPutToMongoOperation(),
  };

  const pipelineOperations: T<unknown, unknown, unknown>[] = [parseAeroflot, putToMongo];

  return createPipeline(pipelineOperations);
};
