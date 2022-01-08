import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PasswordHashConstants } from './constants/jwt-constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password): Promise<string> {
    const hash = await bcrypt.hash(password, PasswordHashConstants.saltRounds);
    return hash;
  }
}
