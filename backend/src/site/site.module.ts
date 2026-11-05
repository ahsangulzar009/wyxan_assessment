import { Module } from '@nestjs/common';
import { SitesService } from './site.service.js';
import { SitesController } from './site.controller.js';

@Module({
  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
