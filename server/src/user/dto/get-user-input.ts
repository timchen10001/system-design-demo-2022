import { ArgsType, Field, ID } from '@nestjs/graphql';
import { UserDescription } from '../description/user.description';

@ArgsType()
export class FindUsersInput {
  @Field(() => [ID], { nullable: true })
  ids?: string[];

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  mobile?: string;

  @Field(() => String, { nullable: true, description: UserDescription.from })
  from?: string;

  @Field(() => String, { nullable: true, description: UserDescription.to })
  to?: string;

  @Field(() => String, { nullable: true, description: UserDescription.keyword })
  keyword?: string;
}

export const UserKeywordSearchScope = [
  'id',
  'name',
  'email',
  'mobile',
  'createdAt',
];
