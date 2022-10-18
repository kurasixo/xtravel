import type { Price, RawPrice, RawRoute, RawTransfer, Route, RouteByName, Transfer } from '../../types';
import type { AdditionalArgsType } from '../parser';


export const uralAirlineNormalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RawRoute[] => {
  return rawRoutes;
};
