/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginInput } from './dto/login.input';
import { JWTToken } from '../auth/dto/jwt-token.dto';
import { AuthenticationService } from './authentication.service';
import { AuthService } from '../auth/auth.service';
import { AccessTokenInput } from './dto/access-token.dto';
import { LoginDescription } from './description/login.description';
import { AccessTokenDescription } from './description/access-token.description';

@ApiTags('authentication')
@Controller()
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private authService: AuthService,
  ) {}

  @Post('login/user')
  @ApiOkResponse({ type: JWTToken, description: LoginDescription.apiOkResponse })
  @ApiBody({ type: LoginInput, required: true, description: LoginDescription.apiBody })
  loginUser(@Body() body: LoginInput): Promise<JWTToken> {
    return this.authenticationService.loginUser(body);
  }

  @Post('accessToken')
  @ApiOkResponse({ type: JWTToken, description: AccessTokenDescription.apiOkResponse })
  @ApiCreatedResponse({ type: JWTToken })
  @ApiBody({ type: AccessTokenInput, description: AccessTokenDescription.apiBody })
  accessToken(@Body() body: AccessTokenInput): JWTToken {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
