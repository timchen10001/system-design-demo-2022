import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { JwtAuthGraphQLGuard } from '../auth/jwt-auth-graphql.guard';
import { CreateUserInput } from './dto/create-user.input';
import { FindUsersInput } from './dto/get-user-input';
import { UserEntity } from './entities/user.entity';
import { MeResult, User, UserResult } from './model/user.model';
import { UserService } from './user.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { JwtPayloadInput } from '../auth/dto/jwt-payload.input';
import { JWTToken } from '../auth/dto/jwt-token.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args() createUserInput: CreateUserInput): Promise<UserEntity> {
    return this.userService.create(createUserInput);
  }

  @UseGuards(JwtAuthGraphQLGuard)
  @Roles(Role.Admin, Role.User) /** @todo remove user */
  @Query(() => UserResult)
  async users(@Args() input: FindUsersInput): Promise<UserResult> {
    const users = await this.userService.findAllUsers(input);

    return { users };
  }

  @UseGuards(JwtAuthGraphQLGuard)
  @Query(() => User)
  @Roles(Role.Admin, Role.Public, Role.User)
  user(@Args('id', { type: () => ID }) id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGraphQLGuard)
  @Query(() => MeResult, { name: 'me', nullable: true })
  @Roles(Role.Admin, Role.Public, Role.User)
  async me(@CurrentUser() currentUser: JwtPayloadInput): Promise<MeResult> {
    const user = await this.userService.findById(currentUser.id);

    if (!user) return null;

    return {
      ...user,
      role: currentUser.roles?.[0],
    };
  }

  @Query(() => JWTToken)
  async token(): Promise<JWTToken> {
    return { accessToken: '', refreshToken: '' };
  }
}
