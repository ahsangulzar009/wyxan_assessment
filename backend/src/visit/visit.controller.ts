import { Body, Controller, Post } from '@nestjs/common';
import { VisitService } from './visit.service.js';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) { }

  @Post()
  async visit(@Body() body: { userId: string; address: string; via: string }) {
    return this.visitService.visit(body);
  }
}
