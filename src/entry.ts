// eslint-disable-next-line
import * as dotenv from 'dotenv';
dotenv.config({ path: '.production.env' });

import { parseAeroflotAndPutMongo, parseS7AndPutMongo, parseRusNoVisaAndPutMongo } from './pipeline/pipelines';
// import { dropMongo } from './db/mongoService';
// import { startApiApp } from './api/v1/apiEntry';
// import { parseRusNoVisaAndPutMongo } from './pipeline/createPipeline';

const dataForStep = ['Ташкент', 'Санкт-Петербург', '17.10.2022'];
const dataForStep1 = ['Санкт-Петербург', 'Томск', '26.10.2022'];

// dropMongo('xtravel', 'visa')
//   .then(() => parseRusNoVisaAndPutMongo());

// dropMongo('xtravel', 'flight')
//   .then(() => parseAeroflotAndPutMongo([dataForStep]));

parseAeroflotAndPutMongo([dataForStep1])
  .then(console.log);

// parseRusNoVisaAndPutMongo().then(console.log);
parseS7AndPutMongo([dataForStep1])
  .then(console.log);

// startApiApp();
