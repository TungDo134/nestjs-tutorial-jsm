import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @ResponseMessage('Fetch all users')
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
}
