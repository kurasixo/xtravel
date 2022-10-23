import type { Application } from 'express';

import { getFlights } from './flights';
import { getVisas } from './visas';
import { parse } from './parse';
import { parseAll } from './parseAll';
import type { Controller } from '../../apiTypes';


const controllers: Controller[] = [
  parse,
  parseAll,
  getFlights,
  getVisas,
];

export const initControllers = (app: Application) => {
  controllers.forEach(({ method, route, controllerAsIs }) => {
    app[method](route, controllerAsIs);
  });
};
