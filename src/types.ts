export type FnPromiseType<T> = (...args: unknown[]) => Promise<T>;
export type FnNotPromiseType<T> = (...args: unknown[]) => T extends Promise<unknown> ? never : T;

export type LastOfArray<T> =
  T extends [...rest: unknown[], last: infer L]
    ? L
    : never;
