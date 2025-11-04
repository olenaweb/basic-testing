import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts/1';
    const responseData = { id: 1, title: 'Test Post' };

    mockAxiosInstance.get.mockResolvedValue({ data: responseData });

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    const responseData = { id: 1, title: 'Test Post' };

    mockAxiosInstance.get.mockResolvedValue({ data: responseData });

    await throttledGetDataFromApi(relativePath);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(relativePath);
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
  });

  test('should return response data', async () => {
    const relativePath = '/posts/1';
    const responseData = { id: 1, title: 'Test Post', body: 'Test content' };

    mockAxiosInstance.get.mockResolvedValue({ data: responseData });

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(responseData);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('title', 'Test Post');
    expect(result).toHaveProperty('body', 'Test content');
  });
});
