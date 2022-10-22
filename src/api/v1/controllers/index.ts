import { parse } from './parse';
import { getVisas } from './visas';
import { parseAll } from './parseAll';
import { getFlights } from './flights';

import type { Application } from 'express';
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
