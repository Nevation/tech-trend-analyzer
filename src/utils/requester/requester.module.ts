import { Module } from '@nestjs/common';
import { Requester } from './requester';
import { RetryRequestStrategy } from './strategy';

@Module({
  providers: [
    {
      provide: 'RETRY_REQUESTER',
      useFactory: () => new Requester(new RetryRequestStrategy({ maxRetryCount: 100 })),
    },
  ],
  exports: ['RETRY_REQUESTER'],
})
export class RequesterModule {}
