import { Body, Controller, Get, Post } from '@nestjs/common';

import { LoginInput } from './dto/login.input';
import { JWTToken } from '../auth/dto/jwt-token.dto';
import { Role } from '../auth/dto/role.enum';
import { AuthenticationService } from './authentication.service';

@Controller('login')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('admin')
  async loginAdmin(@Body() body: LoginInput): Promise<JWTToken> {
    return this.authenticationService.login(body, Role.Admin);
  }

  @Post('user')
  async loginUser(@Body() body: LoginInput): Promise<JWTToken> {
    return this.authenticationService.login(body, Role.User);
  }
}
