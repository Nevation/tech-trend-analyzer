import { CollectProvidor } from './collector.constant';
import { CollectedPostResult } from './collector.type';

export abstract class CollectorStrategy {
  public abstract collectBlogPost(): Promise<CollectedPostResult>;
  public abstract getProvidor(): CollectProvidor;
}
