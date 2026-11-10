import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../generated/prisma/enums.js';

// @Roles() chỉ gán nhãn
// RolesGuard mới là nơi đọc nhãn và quyết định cho qua hay 403
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
