import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { CollectorMediumModule } from './medium/medium.module';

@Module({
  providers: [CollectorService, CollectorMediumModule],
  exports: [CollectorService],
})
export class CollectorModule {}
