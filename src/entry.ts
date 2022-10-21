import { isDebug, isDev } from './utils/helpers';
// eslint-disable-next-line
import * as dotenv from 'dotenv';
const devDotenv = '.development.env';
const prodDotend = '.production.env';

const dotEnvToUse = isDev() || isDebug()
  ? devDotenv
  : prodDotend;

dotenv.config({ path: dotEnvToUse });

import {
  parseS7AndPutMongo,
  parseAeroflotAndPutMongo,
  parseUralAirlinesAndPutMongo,
  parseUtairAndPutMongo,

  parseRusNoVisaAndPutMongo,
} from './pipeline/pipelines';
import { dropMongo, flightMongoConfig, visaMongoConfig } from './db/mongoService';
import { startApiApp } from './api/v1/apiEntry';
import { getDropConnections } from './pipeline/operations';


const parseEverything = () => {
  const dataForStep = ['Ташкент', 'Санкт-Петербург', '17.10.2022'];
  const dataForStep1 = ['Санкт-Петербург', 'Омск', '26.10.2022'];
  const dataForStep2 = ['Москва', 'Томск', '26.10.2022'];

  dropMongo(...visaMongoConfig).then(() => dropMongo(...flightMongoConfig)).then(() =>
    Promise.all([
      // parseRusNoVisaAndPutMongo()
      //   .then(() => {
      //     console.log('finished parsing', 'parseRusNoVisaAndPutMongo');
      //   }),

      parseUtairAndPutMongo([dataForStep2])
        .then(() => {
          console.log('finished parsing', 'parseUralAirlinesAndPutMongo');
        }),

      // parseAeroflotAndPutMongo([dataForStep1])
      //   .then(() => {
      //     console.log('finished parsing', 'parseAeroflotAndPutMongo');
      //   }),

      // parseS7AndPutMongo([dataForStep1])
      //   .then(() => {
      //     console.log('finished parsing', 'parseS7AndPutMongo');
      //   }),
    ]).then(() => {
      getDropConnections()({ config: undefined });
    })
  );
};

parseEverything();
// startApiApp();
