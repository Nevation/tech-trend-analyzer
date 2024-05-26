import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { CollectorMediumModule } from './medium/medium.module';

@Module({
  imports: [CollectorMediumModule],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
