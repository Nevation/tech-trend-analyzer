import { Module } from '@nestjs/common';
import { MarkdownConverter } from './markdownConverter';

@Module({
  providers: [MarkdownConverter],
  exports: [MarkdownConverter],
})
export class CollectorMediumModule {}
