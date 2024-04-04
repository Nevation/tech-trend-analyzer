import { Injectable } from '@nestjs/common';
import { CollectorService } from './collector/collector.service';
import { TransformerService } from './transformer/transformer.service';
import { ClassifierService } from './classifier/classifier.service';
import { CollectedPostResult } from './collector/collector.type';
import { TransformedResult } from './transformer/transformer.type';
import { ClassifierResult } from './classifier/classifier.type';
import { CoreResult } from './core.type';

@Injectable()
export class CoreService {
  constructor(
    private readonly collectorService: CollectorService,
    private readonly transformerService: TransformerService,
    private readonly classifiyService: ClassifierService
  ) {}

  public async collectAndSavePost(): Promise<CoreResult[]> {
    const originDataList = await this.collectorService.collectPost();

    const transformDataList = await this.getTransformDataList(originDataList);
    const classifiedDataList = await this.getClassifiedDataList(transformDataList);

    return classifiedDataList;
  }

  private async getTransformDataList(originDataList: CollectedPostResult[]) {
    const transformDataList: TransformedResult[] = [];
    for (const originData of originDataList) {
      for (const collectedPost of originData.collectedPostList) {
        const transformData = await this.transformerService.transform(collectedPost);
        transformDataList.push(transformData);
      }
    }
    return transformDataList;
  }

  private async getClassifiedDataList(transformDataList: TransformedResult[]) {
    const classifiedDataList: ClassifierResult[] = [];
    for (const transformData of transformDataList) {
      const classifiedData = await this.classifiyService.classify(transformData);
      classifiedDataList.push(classifiedData);
    }
    return classifiedDataList;
  }
}
