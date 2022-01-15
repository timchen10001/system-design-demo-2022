import { registerEnumType } from '@nestjs/graphql';

export enum JwtTokenType {
  REGRESH_TOKEN = 'REGRESH_TOKEN',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}

registerEnumType(JwtTokenType, {
  name: 'JwtTokenType',
});
