import type { BaseMongoOperationConfig } from '../db/mongoService';
import type { Document } from 'mongodb';
import type { SimpleParseOperationConfig } from '../parsers/simpleParser';

import { createOperation } from './createOperation';
import { putToMongo } from '../db/mongoService';
import { simpleParserWrapper } from '../parsers/simpleParser';


export const getSimpleParseOperation = <C, R>() => {
  type simpleParseArgs = SimpleParseOperationConfig<unknown, R>

  const simpleParserWrapperInnerOp = ({ config }: { config: simpleParseArgs }) => {
    return simpleParserWrapper<unknown, R>(...config)();
  };

  return createOperation<C, R[], never>(simpleParserWrapperInnerOp);
};

export const getPutToMongoOperation = <C, P extends Document>() => {
  const putToMongoInnerOp = (
    { config, prevRes }: { config: BaseMongoOperationConfig, prevRes: P[] },
  ) => putToMongo<P>(...config, prevRes);

  return createOperation<C, void, P>(putToMongoInnerOp);
};
