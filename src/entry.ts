// eslint-disable-next-line
import * as dotenv from 'dotenv';
dotenv.config({ path: '.production.env' });

import {
  parseS7AndPutMongo,
  parseAeroflotAndPutMongo,
  parseUralAirlinesAndPutMongo,

  parseRusNoVisaAndPutMongo,
} from './pipeline/pipelines';
// import { dropMongo } from './db/mongoService';
// import { startApiApp } from './api/v1/apiEntry';

const dataForStep = ['Ташкент', 'Санкт-Петербург', '17.10.2022'];
const dataForStep1 = ['Санкт-Петербург', 'Омск', '26.10.2022'];

// parseAeroflotAndPutMongo([dataForStep1])
//   .then((r) => {
//     console.log(r);
//     parseS7AndPutMongo([dataForStep1])
//       .then((r) => {
//         console.log(r);
//         parseUralAirlinesAndPutMongo([dataForStep1])
//           .then((r) => {
//             console.log(r);
//           });
//       });
//   });

parseUralAirlinesAndPutMongo([dataForStep1])
  .then((r) => {
    console.log(r);
  });

// startApiApp();
