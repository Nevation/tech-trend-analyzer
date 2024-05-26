import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { CollectorMediumModule } from './medium/medium.module';
import { CollectorDevModule } from './dev/dev.module';

@Module({
  imports: [CollectorMediumModule, CollectorDevModule],
  providers: [CollectorService],
  exports: [CollectorService],
})
export class CollectorModule {}
