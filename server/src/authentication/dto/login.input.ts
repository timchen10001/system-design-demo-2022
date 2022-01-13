import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ArgsType()
export class LoginInput {
  @ApiProperty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @Field(() => String)
  password: string;
}
