import { Module } from '@nestjs/common';
import { VisitService } from './visit.service.js';
import { VisitController } from './visit.controller.js';

@Module({
  providers: [VisitService],
  controllers: [VisitController]
})
export class VisitModule {}
