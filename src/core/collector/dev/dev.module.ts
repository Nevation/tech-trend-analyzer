import { Module } from '@nestjs/common';
import { RequesterModule } from 'src/utils/requester/requester.module';
import { CollectorDev } from './dev.service';

@Module({
  imports: [RequesterModule],
  providers: [CollectorDev],
  exports: [CollectorDev],
})
export class CollectorDevModule {}
