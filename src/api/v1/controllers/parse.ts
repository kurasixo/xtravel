import { AdditionalArgsType } from '../../../parsers/parsers.types';
import {
  parseS7Op,
  parseUtairOp,
  parseAeroflotOp,
  parseUralAirlinesOp,
} from '../../../pipeline/pipelines';
import type { Controller, ControllerAsIs } from '../../apiTypes';
import { validateBody } from '../../validation';
import type { TypeStructureItem } from '../../validation';


type ParserKey = 'aeroflot' | 'utair' | 'uralAirlines' | 's7';
type ParsersObj = {
  [k in ParserKey]: (dataForSteps: AdditionalArgsType) => Promise<unknown>
};

const parsers: ParsersObj = {
  s7: parseS7Op,
  utair: parseUtairOp,
  aeroflot: parseAeroflotOp,
  uralAirlines: parseUralAirlinesOp,
};

const bodyStructure: TypeStructureItem = {
  parserName: 'string',
  additionalArgs: {
    from: 'string',
    to: 'string',
    date: 'string',
  }
};

const parseAsIs: ControllerAsIs = (req, res) => {
  res?.contentType('application/json');

  const {
    result: validationResult,
    errorField,
    errorMessage,
    errorComment,
  } = validateBody(req.body, bodyStructure);

  if (!validationResult) {
    res?.status(400)?.send({ errorField, errorMessage, errorComment });
  }

  const { parserName, additionalArgs } = req.body;
  const { from, to, date } = additionalArgs;

  const parser = parsers[parserName as ParserKey];

  res?.send({ parser: parser.toString(), from, date, to });

  // parser([[from, to, date]])
  //   .then((parsersData) => res?.send(parsersData));
};

const parseMethod = 'post';
const parseRoute = '/api/v1/parse';

export const parse: Controller = {
  route: parseRoute,
  method: parseMethod,

  controllerAsIs: parseAsIs,
};
