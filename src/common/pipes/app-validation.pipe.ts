import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import type { ValidationError } from 'class-validator';

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // bỏ các file không có decorator trong DTO

      forbidNonWhitelisted: true, // status 400 khi client gửi field lạ thay vì bỏ qua

      transform: true, // return instance DTO, ép kiểu về @Type (query string -> number)

      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(
          errors.map((error) => ({
            property: error.property,
            message: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Invalid value',
          })),
        ),
    });
  }
}
