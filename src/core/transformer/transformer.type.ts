import { CollectedPost } from '../collector/collector.type';

export class TransformedResult {
  collectedData: CollectedPost;
  transformData: TransformedPost;
}

export class TransformedPost {
  language: string;
  postSummary: string;
}
