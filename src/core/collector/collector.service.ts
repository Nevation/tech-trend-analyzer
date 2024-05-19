import { Injectable } from '@nestjs/common';
import { CollectorStrategy } from './collector.strategy';
import { CollectorMedium } from './medium/medium.service';

@Injectable()
export class CollectorService {
  private readonly collectList: CollectorStrategy[];

  constructor(private readonly collectorMedium: CollectorMedium) {
    this.collectList = [this.collectorMedium];
  }

  public async collectPost() {
    const result = await Promise.all(this.collectList.map((v) => v.collectBlogPost()));
    return result;
  }
}
