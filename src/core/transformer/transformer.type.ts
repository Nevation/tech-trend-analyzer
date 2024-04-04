import { CollectedPost } from '../collector/collector.type';

export class TransformedResult {
  collectedData: CollectedPost;
  transformData: TransformedPost;
}

export class TransformedPost {
  gptId: string;
  language: string;

  score: number;
  postSummary: string;
  postSummaryKor: string;

  gptTags: string[];
}
