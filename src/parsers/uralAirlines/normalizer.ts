import type { Price, RawPrice, RawRoute, RawTransfer, Route, RouteByName, Transfer } from '../../types';
import { AdditionalArgsType } from '../parser';


export const uralAirlineNormalizer = (
  rawRoutes: RawRoute[],
  additionalArgs: AdditionalArgsType,
): RawRoute[] => {
  return rawRoutes;
};
