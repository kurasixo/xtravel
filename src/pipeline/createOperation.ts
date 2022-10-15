export type OperationArgs<C, P> = { config: C, prevRes?: P };
export type OperationFn<C, R, P> = (args: OperationArgs<C, P>) => Promise<R>;
type AnyPromiseFn<T> = (...args: unknown[]) => Promise<T>;

export const createOperation = <C, R, P>(
  fn: AnyPromiseFn<R>,
): OperationFn<C, R, P> => {
  const operationFn = ({ config, prevRes }: OperationArgs<C, P>) => {
    if (prevRes) {
      return fn({ config, prevRes });
    }

    return fn({ config });
  };

  return operationFn;
};
