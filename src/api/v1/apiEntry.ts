import express from 'express';
import { initControllers } from './controllers';
import type { Application } from 'express';
import { connectMongo } from '../../db/utils';


const apiApp = express();

const start = (app: Application) => {
  const port = 9000;

  connectMongo().then(() => {
    app.listen(port, () => {
      console.log('Started api app on port', port);
    });
  });
};

initControllers(apiApp);

export const startApiApp = () => start(apiApp);
