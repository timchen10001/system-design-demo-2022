import { Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authentication.service';

@Resolver()
export class AuthenticationResolver {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {}
}
