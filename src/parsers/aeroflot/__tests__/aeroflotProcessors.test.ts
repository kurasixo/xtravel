import { loadDataAndProcess } from '../../parser/parserTestUtil';

import { aeroflotProcessors } from '../processors';
import { aeroflotSelectors } from '../selectors';
import { flightsMock26102022, flightsMock28102022, moscowOmsk26102022, moscowOmsk28102022 } from '../aeroflotHtml.mock';


describe('aeroflotProcessors', () => {
  it('should process site "moscow omsk 26 10 2022"', () => {
    const res = loadDataAndProcess(
      moscowOmsk26102022,
      aeroflotSelectors.content,
      aeroflotProcessors,
    );

    expect(res).toEqual(flightsMock26102022);
  });

  it('should process site "moscow omsk 28 10 2022"', () => {
    const res = loadDataAndProcess(
      moscowOmsk28102022,
      aeroflotSelectors.content,
      aeroflotProcessors,
    );

    expect(res).toEqual(flightsMock28102022);
  });
});

