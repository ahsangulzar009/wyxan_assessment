import { Controller, Get, Query } from '@nestjs/common';
import { SiteService } from './site.service.js';


@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService){}


  @Get('search')
  search(@Query('q') q: string) {
    return this.siteService.search(q);
  }
}
