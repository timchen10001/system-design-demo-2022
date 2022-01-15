import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  User = 'USER',
  Public = 'PUBLIC',
  Admin = 'ADMIN',
}

registerEnumType(Role, { name: 'Role' });
