import { simpleCalculator, Action } from './index';

const validTestCases = [
  // Addition tests
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: -5, b: 3, action: Action.Add, expected: -2 },
  { a: 0, b: 0, action: Action.Add, expected: 0 },

  // Subtraction tests
  { a: 10, b: 4, action: Action.Subtract, expected: 6 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 0, b: 5, action: Action.Subtract, expected: -5 },
  { a: -3, b: -7, action: Action.Subtract, expected: 4 },

  // Multiplication tests
  { a: 6, b: 7, action: Action.Multiply, expected: 42 },
  { a: 3, b: 4, action: Action.Multiply, expected: 12 },
  { a: -2, b: 5, action: Action.Multiply, expected: -10 },
  { a: 0, b: 100, action: Action.Multiply, expected: 0 },

  // Division tests
  { a: 15, b: 3, action: Action.Divide, expected: 5 },
  { a: 20, b: 4, action: Action.Divide, expected: 5 },
  { a: 7, b: 2, action: Action.Divide, expected: 3.5 },
  { a: -12, b: 3, action: Action.Divide, expected: -4 },

  // Exponentiation tests
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 3, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 10, b: 1, action: Action.Exponentiate, expected: 10 }
];

const invalidTestCases = [
  // Invalid actions
  { a: 5, b: 3, action: 'invalid', expected: null },
  { a: 1, b: 1, action: '%', expected: null },
  { a: 2, b: 2, action: null, expected: null },
  { a: 3, b: 3, action: undefined, expected: null },

  // Invalid arguments
  { a: '5', b: 3, action: Action.Add, expected: null },
  { a: 5, b: 'invalid', action: Action.Add, expected: null },
  { a: null, b: 3, action: Action.Add, expected: null },
  { a: undefined, b: 3, action: Action.Add, expected: null },
  { a: true, b: 5, action: Action.Multiply, expected: null },
  { a: {}, b: 2, action: Action.Subtract, expected: null },
  { a: [], b: 1, action: Action.Divide, expected: null }
];

describe('simpleCalculator', () => {
  test.each(validTestCases)(
    'should return $expected when calculating $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    }
  );

  test.each(invalidTestCases)(
    'should return null for invalid input: a=$a, b=$b, action=$action',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    }
  );
});
