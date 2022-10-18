import axios from 'axios';

import { networkLog } from '../log';
import { memoNetworkWithCache } from '../simpleCache';

import type { Site } from '../../types';


export const getSiteWithoutMemo = (site: Site): Promise<string> => {
  networkLog('getting site content', site);
  return axios.get<string>(site).then((response) => response.data);
};

export const getSite = memoNetworkWithCache(getSiteWithoutMemo);
