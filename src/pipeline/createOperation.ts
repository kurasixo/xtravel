import type { FnPromiseType } from '../types';


export type OperationArgs<C, P> = { config: C, prevRes?: P };
export type OperationFn<C, R, P> = (args: OperationArgs<C, P>) => Promise<R>;

export const createOperation = <C, R, P>(
  fn: FnPromiseType<R>,
): OperationFn<C, R, P> => {
  const operationFn = ({ config, prevRes }: OperationArgs<C, P>) => {
    if (prevRes) {
      return fn({ config, prevRes });
    }

    return fn({ config });
  };

  return operationFn;
};
