import {
  buildKeys,
  typesToFuncs,
  TypeStructureItem,
  validateBody,
} from '../validation';


beforeAll(() => {
  Object.keys(typesToFuncs).map((key) => {
    return jest.spyOn(typesToFuncs, key);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('validation', () => {
  describe('buildkeys', () => {
    it('empty obj case', () => {
      const testData: TypeStructureItem = {};
      expect(buildKeys(testData)).toEqual([]);
    });

    it('simple case', () => {
      const testData: TypeStructureItem = {
        parserName: 'string',
        additionalArgs: { from: 'string', to: 'string', date: 'string' },
      };
      expect(buildKeys(testData)).toEqual([
        'parserName',
        'additionalArgs.from',
        'additionalArgs.to',
        'additionalArgs.date',
      ]);
    });

    it('simple case with array', () => {
      const testData: TypeStructureItem = {
        parserName: ['string'],
        additionalArgs: { from: 'string' },
      };
      expect(buildKeys(testData)).toEqual(['parserName', 'additionalArgs.from']);
    });

    it('deep case', () => {
      const testData: TypeStructureItem = {
        a: {
          b: {
            h: 'string',
            c: {
              d: 'string',
              e: {
                f: 'number',
              },
            },
          },
        },
        g: 'string',
      };

      expect(buildKeys(testData)).toEqual([
        'a.b.h', 'a.b.c.d', 'a.b.c.e.f', 'g',
      ]);
    });
  });

  describe('validateBody', () => {
    it('real simple good case', () => {
      const body = {
        'parserName': 's7',
        'additionalArgs': {
          'from': 'Санкт-Петербург',
          'to': 'Омск',
          'date': '26.10.2022',
        },
      };

      const typeStructure: TypeStructureItem = {
        parserName: 'string',
        additionalArgs: {
          from: 'string',
          to: 'string',
          date: 'string',
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({ result: true });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(4);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('real simple good case-2', () => {
      const body = {
        'parserName': ['s7', 'foo', 'bar'],
        'additionalArgs': {
          'from': 'Санкт-Петербург',
          'to': 'Омск',
          'date': '26.10.2022',
        },
      };

      const typeStructure: TypeStructureItem = {
        parserName: ['string'],
        additionalArgs: {
          from: 'string',
          to: 'string',
          date: 'string',
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({ result: true });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(3);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
    });

    it('real simple bad case', () => {
      const body = {
        'parserName': 's7',
        'additionalArgs': {
          'from': 'Санкт-Петербург',
          'to': 'Омск',
          'date': '26.10.2022',
        },
      };

      const typeStructure: TypeStructureItem = {
        parserName: 'number',
        additionalArgs: {
          from: 'string',
          to: 'string',
          date: 'string',
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'parserName',
        errorMessage: 'type mismatch',
        errorComment: 'Expected type "number", got string'
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('real simple bad case-2', () => {
      const body = {
        'parserName': 5,
        'additionalArgs': {
          'from': 'Санкт-Петербург',
          'to': 'Омск',
          'date': '26.10.2022',
        },
      };

      const typeStructure: TypeStructureItem = {
        parserName: 'string',
        additionalArgs: {
          from: 'string',
          to: 'string',
          date: 'string',
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'parserName',
        errorMessage: 'type mismatch',
        errorComment: 'Expected type "string", got number'
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('dummy good case', () => {
      const body = {
        'number': 5,
        'string': 's',
        'arrays': {
          'arrayOfStr': ['s1', 's2'],
          'arrayOfNumber': [1, 1],
        }
      };

      const typeStructure: TypeStructureItem = {
        number: 'number',
        string: 'string',
        arrays: {
          arrayOfStr: ['string'],
          arrayOfNumber: ['number']
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({ result: true });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
    });

    it('dummy bad case', () => {
      const body = {
        'number': 5,
        'string': 's',
        'arrays': {
          'arrayOfStr': ['s1', 's2'],
          'arrayOfNumber': [1, 1],
        }
      };

      const typeStructure: TypeStructureItem = {
        number: 'string',
        string: 'string',
        arrays: {
          arrayOfStr: ['string'],
          arrayOfNumber: ['number']
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'number',
        errorMessage: 'type mismatch',
        errorComment: 'Expected type "string", got number'
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('dummy bad case', () => {
      const body = {
        'number': 5,
        'string': 's',
        'arrays': {
          'arrayOfStr': ['s1', 's2'],
          'arrayOfNumber': [1, 1],
        }
      };

      const typeStructure: TypeStructureItem = {
        number: 'number',
        string: 'string',
        arrays: {
          randomValue: 'string',
          arrayOfStr: ['string'],
          arrayOfNumber: ['number']
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'arrays.randomValue',
        errorMessage: 'no key in body',
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(1);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('should validate null', () => {
      const body = {
        'number': null,
        'string': 's',
        'arrays': {
          'arrayOfStr': ['s1', 's2'],
          'arrayOfNumber': [1, 1],
        }
      };

      const typeStructure: TypeStructureItem = {
        number: 'number',
        string: 'string',
        arrays: {
          randomValue: 'string',
          arrayOfStr: ['string'],
          arrayOfNumber: ['number']
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'number',
        errorMessage: 'no key in body',
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });

    it('should validate empty string', () => {
      const body = {
        'number': '',
        'string': 's',
        'arrays': {
          'arrayOfStr': ['s1', 's2'],
          'arrayOfNumber': [1, 1],
        }
      };

      const typeStructure: TypeStructureItem = {
        number: 'number',
        string: 'string',
        arrays: {
          randomValue: 'string',
          arrayOfStr: ['string'],
          arrayOfNumber: ['number']
        }
      };

      expect(validateBody(body, typeStructure)).toEqual({
        result: false,
        errorField: 'number',
        errorMessage: 'no key in body',
      });

      expect((typesToFuncs['"number"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['"string"'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);

      expect((typesToFuncs['["number"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
      expect((typesToFuncs['["string"]'] as jest.Mock<boolean, [unknown]>)
        .mock.calls.length).toEqual(0);
    });
  });
});
