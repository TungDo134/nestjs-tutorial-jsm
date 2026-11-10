import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service.js';
import { adminUserSelect, selfUserSelect } from './user.select.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Prisma } from '../../generated/prisma/client.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // find user by USER ID
  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: selfUserSelect,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // find all user
  async findAll({ page, limit }: PaginationDto) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        select: adminUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);
    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // find by USER ID (ROLE: ADMIN)
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: adminUserSelect,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // update ROLE
  async updateRole(
    targetId: string,
    dto: UpdateUserRoleDto,
    currentUserId: string,
  ) {
    if (targetId === currentUserId) {
      throw new ForbiddenException('You cannot change your own role');
    }
    try {
      return await this.prisma.user.update({
        where: { id: targetId },
        data: { role: dto.role },
        select: adminUserSelect,
      });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }

  // update user
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: dto,
        select: selfUserSelect,
      });
    } catch (error) {
      this.mapPrismaError(error);
    }
  }

  // remove by USER ID
  async remove(targetId: string, currentUserId: string) {
    if (targetId === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    try {
      await this.prisma.user.delete({ where: { id: targetId } });
      return { id: targetId };
    } catch (error) {
      this.mapPrismaError(error);
    }
  }

  // Dịch mã lỗi Prisma thành lỗi HTTP có nghĩa
  // P2025 “không tìm thấy bản ghi để cập nhật hoặc xoá”
  // P2003 "vi phạm khoá ngoại".
  private mapPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      if (error.code === 'P2003') {
        throw new ConflictException(
          'User cannot be deleted because they still own hackathons',
        );
      }
    }
    throw error;
  }
}
