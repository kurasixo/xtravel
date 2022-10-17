// import { flightMongoConfig, getFromMongo } from '../../../db/mongoService';
import type { Controller, ControllerAsIs } from '../../apiTypes';


const parseAsIs: ControllerAsIs = (req, res) => {
  res?.contentType('application/json');
  // getFromMongo(...flightMongoConfig)
  //   .then(items => res?.send(items));
};

const parseMethod = 'post';
const parseRoute = '/api/v1/parse';

export const parse: Controller = {
  route: parseRoute,
  method: parseMethod,

  controllerAsIs: parseAsIs,
};
