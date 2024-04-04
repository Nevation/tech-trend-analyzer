import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CollectorModule } from './collector/collector.module';
import { ClassifierModule } from './classifier/classifier.module';
import { TransformerModule } from './transformer/transformer.module';

@Module({
  imports: [CollectorModule, ClassifierModule, TransformerModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
