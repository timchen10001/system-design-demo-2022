import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
