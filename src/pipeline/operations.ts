import type { Document } from 'mongodb';

import { createOperation } from './createOperation';
import { disconnectMongo } from '../db/utils';
import { disconnectRedis } from '../utils/cache/redis/utils';
import { parserWrapper } from '../parsers/parser';
import { putToMongo } from '../db/mongoService';
import type { BaseMongoOperationConfig } from '../db/mongoService';
import type { ParseOperationConfig } from '../parsers/parser';


export const getParseOperation = <C, R>() => {
  type parseArgs = ParseOperationConfig<unknown, R>

  const parserWrapperInnerOp = ({ config }: { config: parseArgs }) => {
    return parserWrapper<unknown, R>(...config)();
  };

  return createOperation<C, R[], never>(parserWrapperInnerOp);
};

export const getPutToMongoOperation = <C, P extends Document>() => {
  const putToMongoInnerOp = (
    { config, prevRes }: { config: BaseMongoOperationConfig, prevRes: P[] },
  ) => putToMongo<P>(...config, prevRes);

  return createOperation<C, void, P>(putToMongoInnerOp);
};

export const getDropConnections = () => {
  const dropConnectionsOp = () => {
    return disconnectRedis()
      ?.then(() => disconnectMongo());
  };

  return createOperation<undefined, void, never>(dropConnectionsOp);
};
