import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SiteService } from './site.service.js';


@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) { }


  @Get('search')
  async search(@Query('q') q: string) {
    const sites = await this.siteService.search(q);
    return { sites }
  }

  @Post("/publish")
  async publish(@Body() body: { authorId: string; address: string; title: string; html: string }) {
    const created = await this.siteService.publish(body);
    return {
      success: true,
      message: "Site Published Successfully!",
      site: {
        address: created.address,
        userId: body.authorId,
        via: "typed"
      }
    };

  }
}
