import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VisitService } from './visit.service.js';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) { }

  @Post()
  async visit(@Body() body: { userId: string; address: string; via: string }) {
    const site = await this.visitService.visit(body);
    return {site} 
  }

  @Get()
  async history(@Query('userId') userId: string) {
    const visitors = await this.visitService.history(userId);
    return { visitors }
  }

}
