import { Injectable } from '@nestjs/common';
import { Site } from '../schemas/site.model.js';


@Injectable()
export class SitesService {
  async getSite(){
    return await Site.find()
  }
}
