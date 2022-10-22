import express from 'express';
import type { Application } from 'express';

import { initControllers } from './controllers';
import { apiLog } from '../../utils/log';
import { connectMongo } from '../../db/utils';
import { getDropConnections } from '../../pipeline/operations';
import { connectRedis } from '../../utils/cache/redis/utils';


const apiApp = express();

const start = (app: Application) => {
  const port = 9000;

  connectMongo().then(() => connectRedis())
    .then(() => {
      app.listen(port, () => {
        apiLog('Started api app on port', port);
      });
    });

  app.on('close', () => {
    getDropConnections()({ config: undefined });
  });
};

apiApp.use(express.json());
initControllers(apiApp);

export const startApiApp = () => start(apiApp);
