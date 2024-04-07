import { Module } from '@nestjs/common';
import { CoreScheduler } from './core.schedule';
import { CoreModule } from 'src/core/core.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CoreModule, ScheduleModule.forRoot()],
  providers: [CoreScheduler],
})
export class SchedulerModule {}
