import express from 'express';
import { initControllers } from './controllers';
import type { Application } from 'express';
import { connectMongo } from '../../db/utils';
import { apiLog } from '../../utils/log';
import { getDropConnections } from '../../pipeline/operations';


const apiApp = express();

const start = (app: Application) => {
  const port = 9000;

  connectMongo().then(() => {
    app.listen(port, () => {
      apiLog('Started api app on port', port);
    });
  });

  app.on('close', () => {
    getDropConnections()({ config: undefined });
  });
};

initControllers(apiApp);

export const startApiApp = () => start(apiApp);
