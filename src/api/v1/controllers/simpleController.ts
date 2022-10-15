import type { Controller, ControllerAsIs } from '../../apiTypes';


const simpleControllerAsIs: ControllerAsIs = (_, res) => {
  res?.send('Hello World!');
};

const simpleControllerMethod = 'get';
const simpleControllerRoute = '/api/v1/simpleController';

export const simpleController: Controller = {
  route: simpleControllerRoute,
  method: simpleControllerMethod,

  controllerAsIs: simpleControllerAsIs,
};
