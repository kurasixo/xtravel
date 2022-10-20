import { visaMongoConfig, getFromMongo } from '../../../db/mongoService';
import type { Controller, ControllerAsIs } from '../../apiTypes';


const getVisasAsIs: ControllerAsIs = (_, res) => {
  res?.contentType('application/json');
  getFromMongo(...visaMongoConfig)
    .then(items => res?.send(items));
};

const getVisasMethod = 'get';
const getVisasRoute = '/api/v1/getVisas';

export const getVisas: Controller = {
  route: getVisasRoute,
  method: getVisasMethod,

  controllerAsIs: getVisasAsIs,
};
