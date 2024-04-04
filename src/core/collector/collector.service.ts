import { Injectable } from '@nestjs/common';
import { CollectorStrategy } from './collector.strategy';
import { CollectorMedium } from './medium/medium.service';

@Injectable()
export class CollectorService {
  private readonly collectList: CollectorStrategy[];

  constructor() {
    this.collectList = [new CollectorMedium()];
  }

  public async collectPost() {
    const result = await Promise.all(this.collectList.map((v) => v.collectBlogPost()));
    return result;
  }
}
