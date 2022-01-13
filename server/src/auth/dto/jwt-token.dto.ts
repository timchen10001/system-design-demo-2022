import { ApiProperty } from '@nestjs/swagger';

export class JWTToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
