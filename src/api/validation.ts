import get from 'lodash/get';
import type { Request } from 'express';


const possibleTypes = [
  'number',
  'string',
] as const;

type PossibleTypes = typeof possibleTypes[number] | [typeof possibleTypes[number]];

export const typesToFuncs = {
  '"number"': (x: unknown) => typeof x === 'number',
  '"string"': (x: unknown) => typeof x === 'string',

  [JSON.stringify(['string'])]: (x: unknown) =>
    Array.isArray(x) && x.every(xItem => typeof xItem === 'string'),
  [JSON.stringify(['number'])]: (x: unknown) =>
    Array.isArray(x) && x.every(xItem => typeof xItem === 'number'),
};

export type TypeStructureItem = {
  [key: string]: TypeStructureItem | PossibleTypes
};

export const buildKeys = (
  typeStructure: TypeStructureItem,

  prefix = '', // only for recuesive calls
  res: string[] = [], // only for recuesive calls
) => {
  Object.keys(typeStructure).map((key) => {
    const value = typeStructure[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      buildKeys(value as TypeStructureItem, prefix + key + '.', res);
    } else {
      res.push(prefix + key);
    }
  });

  return res;
};


const NoKeyError = 'no key in body' as const;
const TypeMismatchError = 'type mismatch' as const;
const TooMuchKeysInBodyError = 'too much keys in the body' as const;

const errors = [
  NoKeyError,
  TypeMismatchError,
  TooMuchKeysInBodyError,
];

type ValidationResult = {
  result: boolean;
  errorField?: string;
  errorMessage?: typeof errors[number];
  errorComment?: string;
}


export const validateBody = (
  body: Request['body'],
  typeStructure: TypeStructureItem,
): ValidationResult => {
  let result = true;
  let errorField: string | undefined = undefined;

  const keysToMap = buildKeys(typeStructure);
  const bodyKeys = buildKeys(body);

  if (keysToMap.length < bodyKeys.length) {
    return { result: false, errorMessage: TooMuchKeysInBodyError };
  }

  for (let i = 0; i < keysToMap.length; i++) {
    const key = keysToMap[i];

    const valueFromBody = get(body, key);
    if (!valueFromBody) {
      return { result: false, errorField: key, errorMessage: NoKeyError };
    }

    const typeToCheck = JSON.stringify(get(typeStructure, key));
    const checkFn = typesToFuncs[typeToCheck];

    const validationResult = checkFn(valueFromBody);

    if (!validationResult) {
      result = false;
      errorField = key;

      return {
        result,
        errorField,
        errorMessage: TypeMismatchError,
        errorComment: `Expected type ${typeToCheck}, got ${typeof valueFromBody}`
      };
    } else {
      result = result && validationResult;
    }
  }

  return { result };
};
