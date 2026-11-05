import { Module } from '@nestjs/common';
import { SiteService } from './site.service.js';
import { SiteController } from './site.controller.js';

@Module({
  controllers: [SiteController],
  providers: [SiteService]
})
export class SiteModule {}
