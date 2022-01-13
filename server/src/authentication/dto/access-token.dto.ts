import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenInput {
  @ApiProperty()
  refreshToken: string;
}
