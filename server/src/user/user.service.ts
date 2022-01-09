import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { InvalidInputException } from '../error';
import { ErrorCode } from '../error/enum/error-code.enum';
import { UserUtil } from './utils/user.util';
import { AuthService } from '../auth/auth.service';
import { FindUsersInput } from './dto/get-user-input';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private userUtil: UserUtil,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<UserEntity> {
    const { email, password } = createUserInput;

    if (await this.userRepository.findByEmail(email)) {
      throw new InvalidInputException(
        'Duplicated email',
        ErrorCode.BAD_INPUT_DUPLICATED_SIGNUP_EMAIL,
      );
    }

    let id = this.userUtil.getRandomId();

    while ((await this.userRepository.findOne(id)) != null) {
      console.log({ id });
      id = this.userUtil.getRandomId();
    }

    createUserInput.password = await this.authService.hashPassword(password);

    return this.userRepository.create({ id, ...createUserInput });
  }

  findById(id: string) {
    return this.userRepository.findOne(id);
  }

  async findAllUsers(input: FindUsersInput) {
    return this.userRepository.findAll(input);
  }
}
