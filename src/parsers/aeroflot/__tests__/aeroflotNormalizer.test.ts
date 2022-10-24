import { getAeroflotNormalizer } from '../normalizer';
import { normalizedFlights26102022, normalizedFlights28102022, flightsMock26102022, flightsMock28102022 } from '../aeroflotHtml.mock';


describe('getAeroflotNormalizer', () => {
  it('should match snapshot on real data from site "moscow omsk 26 10 2022"', () => {
    const normalizer = getAeroflotNormalizer({ date: 'date', from: 'from', to: 'to' });
    const res = normalizer(flightsMock26102022);

    expect(res).toEqual(normalizedFlights26102022);
  });

  it('should match snapshot on real data from site "moscow omsk 28 10 2022"', () => {
    const normalizer = getAeroflotNormalizer({ date: 'date', from: 'from', to: 'to' });
    const res = normalizer(flightsMock28102022);

    expect(res).toEqual(normalizedFlights28102022);
  });
});

