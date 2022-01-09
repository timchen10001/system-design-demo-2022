import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { FindUsersInput } from './dto/get-user-input';
import { UserEntity } from './entities/user.entity';
import { User, UserResult } from './model/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args() createUserInput: CreateUserInput): Promise<UserEntity> {
    return this.userService.create(createUserInput);
  }

  @Query(() => UserResult)
  async users(@Args() input: FindUsersInput): Promise<UserResult> {
    const users = await this.userService.findAllUsers(input);

    return { users };
  }

  @Query(() => User)
  user(@Args('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }
}
