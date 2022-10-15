import type { OperationFn } from './createOperation';


export interface PipelineConfigItem<C, R, P> {
  config: C,
  operation: OperationFn<C, R, P>,
}

export const createPipeline = <C, R, P>(
  pipelineOperations: PipelineConfigItem<C, R, P>[],
): Promise<unknown> => {
  const initialPromise: Promise<unknown> = new Promise(() => {});

  const aggregatedPromise = pipelineOperations
    .reduce((acc: Promise<unknown>, { operation: operationFn, config }) => {
      if (acc === initialPromise) {
        acc = operationFn({ config });
        return acc;
      }

      acc = acc.then((accRes: P) => operationFn({ config, prevRes: accRes }));
      return acc;
    }, initialPromise);

  return aggregatedPromise;
};
