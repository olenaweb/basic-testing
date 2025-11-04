import { getBankAccount, BankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockedRandom = random as jest.MockedFunction<typeof random>;

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);

    expect(() => {
      account.withdraw(100);
    }).toThrow(InsufficientFundsError);

    expect(() => {
      account.withdraw(100);
    }).toThrow('Insufficient funds: cannot withdraw more than 50');
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(50);
    const account2 = getBankAccount(0);

    expect(() => {
      account1.transfer(100, account2);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => {
      account.transfer(50, account);
    }).toThrow(TransferFailedError);

    expect(() => {
      account.transfer(50, account);
    }).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    const depositAmount = 50;

    const result = account.deposit(depositAmount);

    expect(result).toBe(account);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    const withdrawAmount = 30;

    const result = account.withdraw(withdrawAmount);

    expect(result).toBe(account);
    expect(account.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(100);
    const account2 = getBankAccount(50);
    const transferAmount = 30;

    const result = account1.transfer(transferAmount, account2);

    expect(result).toBe(account1);
    expect(account1.getBalance()).toBe(70);
    expect(account2.getBalance()).toBe(80);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);

    mockedRandom
      .mockReturnValueOnce(75)
      .mockReturnValueOnce(1);

    const balance = await account.fetchBalance();

    expect(balance).toBe(75);
    expect(balance).not.toBeNull();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(80);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(80);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
    await expect(account.synchronizeBalance()).rejects.toThrow('Synchronization failed');

    expect(account.getBalance()).toBe(100);
  });
});
