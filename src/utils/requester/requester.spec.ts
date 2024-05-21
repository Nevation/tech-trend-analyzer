import { Requester } from './requester';
import { RequesterStrategy } from './requester.strategy';

class MockRequesterStrategy implements RequesterStrategy {
  exec = jest.fn().mockImplementation((fn) => fn());
}

describe('Requester', () => {
  let requester: Requester;
  let strategy: MockRequesterStrategy;

  const mockData = { data: 'test' };

  beforeEach(() => {
    strategy = new MockRequesterStrategy();
    requester = new Requester(strategy);
  });

  describe('get', () => {
    it('should make a GET request without query parameters', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData),
      });

      const url = 'https://example.com/api';
      const result = await requester.get(url);

      expect(global.fetch).toHaveBeenCalledWith(url, { headers: undefined });
      expect(result).toEqual(mockData);
    });

    it('should make a GET request with query parameters', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData),
      });

      const url = 'https://example.com/api';
      const query = { key: 'value' };
      const result = await requester.get(url, query);

      expect(global.fetch).toHaveBeenCalledWith(`${url}?key=value`, { headers: undefined });
      expect(result).toEqual(mockData);
    });
  });

  describe('post', () => {
    it('should make a POST request', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData),
      });

      const url = 'https://example.com/api';
      const body = { key: 'value' };
      const result = await requester.post(url, body);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('should make a DELETE request', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData),
      });

      const url = 'https://example.com/api';
      const body = { key: 'value' };
      const headers = { Authorization: 'Bearer token' };
      const result = await requester.delete(url, body, headers);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(body),
      });
      expect(result).toEqual(mockData);
    });
  });
});
