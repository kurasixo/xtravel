import type { OperationFn } from './createOperation';


export interface PipelineConfigItem<C, R, P> {
  config: C,
  operation: OperationFn<C, R, P>,
}

type PipelineError = {
  error: boolean;
  errorMessage: string;
}

export const createSyncPipeline = <C, R, P>(
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

  return aggregatedPromise
    .catch((e) => ({
      error: true,
      errorMessage: `Error in async pipeline aggregated promise: ${e}`,
    }));
};

export const createPipeline = <C, R>(
  pipelineOperations: PipelineConfigItem<C, R, never>[],
): Promise<unknown | PipelineError> => {
  const resPromises = Promise.all(
    pipelineOperations.map(({ operation: operationFn, config }) => {
      return operationFn({ config });
    })
  ).catch((e) => {
    return {
      error: true,
      errorMessage: `Error in async pipeline aggregated promise: ${e}`,
    };
  });

  return resPromises;
};
