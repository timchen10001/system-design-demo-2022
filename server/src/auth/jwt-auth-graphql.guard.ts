import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ErrorCode } from '../error/enum/error-code.enum';
import { UnauthorizedException } from '../error';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './decorator/role.decorator';
import { JwtTokenType } from './enum/jwt-token-type.enum';

@Injectable()
export class JwtAuthGraphQLGuard extends AuthGuard('jwt') {
  constructor(private reflactor: Reflector, private authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException(
        'Expired Token',
        ErrorCode.UNAUTHORIZED_EXPIRED_TOKEN,
      );
    } else if (info) {
      throw new UnauthorizedException(
        'Invalid Token',
        ErrorCode.UNAUTHORIZED_INVALID_TOKEN,
      );
    }
    return super.handleRequest(err, user, info, context, status);
  }

  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }

  async canActivate(context: ExecutionContext) {
    const superCanActivate = () => super.canActivate(context) as boolean;

    const req = this.getRequest(context);

    let authToken = req.headers.authorization;

    const requiredRoles = this.reflactor.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles.includes(Role.Public) || !requiredRoles.length) {
      try {
        return await superCanActivate();
      } catch (ex) {
        return false;
      }
    }

    await superCanActivate();

    authToken = authToken.replace(/^Bearer\s/, '');

    const { roles, tokenType } = this.authService.parseToken(authToken);

    const rolesVerification = requiredRoles.some((role) =>
      roles?.includes(role),
    );

    const validTokenType = tokenType === JwtTokenType.ACCESS_TOKEN;

    if (!rolesVerification) {
      throw new ForbiddenException(`${roles} Is Forbidden To This Resource.`);
    }

    if (!validTokenType) {
      throw new UnauthorizedException(
        'Invalid Token Type',
        ErrorCode.UNAUTHORIZED_INVALID_TOKEN,
      );
    }

    return rolesVerification;
  }
}
