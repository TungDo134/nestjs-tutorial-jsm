# <Learn NestJS>

<Mô tả ngắn: Clone lại repo của `https://github.com/jsmastery-pro/Hackathon-backend`>

## Công nghệ sử dụng

NestJS, Prisma ORM 7, PostgreSQL 17 (chạy bằng Docker), Better Auth (đăng nhập bằng email và mật khẩu), npm.

## Yêu cầu trước khi chạy

Node.js: Prisma 7 yêu cầu 22.22.3 trở lên (nhánh 22.x), 24.15 trở lên hoặc 26 trở lên. Kiểm tra bằng `node -v`.
Docker Desktop để chạy PostgreSQL.
npm (đi kèm Node.js).

## Cài đặt

1. Clone repo và cài gói:

```bash
git clone <url-repo>
cd <ten-thu-muc>
npm install
```

2. Tạo file môi trường từ file mẫu (trên Windows CMD dùng `copy`, trên Git Bash hoặc macOS/Linux dùng `cp`):

```bash
copy .env.example .env
```

3. Mở `.env` và điền giá trị thật (xem bảng bên dưới).

4. Khởi động PostgreSQL (xem mục Database).

5. Sinh Prisma Client và áp dụng migration:

```bash
npm run db:generate
npm run db:migrate
```

6. Chạy ứng dụng:

```bash
npm run start:dev
```

Ứng dụng chạy tại `http://localhost:<cổng>`.

## Biến môi trường

| Biến               | Ý nghĩa                                                                              |
| ------------------ | ------------------------------------------------------------------------------------ |
| DATABASE_URL       | Chuỗi kết nối PostgreSQL, ví dụ `postgresql://<user>:<password>@localhost:5432/<db>` |
| BETTER_AUTH_SECRET | Khóa bí mật của Better Auth, dùng chuỗi ngẫu nhiên dài                               |
| BETTER_AUTH_URL    | Địa chỉ gốc của ứng dụng, ví dụ `http://localhost:<cổng>`                            |

Tên và danh sách biến có thể khác tùy cấu hình của bạn, hãy đối chiếu với file `.env.example` và tài liệu Better Auth. Không bao giờ commit file `.env`.

## Database (PostgreSQL trong Docker)

Chạy một container PostgreSQL 17 (đổi tên, mật khẩu, tên database cho phù hợp):

```bash
docker run --name <ten-container> -e POSTGRES_PASSWORD=<mat-khau> -e POSTGRES_DB=<ten-db> -p 5432:5432 -d postgres:17
```

Nếu container đã tồn tại thì chỉ cần mở lại:

```bash
docker start <ten-container>
```

Giá trị trong `DATABASE_URL` phải khớp với user, mật khẩu, cổng và tên database ở trên.

## Prisma

Các model được tách thành nhiều file trong thư mục `prisma/models/`. Lịch sử thay đổi database nằm trong `prisma/migrations/` và được commit vào Git. Cấu hình kết nối nằm trong `prisma.config.ts`.

Prisma Client được sinh ra tại `src/generated/prisma` và không được commit. Vì vậy sau khi clone, hoặc mỗi khi sửa schema, bạn phải chạy `npm run db:generate`.

| Lệnh                | Tác dụng                                                             |
| ------------------- | -------------------------------------------------------------------- |
| npm run db:generate | Sinh lại Prisma Client (`npx prisma generate`)                       |
| npm run db:migrate  | Tạo và áp dụng migration ở môi trường dev (`npx prisma migrate dev`) |
| npm run db:format   | Định dạng các file schema (`npx prisma format`)                      |
| npm run db:studio   | Mở giao diện xem dữ liệu (`npx prisma studio`)                       |

Khi triển khai (production), dùng `npx prisma migrate deploy` thay cho `migrate dev`.

## Cấu trúc thư mục chính

```text
prisma/
  models/              các file model (User, Session, ...)
  migrations/          lịch sử migration (commit vào Git)
prisma.config.ts       cấu hình Prisma
src/
  lib/database/        prisma.service.ts, prisma.module.ts
  generated/prisma/    Prisma Client sinh tự động (không commit)
```

## Lỗi thường gặp

Báo thiếu module `generated/prisma/client`: bạn chưa sinh client, chạy `npm run db:generate`.

Báo không kết nối được database: kiểm tra container đang chạy (`docker ps`), cổng 5432 không bị chiếm, và `DATABASE_URL` đúng thông tin.

Biến môi trường bị `undefined` dù đã có trong `.env`: kiểm tra `.env` nằm ở thư mục gốc của dự án và ứng dụng đã nạp nó (ví dụ qua `ConfigModule`).
