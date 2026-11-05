import { Module } from '@nestjs/common';

import { VisitModule } from './visit/visit.module.js';
import { UserModule } from './user/user.module.js';
import { SiteModule } from './site/site.module.js';


@Module({
  imports: [SiteModule, VisitModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
