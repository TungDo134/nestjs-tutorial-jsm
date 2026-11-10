import type { Prisma } from '../../generated/prisma/client.js';

// Giới hạn trường dữ liệu truy vấn (Limit field DB)
// Dữ liệu user xem về chính mình
export const selfUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

// Dữ liệu admin xem khi quản lý: gồm bộ của self, thêm trường quản trị
export const adminUserSelect = {
  ...selfUserSelect,
  emailVerified: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
