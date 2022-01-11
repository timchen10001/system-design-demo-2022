/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UnauthorizedException } from '../error';
import { ErrorCode } from '../error/enum/error-code.enum';
import { JwtConstants, PasswordHashConstants } from './constants/jwt-constants';
import { JwtPayloadInput } from './dto/jwt-payload.input';
import { JWTToken } from './dto/jwt-token.dto';
import { JwtTokenType } from './enum/jwt-token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateTokens(payload): JWTToken {
    const refreshToken = this.generateRefreshToken(payload);
    const accessToken = this.generateAccessToken(refreshToken);

    return { accessToken, refreshToken };
  }

  generateRefreshToken(payload: any): string {
    const { iat, exp, ...refreshPayload } = payload;

    refreshPayload.tokenType = JwtTokenType.REGRESH_TOKEN;

    return jwt.sign(refreshPayload, this.configService.get('JWT_SECRET'), {
      expiresIn: JwtConstants.refreshTokenExpiresIn,
    });
  }

  generateAccessToken(refreshToken: string): string {
    const payload: JwtPayloadInput = this.jwtService.verify(refreshToken);

    if (payload.tokenType !== JwtTokenType.REGRESH_TOKEN) {
      throw new UnauthorizedException(
        'InvalidToken Type',
        ErrorCode.UNAUTHORIZED_INVALID_TOKEN,
      );
    }

    const user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
      tokenType: JwtTokenType.ACCESS_TOKEN,
    };

    const accessToken = jwt.sign(user, this.configService.get('JWT_SECRET'), {
      expiresIn: JwtConstants.accessTokenExpiresIn,
    });

    return accessToken;
  }

  async hashPassword(password): Promise<string> {
    const hash = await bcrypt.hash(password, PasswordHashConstants.saltRounds);
    return hash;
  }

  async validatePassword(
    passwordPlainText: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordPlainText, passwordHashed);
  }
}
