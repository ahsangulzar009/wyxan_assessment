import { Module } from '@nestjs/common';
import { SitesModule } from './sites/sites.module.js';
import { VisitModule } from './visit/visit.module.js';


@Module({
  imports: [SitesModule, VisitModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
