import { Module } from '@nestjs/common';
import { MarkdownConverter } from './markdownConverter';
import { RequesterModule } from 'src/utils/requester/requester.module';
import { CollectorMedium } from './medium.service';

@Module({
  imports: [RequesterModule],
  providers: [CollectorMedium, MarkdownConverter],
  exports: [CollectorMedium],
})
export class CollectorMediumModule {}
