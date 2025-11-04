import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalled();

    expect(mockOne).toHaveBeenCalledTimes(1);
    expect(mockTwo).toHaveBeenCalledTimes(1);
    expect(mockThree).toHaveBeenCalledTimes(1);
  });

  test('unmockedFunction should log into console', () => {
    unmockedFunction();

    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
