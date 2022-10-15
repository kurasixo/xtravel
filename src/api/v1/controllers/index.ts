import type { Application } from 'express';
import { Controller } from '../../apiTypes';
import { simpleController } from './simpleController';
import { getFlights } from './flights';


const controllers: Controller[] = [simpleController, getFlights];

export const initControllers = (app: Application) => {
  controllers.forEach(({ method, route, controllerAsIs }) => {
    app[method](route, controllerAsIs);
  });
};
