import { flightMongoConfig, getFromMongo } from '../../../db/mongoService';
import type { Controller, ControllerAsIs } from '../../apiTypes';


const getFlightsAsIs: ControllerAsIs = (_, res) => {
  res?.contentType('application/json');
  getFromMongo(...flightMongoConfig)
    .then(items => res?.send(items));
};

const getFlightsMethod = 'get';
const getFlightsRoute = '/api/v1/getFlights';

export const getFlights: Controller = {
  route: getFlightsRoute,
  method: getFlightsMethod,

  controllerAsIs: getFlightsAsIs,
};
