import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class JWTToken {
  @ApiProperty()
  @Field(() => String)
  accessToken: string;

  @ApiProperty()
  @Field(() => String)
  refreshToken: string;
}
