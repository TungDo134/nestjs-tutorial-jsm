import { Module } from '@nestjs/common';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './lib/database/prisma.module.js';

import { AppController } from './app.controller.js';

import { AppService } from './app.service.js';

import { auth } from './lib/auth.js';
import { UserModule } from './module/user/user.module.js';

import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AppValidationPipe } from './common/pipes/app-validation.pipe.js';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_PIPE, useClass: AppValidationPipe },
  ],
})
export class AppModule {}
