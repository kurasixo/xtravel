import { getS7Normalizer } from '../normalizer';
import { normalizedFlights26102022, normalizedFlights28102022, flightsMock26102022, flightsMock28102022 } from '../s7tHtml.mock';


describe('getS7Normalizer', () => {
  it('should match snapshot on real data from site "moscow omsk 26 10 2022"', () => {
    const normalizer = getS7Normalizer({ date: 'date', from: 'from', to: 'to' });
    const res = normalizer(flightsMock26102022);

    expect(res).toEqual(normalizedFlights26102022);
  });

  it('should match snapshot on real data from site "moscow omsk 28 10 2022"', () => {
    const normalizer = getS7Normalizer({ date: 'date', from: 'from', to: 'to' });
    const res = normalizer(flightsMock28102022);

    expect(res).toEqual(normalizedFlights28102022);
  });
});

