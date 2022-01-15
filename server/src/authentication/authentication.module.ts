/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationController } from './authentication.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    UserModule,
  ],
  providers: [
    UserRepository,
    AuthenticationResolver,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
