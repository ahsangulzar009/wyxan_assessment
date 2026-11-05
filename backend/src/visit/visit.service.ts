import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { User } from '../schemas/user.model.js';
import { Via, VIA, Visit } from '../schemas/visit.model.js';
import { Site } from '../schemas/site.model.js';

@Injectable()
export class VisitService {

  private isVia(v: unknown): v is Via {
    return typeof v === 'string' && (VIA as readonly string[]).includes(v);
  }

  async visit(body: { userId: string; address: string; via: string }) {
    const address = body.address.trim().toLowerCase();

    if (!body.userId || !mongoose.isValidObjectId(body.userId))
      throw new BadRequestException('Valid user is required');
    if (!address) throw new BadRequestException('address is required');
    if (!this.isVia(body.via))
      throw new BadRequestException(`via must be one of: ${VIA.join(', ')}`);

    const user = await User.exists({ _id: body.userId });
    if (!user) throw new BadRequestException('Unknown user');

    await Visit.create({ user: body.userId, address, via: body.via });

    const site = await Site.findOne({ address }).select('address title html').lean();
    if (!site) throw new NotFoundException(`No such address: ${address}`);

    return site

  }
}
