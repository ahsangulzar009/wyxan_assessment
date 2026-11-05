import { Module } from '@nestjs/common';
import { SitesService } from './sites.service.js';
import { SitesController } from './sites.controller.js';

@Module({
  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
