import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async list() {
    const users = await this.userService.list();
    return { users }
  }

}
