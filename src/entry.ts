// eslint-disable-next-line
import * as dotenv from 'dotenv';
dotenv.config({ path: '.production.env' });

import { parseAeroflotAndPutMongo } from './pipeline/pipelines';
import { dropMongo } from './db/mongoService';
// import { startApiApp } from './api/v1/apiEntry';
// import { parseRusNoVisaAndPutMongo } from './pipeline/createPipeline';


// dropMongo('xtravel', 'visa')
//   .then(() => parseRusNoVisaAndPutMongo());

dropMongo('xtravel', 'flight')
  .then(() => parseAeroflotAndPutMongo([['Ташкент', 'Санкт-Петербург', '15.10.2022']]));

// startApiApp();
