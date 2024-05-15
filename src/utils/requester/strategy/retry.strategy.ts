import { Logger } from '@nestjs/common';
import { RequesterStrategy } from '../requester.strategy';

export class RetryRequestStrategy implements RequesterStrategy {
  private readonly option: Required<RetryOption>;
  private readonly logger = new Logger(RetryRequestStrategy.name);

  constructor(option: RetryOption) {
    this.option = {
      maxRetryCount: option?.maxRetryCount ?? 10000,
      delay: option?.delay ?? 2000,
      debug: option.debug ?? false,
    };
  }

  public async exec<T>(fn: () => Promise<T>) {
    let retryCount = 0;

    while (true) {
      try {
        return await fn();
      } catch (e) {
        if (++retryCount === this.option.maxRetryCount) {
          throw e;
        }

        if (this.option.debug) {
          this.logger.debug(`Retry ${fn.name} (count: ${retryCount})`);
        }
      }

      await new Promise((r) => setTimeout(r, this.option.delay));
    }
  }
}

interface RetryOption {
  maxRetryCount?: number;
  delay?: number;
  debug?: boolean;
}
