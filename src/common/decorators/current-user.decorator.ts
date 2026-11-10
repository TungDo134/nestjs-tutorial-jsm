import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
  /*
  createParamDecorator tạo ra decorator đặt trên tham số của handler. 
  Khi có request, Nest chuẩn bị tham số cho handler và gọi hàm bạn viết, truyền vào hai thứ: 
  field là giá trị bạn ghi trong ngoặc (@CurrentUser('id') thì field = 'id', không ghi gì thì undefined), 
  và ctx là ngữ cảnh của request hiện tại.
   */
  (field: keyof Express.User | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user;
    return field ? user?.[field] : user;
  },
);
