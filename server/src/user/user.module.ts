/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { UserUtil } from './utils/user.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    ConfigService,
  ],
  providers: [
    UserResolver,
    UserService,
    UserUtil,
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
