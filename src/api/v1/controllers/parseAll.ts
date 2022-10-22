import { parseAllPipeline } from '../../../pipeline/pipelines';
import type { Controller, ControllerAsIs } from '../../apiTypes';


const parseAllAsIs: ControllerAsIs = (req, res) => {
  res?.contentType('application/json');
  const { from, to, date } = req.body;

  parseAllPipeline([[from, to, date]])
    .then((parsersData) => res?.send(parsersData));
};

const parseAllMethod = 'post';
const parseAllRoute = '/api/v1/parseAll';

export const parseAll: Controller = {
  route: parseAllRoute,
  method: parseAllMethod,

  controllerAsIs: parseAllAsIs,
};
