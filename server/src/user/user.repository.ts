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

    queryBuilder = ((qb) => {
      if (findUserInput?.keyword) {
        const userKeywordSearchScope = UserKeywordSearchScope.map(
          (s) => `"users"."${s}"`,
        );

        return qb.andWhere(
          `CONCAT_WS(',', ${userKeywordSearchScope.join(',')}) LIKE '%${
            findUserInput.keyword
          }%'`,
        );
      }

      if (findUserInput?.ids?.length) {
        qb = qb.andWhere('id IN (:...ids)', {
          ids: findUserInput.ids,
        });
      }

      if (findUserInput?.name) {
        qb = qb.andWhere('name = :name', {
          name: findUserInput.name,
        });
      }

      if (findUserInput?.email) {
        qb = qb.andWhere('email = :email', {
          email: findUserInput.email,
        });
      }

      if (findUserInput?.mobile) {
        qb = qb.andWhere('mobile = :mobile', {
          mobile: findUserInput.mobile,
        });
      }

      if (findUserInput?.from) {
        qb = qb.andWhere('createdAt >= :from', {
          from: findUserInput.from,
        });
      }

      if (findUserInput?.to) {
        qb = qb.andWhere('createdAt <= :to', {
          to: findUserInput.to,
        });
      }

      return qb;
    })(queryBuilder);

    return queryBuilder.orderBy('users.createdAt', 'DESC').getMany();
  }
}
