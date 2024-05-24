import { Injectable } from '@nestjs/common';
import { ClassifierResult } from './classifier.type';
import { TransformedResult } from '../transformer/transformer.type';

@Injectable()
export class ClassifierService {
  public async classify(transformedResult: TransformedResult): Promise<ClassifierResult> {
    return {
      transformData: transformedResult.transformData,
      collectedData: transformedResult.collectedData,
      classifierData: {},
    };
  }
}
