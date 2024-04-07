import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CoreService } from 'src/core/core.service';

@Injectable()
export class CoreScheduler implements OnApplicationBootstrap {
  constructor(private readonly coreService: CoreService) {}

  public async onApplicationBootstrap() {
    await this.runCore();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async runCore() {
    await this.coreService.collectAndSavePost();
  }
}
