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
