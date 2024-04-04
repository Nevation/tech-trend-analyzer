import { CollectorStrategy } from '../collector.strategy';
import { CollectedPostResult } from '../collector.type';
import { CollectProvidorMap } from '../collector.constant';

export class CollectorMedium extends CollectorStrategy {
  public async collectBlogPost(): Promise<CollectedPostResult> {
    throw new Error('Method not implemented.');
  }

  public getProvidor() {
    return CollectProvidorMap.medium;
  }
}
