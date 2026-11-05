import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.model.js';

@Injectable()
export class UserService {
  list() {
    return User.find().select('name').sort({ name: 1 }).lean();
  }

}
