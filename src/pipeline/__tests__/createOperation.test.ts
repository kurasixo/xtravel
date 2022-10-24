import { createOperation } from '../createOperation';
import { FnPromiseType } from '../../types';


// eslint-disable-next-line
const promiseFn: FnPromiseType<any> = ({ config, prevRes }) =>
  new Promise((res) => res({ config, prevRes }));

describe('createOperation', () => {
  it('should handle arg from previous result', async () => {
    const opWithPromiseFn = createOperation(promiseFn);
    const result = await opWithPromiseFn({ config: 1, prevRes: 1 });

    expect(result).toEqual({ config: 1, prevRes: 1 });
  });

  it('should handle only one arg', async () => {
    const opWithPromiseFn = createOperation(promiseFn);
    const result = await opWithPromiseFn({ config: 1 });

    expect(result).toEqual({ config: 1 });
  });
});
