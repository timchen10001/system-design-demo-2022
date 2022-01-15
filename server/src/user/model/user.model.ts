import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '../../auth/enum/role.enum';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'unique id.' })
  id: string;

  @Field(() => String, { description: 'sign up email.' })
  email: string;

  @Field(() => String, { description: 'user name.' })
  name: string;

  @Field(() => String)
  mobile: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}

@ObjectType()
export class UserResult {
  @Field(() => [User])
  users: User[];
}

@ObjectType()
export class MeResult extends User {
  @Field(() => Role)
  role: Role;
}
