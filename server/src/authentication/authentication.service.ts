import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { AuthService } from '../auth/auth.service';
import { LoginInput } from './dto/login.input';
import { JWTToken } from '../auth/dto/jwt-token.dto';
import { UnauthorizedException } from '../error';
import { ErrorCode } from '../error/enum/error-code.enum';
import { Role } from '../auth/enum/role.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async loginUser(input: LoginInput): Promise<JWTToken> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);

    const validRequest = user
      ? await this.authService.validatePassword(password, user.password)
      : false;

    if (!validRequest) {
      throw new UnauthorizedException(
        'Failed Login',
        ErrorCode.UNAUTHORIZED_INVALID_CREDENTIAL,
      );
    }

    return this.authService.generateTokens({
      id: user.id,
      roles: [Role.User],
    });
  }
}
