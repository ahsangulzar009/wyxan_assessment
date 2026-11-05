import { Controller, Get, Query } from '@nestjs/common';
import { SiteService } from './site.service.js';


@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) { }


  @Get('search')
  async search(@Query('q') q: string) {
    const sites = await this.siteService.search(q);
    return { sites }
  }
}
