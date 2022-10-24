import { loadDataAndProcess } from '../../parser/parserTestUtil';

import { flightsMock26102022, flightsMock28102022, moscowOmsk26102022, moscowOmsk28102022 } from '../s7tHtml.mock';
import { s7Processors } from '../processors';
import { s7Selectors } from '../selectors';


describe('s7Processors', () => {
  it('should match snapshot on real data from site "moscow omsk 26 10 2022"', () => {
    const res = loadDataAndProcess(
      moscowOmsk26102022,
      s7Selectors.content,
      s7Processors,
    );
    expect(res).toEqual(flightsMock26102022);
  });

  it('should match snapshot on real data from site "moscow omsk 28 10 2022"', () => {
    const res = loadDataAndProcess(
      moscowOmsk28102022,
      s7Selectors.content,
      s7Processors,
    );

    expect(res).toEqual(flightsMock28102022);
  });
});
