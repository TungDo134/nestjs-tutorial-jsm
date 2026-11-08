import { Module } from '@nestjs/common';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './lib/database/prisma.module.js';

import { AppController } from './app.controller.js';

import { AppService } from './app.service.js';

import { auth } from './lib/auth.js';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
