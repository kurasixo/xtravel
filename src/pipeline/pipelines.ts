import { createPipeline } from './createPipeline';
import { getPutToMongoOperation, getParseOperation, getDropConnections } from './operations';
import { visaMongoConfig, flightMongoConfig } from '../db/mongoService';

import { rusNoVisaParserConfig } from '../parsers/rusNoVisa';
import { getAeroflotParserConfig } from '../parsers/aeroflot';
import { gets7ParserConfig } from '../parsers/s7';
import { getUralAirlineParserConfig } from '../parsers/uralAirlines';

import type { PipelineConfigItem } from './createPipeline';
import type { RawRoute, RouteByName, VisaInfo, VisaInfoRaw } from '../types';
import type { BaseMongoOperationConfig  } from '../db/mongoService';
import type { AdditionalArgsType, ParseOperationConfig } from '../parsers/parser';


type T<C, R, P> = PipelineConfigItem<C, R, P>;
type OperationsArray = T<unknown, unknown, unknown>[];

const putToMongo = getPutToMongoOperation();

const putFlightsToMongo: T<BaseMongoOperationConfig, void, RouteByName[]> = {
  config: flightMongoConfig,
  operation: putToMongo,
};

const putVisasToMongo: T<BaseMongoOperationConfig, void, VisaInfo[]> = {
  config: visaMongoConfig,
  operation: putToMongo,
};

const dropConnectionsOp: T<undefined, void, never> = {
  config: undefined,
  operation: getDropConnections(),
};

export const parseRusNoVisaAndPutMongo = () => {
  type ParserConfig = ParseOperationConfig<VisaInfoRaw, VisaInfo>;

  const parseRusNoVisa: T<ParserConfig, VisaInfoRaw[],  never> = {
    config: rusNoVisaParserConfig,
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseRusNoVisa,
    putVisasToMongo,
    // dropConnectionsOp,
  ];
  return createPipeline(pipelineOperations);
};

export const parseAeroflotAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

  const parseAeroflot: T<ParserConfig, RawRoute[],  never> = {
    config: getAeroflotParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseAeroflot,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createPipeline(pipelineOperations);
};

export const parseS7AndPutMongo = (dataForSteps: AdditionalArgsType) => {
  type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

  const parseAeroflot: T<ParserConfig, RawRoute[],  never> = {
    config: gets7ParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseAeroflot,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createPipeline(pipelineOperations);
};


export const parseUralAirlinesAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  type ParserConfig = ParseOperationConfig<RawRoute, RouteByName>;

  const parseUralAirlines: T<ParserConfig, RouteByName[],  never> = {
    config: getUralAirlineParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseUralAirlines,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createPipeline(pipelineOperations);
};
