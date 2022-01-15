import { Field, ObjectType } from '@nestjs/graphql';
import { JwtTokenType } from '../enum/jwt-token-type.enum';
import { Role } from '../enum/role.enum';

@ObjectType()
export class JwtPayloadInput {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => Role)
  roles: Role[];

  @Field(() => JwtTokenType)
  tokenType: JwtTokenType;
}
