import { Injectable } from '@nestjs/common';
import { ClassifierResult } from './classifier.type';
import { TransformedResult } from '../transformer/transformer.type';

@Injectable()
export class ClassifierService {
  public async classify(_: TransformedResult): Promise<ClassifierResult> {
    throw new Error('Not implemented');
  }
}
