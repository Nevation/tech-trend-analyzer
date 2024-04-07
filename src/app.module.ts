import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SchedulerModule } from './schedule/scheduler.module';

@Module({
  imports: [CoreModule, SchedulerModule],
})
export class AppModule {}
