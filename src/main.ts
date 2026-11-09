import { NestFactory, Reflector } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  // Chỉ cần khi có frontend, và phải khai báo FRONTEND_URL trong .env
  // app.enableCors({ origin: [process.env.FRONTEND_URL!], credentials: true });

  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.map((error) => ({
            property: error.property,
            message: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Invalid value',
          })),
        ),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
