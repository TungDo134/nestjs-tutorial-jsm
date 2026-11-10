import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';

/**
 * --------------- Hai điểm thiết kế chính ---------------
 * @Roles('ADMIN') đặt ở cấp class làm mặc định “khoá”,
 * còn các route /me dùng @Roles('PARTICIPANT', 'ADMIN') để ghi đè.
 * => Đây chính là cơ chế getAllAndOverride (handler trước, class sau).

 * Lợi ích: nếu sau này thêm route mới mà quên gắn nhãn, nó mặc định chỉ admin vào được => lỗi theo hướng an toàn.
 * /user/me khai báo trước /user/:id, nếu không "chuỗi me" bị hiểu là một id.
 */

/**
 * --------------- Cơ chế @CurrentUser('id') - Trả lời “bạn là ai?” ---------------
 * Nó không tự trả lời => Better Auth mới là bên xác thực, @CurrentUser('id') chỉ đọc lại kết quả đó.
 * decorator này không kiểm tra quyền hay xác thực
 * Nếu guard Better Auth không chạy (ví dụ route bị @AllowAnonymous()), req.user rỗng và hàm chỉ trả undefined.
 * 
 * @CurrentUser('id')    // → user['id']    → user.id
   @CurrentUser('role')  // → user['role']  → user.role
   @CurrentUser()        // không có param  → trả cả đối tượng user
  
  Phải là tên trường có trong kiểu Express.User được khai báo ở express.d.ts
 */

@Controller('user')
@UseGuards(RolesGuard)
@Roles('ADMIN') // default cả controller chỉ cho admin, route # thì ghi đè
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----- Route của chính mình: phải đứng TRƯỚC ':id' -----

  @Get('me')
  @Roles('PARTICIPANT', 'ADMIN')
  @ResponseMessage('Fetch current user')
  findMe(@CurrentUser('id') userId: string) {
    return this.userService.findMe(userId);
  }

  @Patch('me')
  @Roles('PARTICIPANT', 'ADMIN')
  @ResponseMessage('Profile updated')
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  // ----- Route quản trị: kế thừa @Roles('ADMIN') của class -----

  @Get()
  @ResponseMessage('Fetch all users')
  findAll(@Query() query: PaginationDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Fetch user')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id/role')
  @ResponseMessage('User role updated')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.userService.updateRole(id, dto, currentUserId);
  }

  @Delete(':id')
  @ResponseMessage('User deleted')
  remove(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    return this.userService.remove(id, currentUserId);
  }
}
