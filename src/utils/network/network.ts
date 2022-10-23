import axios from 'axios';

import { networkLog } from '../log';
import { asyncWithRetryOnError } from '../retry';
import { memoNetworkWithCache } from '../cache/redisCache';

import type { FnPromiseType } from '../../types';


export const getSiteWithoutMemo: FnPromiseType<string> = (
  site: string,
) => {
  networkLog('getting site content', site);
  return axios.get<string>(site).then((response) => response.data);
};

export const getSite: FnPromiseType<string> =
  memoNetworkWithCache(asyncWithRetryOnError(getSiteWithoutMemo));
