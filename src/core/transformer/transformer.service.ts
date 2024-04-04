import { Injectable } from '@nestjs/common';
import { TransformedResult } from './transformer.type';
import { CollectedPost } from '../collector/collector.type';

@Injectable()
export class TransformerService {
  public async transform(_: CollectedPost): Promise<TransformedResult> {
    throw new Error('Not implemented');
  }
}
