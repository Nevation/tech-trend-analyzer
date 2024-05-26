import { Injectable } from '@nestjs/common';
import { CollectorStrategy } from './collector.strategy';
import { CollectorMedium } from './medium/medium.service';
import { CollectorDev } from './dev/dev.service';

@Injectable()
export class CollectorService {
  private readonly collectList: CollectorStrategy[];

  constructor(private readonly collectorMedium: CollectorMedium, private readonly collectorDev: CollectorDev) {
    this.collectList = [this.collectorMedium, this.collectorDev];
  }

  public async collectPost() {
    const result = await Promise.all(this.collectList.map((v) => v.collectBlogPost()));
    return result;
  }
}
