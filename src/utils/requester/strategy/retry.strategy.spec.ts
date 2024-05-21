import { RetryRequestStrategy } from './retry.strategy';

describe('RetryRequestStrategy', () => {
  let strategy: RetryRequestStrategy;

  it('should succeed on the first attempt', async () => {
    strategy = new RetryRequestStrategy({ maxRetryCount: 3, delay: 100 });

    const fn = jest.fn().mockResolvedValue('success');

    const result = await strategy.exec(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed', async () => {
    strategy = new RetryRequestStrategy({ maxRetryCount: 3, delay: 100 });

    const fn = jest.fn().mockRejectedValueOnce(new Error('failure')).mockResolvedValue('success');

    const result = await strategy.exec(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry and fail after max retries', async () => {
    strategy = new RetryRequestStrategy({ maxRetryCount: 3, delay: 100 });

    const fn = jest.fn().mockRejectedValue(new Error('failure'));

    await expect(strategy.exec(fn)).rejects.toThrow('failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should respect delay between retries', async () => {
    strategy = new RetryRequestStrategy({ maxRetryCount: 3, delay: 100 });

    const fn = jest.fn().mockRejectedValue(new Error('failure'));

    const startTime = Date.now();
    await expect(strategy.exec(fn)).rejects.toThrow('failure');
    const endTime = Date.now();

    const elapsed = endTime - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(200); // 2 retries with 100ms delay each
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
