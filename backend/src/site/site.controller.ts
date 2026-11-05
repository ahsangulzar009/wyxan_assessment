import { Controller, Get } from '@nestjs/common';
import { SitesService } from './site.service.js';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService){}

 
}
