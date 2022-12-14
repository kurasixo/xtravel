/* eslint-disable */
import * as dotenv from 'dotenv';
import { isDebug, isDev } from './utils/helpers';

const devDotenv = '.development.env';
const prodDotend = '.production.env';

const dotEnvToUse = isDev() || isDebug()
  ? devDotenv
  : prodDotend;

dotenv.config({ path: dotEnvToUse });
/* eslint-enable */

import { dropMongo, flightMongoConfig, visaMongoConfig } from './db/mongoService';
import { getDropConnections } from './pipeline/operations';
import {
  parseAeroflotAndPutMongo,
  parseAllPipeline,
  parseRusNoVisaAndPutMongo,
  parseS7AndPutMongo,
  parseUralAirlinesAndPutMongo,
  parseUtairAndPutMongo,

  parseAeroflotOp,
} from './pipeline/pipelines';
import { startApiApp } from './api/v1/apiEntry';


parseAeroflotOp({ from: 'Москва', to: 'Омск', date: '26.10.2022' })
  .then(console.log);

// const parseEverything = () => {
//   const dataForStep = ['Ташкент', 'Санкт-Петербург', '17.10.2022'];
//   const dataForStep1 = ['Санкт-Петербург', 'Омск', '26.10.2022'];
//   const dataForStep2 = ['Москва', 'Томск', '26.10.2022'];

//   dropMongo(...visaMongoConfig).then(() => dropMongo(...flightMongoConfig))
//     .then(() =>
//       parseAllPipeline([dataForStep2])
//         .then(() => {
//           getDropConnections()({ config: undefined });
//         })
//     );
// };

// parseEverything();
// startApiApp();
