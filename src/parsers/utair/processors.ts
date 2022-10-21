import type { Flight, Processors, RawRoute } from '../../types';
import { innerSelectors } from './selectors';


export const utairProcessors: Processors<RawRoute> = {
  each: (_, flight, $) => {
    const rootFlight = $(flight);
    console.log(flight);

    return {
      flights: [],
      transfers: [],
      price: [],
    };
  },
};
