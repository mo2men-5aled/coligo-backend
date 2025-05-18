// user.controller.ts
import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.userService.findById(req.user.userId);
    return {
      message: 'User profile fetched successfully',
      user,
    };
  }
}
