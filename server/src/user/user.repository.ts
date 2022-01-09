import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FindUsersInput, UserKeywordSearchScope } from './dto/get-user-input';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(input: DeepPartial<UserEntity>) {
    const newUser = await this.userRepository.create(input);

    return this.userRepository.save(newUser);
  }

  findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(findUserInput: FindUsersInput): Promise<UserEntity[]> {
    let queryBuilder = this.userRepository.createQueryBuilder('users');

    if (findUserInput?.keyword) {
      const suerKeywordSearchScope = UserKeywordSearchScope.map(
        (s) => `"users"."${s}"`,
      );

      queryBuilder = queryBuilder.andWhere(
        `CONCAT_WS(',', ${suerKeywordSearchScope.join(',')}) LIKE '%${
          findUserInput.keyword
        }%'`,
      );
    } else {
      if (findUserInput?.ids?.length) {
        queryBuilder = queryBuilder.andWhere('id IN (:...ids)', {
          ids: findUserInput.ids,
        });
      }

      if (findUserInput?.name) {
        queryBuilder = queryBuilder.andWhere('name = :name', {
          name: findUserInput.name,
        });
      }

      if (findUserInput?.email) {
        queryBuilder = queryBuilder.andWhere('email = :email', {
          email: findUserInput.email,
        });
      }

      if (findUserInput?.mobile) {
        queryBuilder = queryBuilder.andWhere('mobile = :mobile', {
          mobile: findUserInput.mobile,
        });
      }

      if (findUserInput?.from) {
        queryBuilder = queryBuilder.andWhere('createdAt >= :from', {
          from: findUserInput.from,
        });
      }

      if (findUserInput?.to) {
        queryBuilder = queryBuilder.andWhere('createdAt <= :to', {
          to: findUserInput.to,
        });
      }
    }

    return queryBuilder.orderBy('users.createdAt', 'DESC').getMany();
  }
}
