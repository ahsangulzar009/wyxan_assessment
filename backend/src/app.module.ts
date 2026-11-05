import { Module } from '@nestjs/common';
import { SitesModule } from './sites/sites.module.js';
import { VisitModule } from './visit/visit.module.js';
import { UserModule } from './user/user.module.js';


@Module({
  imports: [SitesModule, VisitModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
