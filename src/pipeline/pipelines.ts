import { createPipeline, createSyncPipeline } from './createPipeline';
import { getPutToMongoOperation, getParseOperation, getDropConnections } from './operations';
import { visaMongoConfig, flightMongoConfig } from '../db/mongoService';

import { RusNoVisaParserConfig, rusNoVisaParserConfig } from '../parsers/rusNoVisa';
import { gets7ParserConfig, S7ParserConfig } from '../parsers/s7';
import { AeroflotParserConfig, getAeroflotParserConfig } from '../parsers/aeroflot';
import { getUralAirlineParserConfig, UralAirlineParserConfig } from '../parsers/uralAirlines';

import type { PipelineConfigItem } from './createPipeline';
import type { RouteByName, VisaInfo, VisaInfoRaw } from '../types';
import type { BaseMongoOperationConfig  } from '../db/mongoService';
import type { AdditionalArgsType } from '../parsers/parser';
import { getUtairParserConfig, UtairParserConfig } from '../parsers/utair';


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

export const dropConnectionsOp: T<undefined, void, never> = {
  config: undefined,
  operation: getDropConnections(),
};

export const parseRusNoVisaAndPutMongo = () => {
  const parseRusNoVisa: T<RusNoVisaParserConfig, VisaInfoRaw[],  never> = {
    config: rusNoVisaParserConfig,
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseRusNoVisa,
    putVisasToMongo,
    // dropConnectionsOp,
  ];
  return createSyncPipeline(pipelineOperations);
};

export const parseAeroflotOp = (dataForSteps: AdditionalArgsType) => {
  const parseAeroflot: T<AeroflotParserConfig, RouteByName[],  never> = {
    config: getAeroflotParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  return createSyncPipeline([parseAeroflot]);
};

export const parseS7Op = (dataForSteps: AdditionalArgsType) => {
  const parseS7: T<S7ParserConfig, RouteByName[],  never> = {
    config: gets7ParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  return createSyncPipeline([parseS7]);
};

export const parseUralAirlinesOp = (dataForSteps: AdditionalArgsType) => {
  const parseUralAirlines: T<UralAirlineParserConfig, RouteByName[],  never> = {
    config: getUralAirlineParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  return createSyncPipeline([parseUralAirlines]);
};

export const parseUtairOp = (dataForSteps: AdditionalArgsType) => {
  const parseUtair: T<UtairParserConfig, RouteByName[],  never> = {
    config: getUtairParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  return createSyncPipeline([parseUtair]);
};

export const parseAeroflotAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  const parseAeroflot: T<AeroflotParserConfig, RouteByName[],  never> = {
    config: getAeroflotParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseAeroflot,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createSyncPipeline(pipelineOperations);
};

export const parseS7AndPutMongo = (dataForSteps: AdditionalArgsType) => {
  const parseS7: T<S7ParserConfig, RouteByName[],  never> = {
    config: gets7ParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseS7,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createSyncPipeline(pipelineOperations);
};

export const parseUralAirlinesAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  const parseUralAirlines: T<UralAirlineParserConfig, RouteByName[],  never> = {
    config: getUralAirlineParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseUralAirlines,
    putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createSyncPipeline(pipelineOperations);
};

export const parseUtairAndPutMongo = (dataForSteps: AdditionalArgsType) => {
  const parseUtair: T<UtairParserConfig, RouteByName[],  never> = {
    config: getUtairParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const pipelineOperations: OperationsArray = [
    parseUtair,
    // putFlightsToMongo,
    // dropConnectionsOp,
  ];
  return createSyncPipeline(pipelineOperations);
};

export const parseAllPipeline = (dataForSteps: AdditionalArgsType) => {
  const parseUtair: T<UtairParserConfig, RouteByName[],  never> = {
    config: getUtairParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const parseUralAirlines: T<UralAirlineParserConfig, RouteByName[],  never> = {
    config: getUralAirlineParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const parseS7: T<S7ParserConfig, RouteByName[],  never> = {
    config: gets7ParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  const parseAeroflot: T<AeroflotParserConfig, RouteByName[],  never> = {
    config: getAeroflotParserConfig(dataForSteps),
    operation: getParseOperation(),
  };

  return createPipeline([parseUtair, parseUralAirlines, parseS7, parseAeroflot]);
};
