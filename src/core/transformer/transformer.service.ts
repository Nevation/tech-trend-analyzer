import SummaryTool from 'node-summary';
import { Injectable } from '@nestjs/common';
import { TransformedResult } from './transformer.type';
import { CollectedPost } from '../collector/collector.type';

@Injectable()
export class TransformerService {
  public async transform(collectedData: CollectedPost): Promise<TransformedResult> {
    return {
      collectedData,
      transformData: {
        language: 'en',
        // language: franc(collectedData.postContent),
        postSummary: await this.getSummay(collectedData.postContent),
      },
    };
  }

  private getSummay(postContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
      SummaryTool.getSortedSentences(postContent, 10, (err, sortedSentences) => {
        if (err) {
          return reject(err);
        }

        resolve(sortedSentences.join('\n'));
      });
    });
  }
}
